"use client"

import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface SmallCalendarProps {
    currentDate?: Date
    onMonthChange?: (date: Date) => void
    onDateSelect?: (date: Date) => void
}

export function SmallCalendar({ currentDate = new Date(), onMonthChange, onDateSelect }: SmallCalendarProps) {
    const [displayDate, setDisplayDate] = useState(currentDate)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const today = new Date()

    const daysInMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1).getDay()

    const monthName = displayDate.toLocaleString('default', { month: 'long' })
    const currentMonthName = today.toLocaleString('default', { month: 'long' })
    const year = displayDate.getFullYear()
    const dayOfMonth = today.getDate()
    const dayName = today.toLocaleDateString('default', { weekday: 'long' })

    const handlePrevMonth = () => {
        const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1)
        setDisplayDate(newDate)
        onMonthChange?.(newDate)
    }

    const handleNextMonth = () => {
        const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1)
        setDisplayDate(newDate)
        onMonthChange?.(newDate)
    }

    const handleDateClick = (day: number) => {
        const newSelectedDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day)
        setSelectedDate(newSelectedDate)
        onDateSelect?.(newSelectedDate)
    }

    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i)
    }

    return (
        <div className={cn(
            "flex flex-col h-full p-6 gap-4",
            "bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl border rounded-xl"
        )}>
            <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    CALENDAR
                </Badge>
            </div>

            {/* Horizontal Layout: Date on Left, Calendar on Right */}
            <div className="flex-1 flex gap-6 min-h-0">
                {/* Left: Large Date Display */}
                <div className="flex flex-col justify-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        {currentMonthName}
                    </div>
                    <div className="text-6xl font-bold tracking-tighter tabular-nums leading-none mb-2">
                        {dayOfMonth}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium lowercase">
                        {dayName}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        {year}
                    </div>
                </div>

                {/* Right: Calendar Grid */}
                <div className="flex-1 flex flex-col gap-2 min-h-0">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between shrink-0">
                        <div className="text-sm font-semibold tracking-tight">
                            {monthName}
                        </div>
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={handlePrevMonth}
                            >
                                <ChevronLeft className="h-3 w-3" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={handleNextMonth}
                            >
                                <ChevronRight className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-1 shrink-0">
                        {['s', 'm', 't', 'w', 't', 'f', 's'].map((day, i) => (
                            <div key={i} className="text-[10px] text-muted-foreground text-center font-medium lowercase">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days Grid */}
                    <div className="grid grid-cols-7 grid-rows-6 gap-1 flex-1">
                        {days.map((day, index) => {
                            const isToday = day === today.getDate() &&
                                displayDate.getMonth() === today.getMonth() &&
                                displayDate.getFullYear() === today.getFullYear()

                            const isSelected = selectedDate &&
                                day === selectedDate.getDate() &&
                                displayDate.getMonth() === selectedDate.getMonth() &&
                                displayDate.getFullYear() === selectedDate.getFullYear()

                            return (
                                <button
                                    key={index}
                                    onClick={() => day !== null && handleDateClick(day)}
                                    disabled={day === null}
                                    className={cn(
                                        "flex items-center justify-center text-[11px] rounded-sm transition-all min-h-0",
                                        day === null && "invisible cursor-default",
                                        day !== null && "hover:bg-white/10 cursor-pointer",
                                        isToday && "bg-black dark:bg-white text-white dark:text-black font-bold border-2 border-black dark:border-white",
                                        isSelected && !isToday && "bg-primary/30 text-primary-foreground ring-1 ring-primary"
                                    )}
                                >
                                    {day}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
