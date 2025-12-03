"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'
import { initGoogleClient, signInToGoogle, isSignedInToGoogle } from '@/lib/google-auth'


export interface Task {
    id: string
    title: string
    energy_level: "low" | "medium" | "high"
    duration: number // minutes
    completed: boolean
    created_at: string
    user_id?: string
    source?: 'supabase' | 'google'
    googleId?: string
}


interface TaskContextType {
    tasks: Task[]
    loading: boolean
    error: string | null
    createTask: (task: Omit<Task, 'id' | 'created_at' | 'user_id'>) => Promise<void>
    toggleTask: (id: string) => Promise<void>
    deleteTask: (id: string) => Promise<void>
    refreshTasks: () => Promise<void>
    isGoogleAuthenticated: boolean
    signInToGoogle: () => Promise<void>
}


const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false)

    useEffect(() => {
        const init = async () => {
            try {
                await initGoogleClient()
                setIsGoogleAuthenticated(isSignedInToGoogle())
            } catch (err) {
                console.error('Failed to init Google Client', err)
            }
        }
        init()
    }, [])


    // Load tasks when user changes
    useEffect(() => {
        if (user) {
            loadTasks()
        } else {
            setTasks([])
            setLoading(false)
        }
    }, [user])

    const cleanupOldTasks = async () => {
        if (!user) return

        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        yesterday.setHours(0, 0, 0, 0)

        try {
            const { error: deleteError } = await supabase
                .from('tasks')
                .delete()
                .lt('created_at', yesterday.toISOString())
                .eq('user_id', user.id)

            if (deleteError) throw deleteError
        } catch (err) {
            console.error('Error cleaning up old tasks:', err)
        }
    }

    const loadTasks = async () => {
        setLoading(true)
        try {
            // 1. Load Supabase Tasks
            let supabaseTasks: Task[] = []
            if (user) {
                await cleanupOldTasks()
                const { data, error: fetchError } = await supabase
                    .from('tasks')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })

                if (fetchError) throw fetchError
                if (data) supabaseTasks = data.map(t => ({ ...t, source: 'supabase' }))
            }

            // 2. Load Google Tasks
            let googleTasks: Task[] = []
            if (isGoogleAuthenticated) {
                try {
                    const response = await window.gapi.client.tasks.tasklists.list()
                    const taskLists = response.result.items || []

                    if (taskLists.length > 0) {
                        // Fetch tasks from the first list (usually 'My Tasks')
                        // We could fetch from all, but let's start with the first one
                        const listId = taskLists[0].id
                        const tasksResponse = await window.gapi.client.tasks.tasks.list({
                            tasklist: listId,
                            showCompleted: true,
                            showHidden: true,
                        })

                        const gTasks = tasksResponse.result.items || []
                        googleTasks = gTasks.map((t: any) => ({
                            id: t.id,
                            title: t.title,
                            energy_level: 'medium', // Default for Google Tasks
                            duration: 30, // Default
                            completed: t.status === 'completed',
                            created_at: t.updated || new Date().toISOString(), // Use updated as created for sorting
                            source: 'google',
                            googleId: t.id,
                        }))
                    }
                } catch (gErr) {
                    console.error('Failed to load Google Tasks', gErr)
                }
            }

            // 3. Merge and Sort
            const allTasks = [...supabaseTasks, ...googleTasks].sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )

            setTasks(allTasks)
            setError(null)
        } catch (err) {
            console.error('Error loading tasks:', err)
            setError(err instanceof Error ? err.message : 'Failed to load tasks')
        } finally {
            setLoading(false)
        }
    }


    const createTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'user_id'>) => {
        if (!user) return

        // Optimistic update: Create temporary task with pseudo-ID
        const tempId = `temp-${Date.now()}`
        const optimisticTask: Task = {
            id: tempId,
            ...taskData,
            created_at: new Date().toISOString(),
            user_id: user.id,
            source: 'supabase',
        }

        // Immediately update UI
        setTasks(prev => [optimisticTask, ...prev])

        try {
            // Perform actual database insert
            const { data, error: insertError } = await supabase
                .from('tasks')
                .insert([{
                    ...taskData,
                    user_id: user.id,
                }])
                .select()
                .single()

            if (insertError) throw insertError

            // If authenticated with Google, add to Google Tasks
            let googleId: string | undefined;
            if (isGoogleAuthenticated) {
                try {
                    // Get the first task list (usually 'My Tasks')
                    const response = await window.gapi.client.tasks.tasklists.list();
                    const taskLists = response.result.items || [];

                    if (taskLists.length > 0) {
                        const listId = taskLists[0].id;
                        const googleTask = await window.gapi.client.tasks.tasks.insert({
                            tasklist: listId,
                            resource: {
                                title: taskData.title,
                                notes: `Energy Level: ${taskData.energy_level}\nDuration: ${taskData.duration}m`,
                            }
                        });
                        googleId = googleTask.result.id;
                    }
                } catch (gErr) {
                    console.error('Failed to create task in Google Tasks', gErr);
                    // We don't block the UI if Google sync fails, but maybe show a toast?
                }
            }

            // Replace optimistic task with real task from database
            if (data) {
                setTasks(prev => prev.map(t => t.id === tempId ? {
                    ...data,
                    source: 'supabase',
                    googleId: googleId // Store googleId if we synced it (though we might need to save this to DB if we want 2-way sync later)
                } : t))
            }
        } catch (err) {
            console.error('Error creating task:', err)
            setError(err instanceof Error ? err.message : 'Failed to create task')

            // Rollback: Remove optimistic task on error
            setTasks(prev => prev.filter(t => t.id !== tempId))
            throw err
        }
    }


    const toggleTask = async (id: string) => {
        const task = tasks.find(t => t.id === id)
        if (!task) return

        // Optimistic update: Toggle immediately in UI
        const newCompletedState = !task.completed
        setTasks(prev => prev.map(t =>
            t.id === id ? { ...t, completed: newCompletedState } : t
        ))

        try {
            if (task.source === 'google' && task.googleId) {
                // Update Google Task
                // We need the list ID. For now, we assume the first list again or we need to store listId in Task
                // To keep it simple, we'll fetch lists to find the one containing this task or just try the first one
                const response = await window.gapi.client.tasks.tasklists.list()
                const taskLists = response.result.items || []
                if (taskLists.length > 0) {
                    const listId = taskLists[0].id
                    await window.gapi.client.tasks.tasks.update({
                        tasklist: listId,
                        task: task.googleId,
                        id: task.googleId,
                        resource: {
                            id: task.googleId,
                            title: task.title,
                            status: newCompletedState ? 'completed' : 'needsAction'
                        }
                    })
                }
            } else {
                // Update Supabase Task
                const { error: updateError } = await supabase
                    .from('tasks')
                    .update({ completed: newCompletedState })
                    .eq('id', id)

                if (updateError) throw updateError
            }
        } catch (err) {
            console.error('Error toggling task:', err)
            setError(err instanceof Error ? err.message : 'Failed to update task')

            // Rollback: Revert to previous state on error
            setTasks(prev => prev.map(t =>
                t.id === id ? { ...t, completed: !newCompletedState } : t
            ))
            throw err
        }
    }


    const deleteTask = async (id: string) => {
        const taskToDelete = tasks.find(t => t.id === id)
        if (!taskToDelete) return

        // Optimistic update: Remove immediately from UI
        setTasks(prev => prev.filter(t => t.id !== id))

        try {
            // Perform actual database deletion
            const { error: deleteError } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id)

            if (deleteError) throw deleteError
        } catch (err) {
            console.error('Error deleting task:', err)
            setError(err instanceof Error ? err.message : 'Failed to delete task')

            // Rollback: Restore task on error
            setTasks(prev => {
                // Insert back in original position based on created_at
                const newTasks = [...prev, taskToDelete]
                return newTasks.sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )
            })
            throw err
        }
    }

    const refreshTasks = async () => {
        await loadTasks()
    }

    const handleSignInToGoogle = async () => {
        try {
            await signInToGoogle()
            setIsGoogleAuthenticated(true)
            await loadTasks()
        } catch (err) {
            console.error('Failed to sign in to Google', err)
        }
    }

    return (
        <TaskContext.Provider value={{
            tasks,
            loading,
            error,
            createTask,
            toggleTask,
            deleteTask,
            refreshTasks,
            isGoogleAuthenticated,
            signInToGoogle: handleSignInToGoogle,
        }}>
            {children}
        </TaskContext.Provider>
    )
}

export function useTaskContext() {
    const context = useContext(TaskContext)
    if (context === undefined) {
        throw new Error('useTaskContext must be used within a TaskProvider')
    }
    return context
}
