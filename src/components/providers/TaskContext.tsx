"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'

export interface Task {
    id: string
    title: string
    energy_level: "low" | "medium" | "high"
    duration: number // minutes
    completed: boolean
    created_at: string
    user_id?: string
}

interface TaskContextType {
    tasks: Task[]
    loading: boolean
    error: string | null
    createTask: (task: Omit<Task, 'id' | 'created_at' | 'user_id'>) => Promise<void>
    toggleTask: (id: string) => Promise<void>
    deleteTask: (id: string) => Promise<void>
    refreshTasks: () => Promise<void>
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

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
        if (!user) {
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            await cleanupOldTasks()
            setError(null)
            const { data, error: fetchError } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (fetchError) throw fetchError
            if (data) setTasks(data)
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

            // Replace optimistic task with real task from database
            if (data) {
                setTasks(prev => prev.map(t => t.id === tempId ? data : t))
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
            // Perform actual database update
            const { error: updateError } = await supabase
                .from('tasks')
                .update({ completed: newCompletedState })
                .eq('id', id)

            if (updateError) throw updateError
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

    return (
        <TaskContext.Provider value={{
            tasks,
            loading,
            error,
            createTask,
            toggleTask,
            deleteTask,
            refreshTasks,
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
