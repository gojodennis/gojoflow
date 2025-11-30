"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { type Task } from "@/components/providers/TaskContext"

interface BeatingHeartProps {
    tasks: Task[]
}

export function BeatingHeart({ tasks }: BeatingHeartProps) {
    const activeTasks = tasks.filter(t => !t.completed)
    const totalTasks = activeTasks.length
    const highPriorityCount = activeTasks.filter(t => t.energy_level === 'high').length
    const mediumPriorityCount = activeTasks.filter(t => t.energy_level === 'medium').length

    // Calculate stress level (0-100)
    // High priority tasks contribute more to stress
    const stressLevel = Math.min(100,
        (highPriorityCount * 25) +
        (mediumPriorityCount * 10) +
        (activeTasks.filter(t => t.energy_level === 'low').length * 5)
    )

    // Calculate animation speed based on task count and priority
    // Base speed: 1.5s, speeds up with more tasks
    // High priority tasks make it beat even faster
    const baseSpeed = 1.5
    const speedMultiplier = 1 - (Math.min(totalTasks, 10) / 20) - (highPriorityCount * 0.05)
    const animationDuration = Math.max(0.4, baseSpeed * speedMultiplier)

    // Color interpolation based on stress
    const getHeartColor = () => {
        if (stressLevel === 0) return "text-green-400"
        if (stressLevel < 20) return "text-green-400"
        if (stressLevel < 40) return "text-yellow-400"
        if (stressLevel < 60) return "text-orange-400"
        if (stressLevel < 80) return "text-red-400"
        return "text-red-500"
    }

    // Glow intensity based on stress
    const getGlowIntensity = () => {
        if (stressLevel < 20) return "drop-shadow-[0_0_4px_rgba(74,222,128,0.4)]"
        if (stressLevel < 40) return "drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]"
        if (stressLevel < 60) return "drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]"
        if (stressLevel < 80) return "drop-shadow-[0_0_10px_rgba(248,113,113,0.7)]"
        return "drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]"
    }

    return (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <div
                className={cn(
                    "relative transition-all duration-300",
                    getHeartColor(),
                    getGlowIntensity()
                )}
                style={{
                    animation: `heartbeat ${animationDuration}s ease-in-out infinite`
                }}
            >
                <Heart
                    className="w-32 h-32"
                    fill="currentColor"
                    strokeWidth={1.5}
                />

                {/* Stress level indicator */}
                {totalTasks > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white drop-shadow-lg">
                            {totalTasks}
                        </span>
                    </div>
                )}
            </div>

            {/* Status text */}
            <div className="text-center space-y-1">
                <div className="text-sm font-medium text-foreground/80">
                    {totalTasks === 0 && "All calm, no stress! 💚"}
                    {totalTasks > 0 && stressLevel < 20 && "Smooth sailing 🌊"}
                    {stressLevel >= 20 && stressLevel < 40 && "Getting busy 📝"}
                    {stressLevel >= 40 && stressLevel < 60 && "Things heating up 🔥"}
                    {stressLevel >= 60 && stressLevel < 80 && "High pressure! 😰"}
                    {stressLevel >= 80 && "Critical stress! 🚨"}
                </div>
                <div className="text-xs text-muted-foreground">
                    Stress Level: {stressLevel}%
                </div>
            </div>

            <style jsx>{`
                @keyframes heartbeat {
                    0%, 100% {
                        transform: scale(1);
                    }
                    10% {
                        transform: scale(1.1);
                    }
                    20% {
                        transform: scale(1);
                    }
                    30% {
                        transform: scale(1.1);
                    }
                    40% {
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    )
}
