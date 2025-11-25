"use client"

import { Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface ActivityGraphProps {
    data?: Array<{ date: string; count: number }>
    className?: string
}

export function ActivityGraph({ data = [], className }: ActivityGraphProps) {
    const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number } | null>(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    // Generate last 12 weeks of data
    const generateCalendarData = () => {
        const weeks: Array<Array<{ date: Date; count: number }>> = []
        const today = new Date()
        const startDate = new Date(today)
        startDate.setDate(today.getDate() - 83) // 12 weeks = 84 days

        // Create a map of existing data
        const dataMap = new Map(data.map(d => [d.date, d.count]))

        // Generate 12 weeks
        for (let week = 0; week < 12; week++) {
            const weekData: Array<{ date: Date; count: number }> = []
            for (let day = 0; day < 7; day++) {
                const currentDate = new Date(startDate)
                currentDate.setDate(startDate.getDate() + (week * 7) + day)

                const dateStr = currentDate.toISOString().split('T')[0]
                const count = dataMap.get(dateStr) || 0

                weekData.push({ date: currentDate, count })
            }
            weeks.push(weekData)
        }

        return weeks
    }

    const weeks = generateCalendarData()

    // Get intensity class based on count
    const getIntensityClass = (count: number) => {
        if (count === 0) return "bg-white/5"
        if (count <= 2) return "bg-primary/20"
        if (count <= 4) return "bg-primary/40"
        if (count <= 6) return "bg-primary/60"
        return "bg-primary/80"
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    const handleMouseMove = (e: React.MouseEvent, cell: { date: Date; count: number }) => {
        setHoveredCell({
            date: cell.date.toISOString().split('T')[0],
            count: cell.count
        })
        setMousePosition({ x: e.clientX, y: e.clientY })
    }

    return (
        <div className={cn(
            "flex flex-col h-full p-6",
            "bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl border border-white/10 rounded-xl",
            className
        )}>
            {/* Header: Badge on left, Legend on right */}
            <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                    <Activity className="w-3 h-3 mr-1" />
                    ACTIVITY
                </Badge>

                {/* Legend - Intensity Indicators */}
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-white/5" />
                    <div className="w-3 h-3 rounded-full bg-primary/20" />
                    <div className="w-3 h-3 rounded-full bg-primary/40" />
                    <div className="w-3 h-3 rounded-full bg-primary/60" />
                    <div className="w-3 h-3 rounded-full bg-primary/80" />
                </div>
            </div>

            {/* Large GRID Area */}
            <div className="flex-1 flex items-center justify-center border border-white/5 rounded-lg bg-black/10 relative">
                <div className="flex gap-1.5">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1.5">
                            {week.map((cell, dayIndex) => (
                                <div
                                    key={`${weekIndex}-${dayIndex}`}
                                    className={cn(
                                        "w-3 h-3 rounded-sm transition-all cursor-pointer hover:ring-2 hover:ring-primary/50",
                                        getIntensityClass(cell.count)
                                    )}
                                    onMouseEnter={(e) => handleMouseMove(e, cell)}
                                    onMouseMove={(e) => handleMouseMove(e, cell)}
                                    onMouseLeave={() => setHoveredCell(null)}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Tooltip */}
                {hoveredCell && (
                    <div
                        className="fixed z-50 bg-black/90 text-white px-3 py-1.5 rounded-md text-xs shadow-lg border border-white/10 pointer-events-none"
                        style={{
                            left: `${mousePosition.x + 10}px`,
                            top: `${mousePosition.y - 40}px`,
                        }}
                    >
                        <div className="font-medium">{hoveredCell.count} tasks</div>
                        <div className="opacity-70">{formatDate(new Date(hoveredCell.date))}</div>
                    </div>
                )}
            </div>
        </div>
    )
}
