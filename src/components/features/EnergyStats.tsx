"use client"

import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface Task {
    id: string
    title: string
    energy_level: "low" | "medium" | "high"
    duration: number
    completed: boolean
    created_at: string
}

interface EnergyStatsProps {
    tasks: Task[]
}

export function EnergyStats({ tasks }: EnergyStatsProps) {
    const activeTasks = tasks.filter(t => !t.completed)

    return (
        <div className={cn(
            "flex flex-col justify-between h-full p-6",
            "bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl border border-white/10 rounded-xl"
        )}>
            <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                    <Zap className="w-3 h-3 mr-1" />
                    ENERGY
                </Badge>
            </div>

            <div className="space-y-4">
                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-3xl font-bold tracking-tighter">
                            {activeTasks.reduce((acc, t) => acc + t.duration, 0)}m
                        </div>
                        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            Est. Time Required
                        </div>
                    </div>
                    <div className="h-10 w-10 rounded-full border-2 border-primary/20 flex items-center justify-center">
                        <span className="text-xs font-bold">{activeTasks.length}</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {['high', 'medium', 'low'].map((level) => (
                        <div key={level} className="bg-white/5 rounded-md p-2 text-center">
                            <div className={cn(
                                "text-lg font-bold",
                                level === 'high' && "text-red-400",
                                level === 'medium' && "text-yellow-400",
                                level === 'low' && "text-green-400"
                            )}>
                                {activeTasks.filter(t => (t as any).energy_level === level).length}
                            </div>
                            <div className="text-[10px] uppercase opacity-50">{level}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
