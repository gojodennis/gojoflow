"use client"

import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/store/useStore"
import { autoSchedule, checkBurnout } from "@/lib/scheduler"
import { Wand2, Check, X, AlertTriangle, Calendar as CalendarIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/providers/AuthProvider"

interface TimeBlock {
    id: string
    task: {
        title: string
        energy_level: "low" | "medium" | "high"
    }
    start_time: string
    end_time: string
    isGhost?: boolean
    taskId?: string
}

export function CalendarView({ quote }: { quote?: React.ReactNode }) {
    const { user } = useAuth()
    const [date] = React.useState<Date | undefined>(new Date())
    const [blocks, setBlocks] = useState<TimeBlock[]>([])
    const [proposedBlocks, setProposedBlocks] = useState<TimeBlock[]>([])
    const { energy } = useStore()

    useEffect(() => {
        if (user) fetchBlocks()

        // Listen for task updates
        const handleTaskUpdate = () => {
            if (user) fetchBlocks()
        }
        window.addEventListener('tasksUpdated', handleTaskUpdate)
        return () => window.removeEventListener('tasksUpdated', handleTaskUpdate)
    }, [date, user])

    const fetchBlocks = async () => {
        if (!date || !user) return

        try {
            const { data: tasks, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', user.id)

            if (error) throw error
            if (!tasks) {
                setBlocks([])
                return
            }

            const startOfDay = new Date(date)
            startOfDay.setHours(0, 0, 0, 0)

            const endOfDay = new Date(date)
            endOfDay.setHours(23, 59, 59, 999)

            // Filter tasks created on this day and map to blocks
            const dayBlocks = tasks
                .filter(task => {
                    const taskDate = new Date(task.created_at)
                    return taskDate >= startOfDay && taskDate <= endOfDay
                })
                .map(task => {
                    const startTime = new Date(task.created_at)
                    const endTime = new Date(startTime.getTime() + task.duration * 60000)

                    return {
                        id: task.id,
                        task: {
                            title: task.title,
                            energy_level: task.energy_level
                        },
                        start_time: startTime.toISOString(),
                        end_time: endTime.toISOString()
                    }
                })

            setBlocks(dayBlocks)
        } catch (error) {
            console.error('Error fetching blocks:', error)
        }
    }

    const handleAutoSchedule = async () => {
        if (!date || !user) return

        try {
            // 1. Fetch incomplete tasks from Supabase
            const { data: incompleteTasks, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', user.id)
                .eq('completed', false)

            if (error) throw error
            if (!incompleteTasks) return

            // 2. Run Scheduler
            const result = autoSchedule(
                incompleteTasks,
                blocks,
                energy,
                date // Pass the selected date
            )

            // 3. Convert result to TimeBlocks for display
            const ghosts: TimeBlock[] = result.scheduled.map(s => ({
                id: `ghost-${s.task.id}`,
                task: {
                    title: s.task.title,
                    energy_level: s.task.energy_level
                },
                start_time: s.start.toISOString(),
                end_time: s.end.toISOString(),
                isGhost: true,
                taskId: s.task.id
            }))

            setProposedBlocks(ghosts)
        } catch (error) {
            console.error("Auto schedule failed", error)
        }
    }

    const confirmSchedule = async () => {
        if (!user) return
        try {
            // Actually, let's do Promise.all for safety and simplicity
            await Promise.all(proposedBlocks.map(block =>
                supabase
                    .from('tasks')
                    .update({ created_at: block.start_time })
                    .eq('id', block.taskId)
            ))

            window.dispatchEvent(new Event('tasksUpdated'))

            setProposedBlocks([])
            fetchBlocks()
        } catch (error) {
            console.error("Failed to save schedule", error)
        }
    }

    const cancelSchedule = () => {
        setProposedBlocks([])
    }

    // Helper to calculate position and height based on time
    const getBlockStyle = (start: string, end: string) => {
        const startDate = new Date(start)
        const endDate = new Date(end)

        const startHour = startDate.getHours()
        const startMin = startDate.getMinutes()

        // Start from 8:00 AM
        const startOffset = (startHour - 8) * 60 + startMin
        const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60)

        return {
            top: `${startOffset * 2}px`, // 2px per minute
            height: `${duration * 2}px`
        }
    }

    const allBlocks = [...blocks, ...proposedBlocks]
    const { isBurnout, totalHours } = checkBurnout(allBlocks)

    return (
        <div className="flex h-full flex-col md:flex-row gap-4 p-4">
            {/* Sidebar - Calendar & Graph */}
            {quote && (
                <div className={cn(
                    "w-full md:w-auto flex flex-col gap-4",
                    "bg-background/60 backdrop-blur-xl border border-white/10 rounded-xl p-4"
                )}>
                    {quote}
                </div>
            )}

            {/* Main Schedule View */}
            <div className={cn(
                "flex-1 flex flex-col h-full overflow-hidden",
                "bg-background/60 backdrop-blur-xl border border-white/10 rounded-xl"
            )}>
                <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 bg-white/5">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-primary" />
                            <h2 className="font-semibold text-lg tracking-tight">
                                {date?.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}
                            </h2>
                        </div>
                        {isBurnout && (
                            <div className="flex items-center text-amber-500 text-sm animate-pulse">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                <span>High Load: {totalHours.toFixed(1)}h scheduled</span>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        {proposedBlocks.length > 0 ? (
                            <>
                                <Button size="sm" variant="ghost" onClick={cancelSchedule} className="text-muted-foreground hover:text-destructive flex-1 sm:flex-none">
                                    <X className="mr-2 h-4 w-4" /> Cancel
                                </Button>
                                <Button size="sm" onClick={confirmSchedule} className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none shadow-lg shadow-green-900/20">
                                    <Check className="mr-2 h-4 w-4" /> Apply
                                </Button>
                            </>
                        ) : (
                            <Button size="sm" variant="outline" onClick={handleAutoSchedule} className="w-full sm:w-auto border-primary/20 hover:bg-primary/10 hover:text-primary transition-all">
                                <Wand2 className="mr-2 h-4 w-4" /> Auto Schedule
                            </Button>
                        )}
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="relative min-h-[1000px] p-4 bg-[size:20px_20px] bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)]">
                        {/* Time Grid */}
                        {Array.from({ length: 13 }).map((_, i) => {
                            const hour = i + 8 // Start at 8 AM
                            return (
                                <div key={hour} className="absolute w-full border-t border-dashed border-white/5 text-xs text-muted-foreground" style={{ top: `${i * 60 * 2}px` }}>
                                    <span className="absolute -top-3 left-0 bg-background/50 backdrop-blur px-2 rounded font-mono text-[10px]">{hour}:00</span>
                                </div>
                            )
                        })}

                        {/* Blocks */}
                        <div className="ml-12 relative h-full">
                            {allBlocks.map(block => (
                                <div
                                    key={block.id}
                                    className={cn(
                                        "absolute w-[95%] rounded-md border p-3 text-sm transition-all hover:scale-[1.01] hover:shadow-lg cursor-pointer group",
                                        "backdrop-blur-md",
                                        block.isGhost ? "opacity-60 border-dashed bg-primary/5 border-primary/30" : (
                                            block.task.energy_level === "high" ? "bg-red-500/10 border-red-500/20 text-red-200" :
                                                block.task.energy_level === "medium" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-200" :
                                                    "bg-green-500/10 border-green-500/20 text-green-200"
                                        )
                                    )}
                                    style={getBlockStyle(block.start_time, block.end_time)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="font-semibold tracking-tight">{block.task.title}</div>
                                        <Badge variant="outline" className={cn(
                                            "text-[10px] h-5 px-1 bg-black/20 border-0",
                                            block.task.energy_level === "high" ? "text-red-400" :
                                                block.task.energy_level === "medium" ? "text-yellow-400" :
                                                    "text-green-400"
                                        )}>
                                            {block.task.energy_level}
                                        </Badge>
                                    </div>
                                    <div className="text-xs opacity-60 mt-1 font-mono">
                                        {new Date(block.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                        {new Date(block.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}
