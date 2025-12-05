"use client"

import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { type Task } from "@/components/providers/TaskContext"
import { BeatingHeart } from "@/components/ui/beating-heart"

interface EnergyStatsProps {
    tasks: Task[]
}

export function EnergyStats({ tasks }: EnergyStatsProps) {
    const activeTasks = tasks.filter(t => !t.completed)

    return (
        <div className={cn(
            "flex flex-col h-full p-5",
            "bg-card border rounded-xl shadow-sm"
        )}>
            <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-primary text-primary-foreground border-primary px-2 py-0.5 h-6">
                    <Zap className="w-3 h-3 mr-1.5" />
                    ENERGY
                </Badge>
            </div>

            <div className="space-y-4 flex-1 flex flex-col">
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

                {/* Animated beating heart - fills the available space */}
                <BeatingHeart tasks={tasks} />

                <div className="grid grid-cols-3 gap-2">
                    {(['high', 'medium', 'low'] as const).map((level) => (
                        <div key={level} className="border bg-card/50 rounded-md p-2 text-center">
                            <div className={cn(
                                "text-lg font-bold",
                                level === 'high' && "text-foreground",
                                level === 'medium' && "text-muted-foreground",
                                level === 'low' && "text-muted-foreground opacity-70"
                            )}>
                                {activeTasks.filter(t => t.energy_level === level).length}
                            </div>
                            <div className="text-[10px] uppercase text-muted-foreground">{level}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
