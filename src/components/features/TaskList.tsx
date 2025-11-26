"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Clock, Play, Trash2, Plus, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/AuthProvider"
import { useTaskContext, type Task } from "@/components/providers/TaskContext"
import { predictEnergyLevel, extractDuration } from "@/lib/ai-utils"

function TaskCard({ task, onToggle, onDelete, onFocus }: { task: Task, onToggle: (id: string) => void, onDelete: (id: string) => void, onFocus: (id: string) => void }) {
    return (
        <div className={cn(
            "group flex items-center gap-3 rounded-lg border p-3 transition-all hover:bg-accent/50",
            "bg-background/40 backdrop-blur-sm",
            task.completed && "opacity-50"
        )}>
            <button
                onClick={() => onToggle(task.id)}
                className={cn(
                    "text-muted-foreground hover:text-primary transition-colors",
                    task.completed && "text-green-500"
                )}
            >
                {task.completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                ) : (
                    <Circle className="h-5 w-5" />
                )}
            </button>
            <div className="flex-1 flex-col gap-1">
                <span className={cn("font-medium text-sm", task.completed && "line-through")}>
                    {task.title}
                </span>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                    <span className={cn(
                        "font-bold",
                        task.energy_level === "high" && "text-red-400",
                        task.energy_level === "medium" && "text-yellow-400",
                        task.energy_level === "low" && "text-green-400",
                        task.title.toLowerCase().includes("meow") && "animate-[shizo-glow_2s_ease-in-out_infinite] text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
                    )}>
                        {task.title.toLowerCase().includes("meow") ? "shizo" : task.energy_level}
                    </span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{task.duration}m</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(task.id)}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
                {!task.completed && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                        onClick={() => onFocus(task.id)}
                    >
                        <Play className="h-3.5 w-3.5" />
                    </Button>
                )}
            </div>
        </div>
    )
}

interface TaskListProps {
    onEnterFocus?: (taskId: string) => void
    className?: string
}
export function TaskList({ onEnterFocus, className }: TaskListProps) {
    const { user } = useAuth()
    const { tasks, loading, createTask, toggleTask, deleteTask } = useTaskContext()
    const [newTaskTitle, setNewTaskTitle] = useState("")

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTaskTitle.trim() || !user) return

        try {
            await createTask({
                title: newTaskTitle,
                energy_level: predictEnergyLevel(newTaskTitle),
                duration: extractDuration(newTaskTitle) || 30,
                completed: false,
            })
            setNewTaskTitle("")
        } catch (error) {
            // Error already logged in context, just clear the input
            console.error('Failed to create task')
        }
    }


    const handleToggleTask = async (id: string) => {
        try {
            await toggleTask(id)
        } catch (error) {
            // Error already handled in context
        }
    }

    const handleDeleteTask = async (id: string) => {
        try {
            await deleteTask(id)
        } catch (error) {
            // Error already handled in context
        }
    }


    const activeTasks = tasks.filter(t => !t.completed)
    const completedTasks = tasks.filter(t => t.completed)

    if (loading) {
        return (
            <div className={cn("relative h-full w-full overflow-hidden flex flex-col", className)}>
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50" />
                    <div className="absolute inset-0 bg-[size:20px_20px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />
                </div>

                <div className={cn(
                    "flex-1 flex flex-col",
                    "bg-background/60 backdrop-blur-xl border rounded-xl overflow-hidden shadow-2xl"
                )}>
                    {/* Header Skeleton */}
                    <div className="relative p-6 border-b">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-4 w-32 hidden md:block" />
                            </div>
                            <Skeleton className="h-5 w-20 hidden md:block" />
                        </div>
                        {/* Input Skeleton */}
                        <Skeleton className="h-12 w-full rounded-md" />
                    </div>

                    {/* Task List Skeleton */}
                    <div className="flex-1 p-4 space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-background/40">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <div className="flex-1 flex flex-col gap-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-3 w-12" />
                                        <Skeleton className="h-3 w-8" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (!user) {
        const { openAuthModal } = useAuth()
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <p className="text-muted-foreground mb-4">Please sign in to manage your tasks.</p>
                <Button onClick={openAuthModal}>Sign In</Button>
            </div>
        )
    }

    return (
        <div className={cn("relative h-full w-full overflow-hidden flex flex-col", className)}>
            {/* Background Effects */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50" />
                <div className="absolute inset-0 bg-[size:20px_20px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />
            </div>

            <div className={cn(
                "flex-1 flex flex-col",
                "bg-background/60 backdrop-blur-xl border rounded-xl overflow-hidden shadow-2xl"
            )}>
                <div className="relative p-6 border-b">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                <Sparkles className="w-3 h-3 mr-1" />
                                TODAY'S FOCUS
                            </Badge>
                            <span className="hidden md:inline text-xs text-muted-foreground font-mono">
                                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                        <span className="md:hidden text-xs text-muted-foreground font-mono">
                            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                        </span>
                        <Badge variant="outline" className="hidden md:flex font-mono text-xs">
                            {activeTasks.length} PENDING
                        </Badge>
                    </div>

                    <form onSubmit={handleCreateTask} className="relative group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Plus className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                        <Input
                            name="title"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            className="pl-10 h-12 bg-background/50 focus:border-primary/50 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                            autoComplete="off"
                        />
                        <div className="absolute inset-y-0 right-2 flex items-center">
                            <Button
                                type="submit"
                                size="sm"
                                className="h-8 px-3 opacity-0 group-focus-within:opacity-100 transition-all translate-x-2 group-focus-within:translate-x-0"
                            >
                                Add
                            </Button>
                        </div>
                    </form>
                </div>

                <ScrollArea className="flex-1 p-4" showScrollBar={false}>
                    <div className="flex flex-col gap-2">
                        {activeTasks.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                    <CheckCircle2 className="h-6 w-6 text-primary/50" />
                                </div>
                                <p className="text-sm">All caught up!</p>
                                <p className="text-xs opacity-50">Add a task to get started.</p>
                            </div>
                        )}
                        {activeTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggle={handleToggleTask}
                                onDelete={handleDeleteTask}
                                onFocus={(id) => onEnterFocus?.(id)}
                            />
                        ))}
                    </div>

                    {completedTasks.length > 0 && (
                        <div className="mt-6 pt-6 border-t">
                            <div className="text-xs font-semibold text-muted-foreground mb-3 px-1">COMPLETED</div>
                            {completedTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onToggle={handleToggleTask}
                                    onDelete={handleDeleteTask}
                                    onFocus={(id) => onEnterFocus?.(id)}
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    )
}
