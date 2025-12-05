"use client"

import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useCalendarStore } from "@/store/calendar-store"
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    addMonths,
    subMonths,
    isWeekend
} from "date-fns"

interface SmallCalendarProps {
    currentDate?: Date
    onMonthChange?: (date: Date) => void
    onDateSelect?: (date: Date) => void
}

export function SmallCalendar({ currentDate = new Date(), onMonthChange, onDateSelect }: SmallCalendarProps) {
    const { events } = useCalendarStore()
    const [displayDate, setDisplayDate] = useState(currentDate)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const handlePrevMonth = () => {
        const newDate = subMonths(displayDate, 1)
        setDisplayDate(newDate)
        onMonthChange?.(newDate)
    }

    const handleNextMonth = () => {
        const newDate = addMonths(displayDate, 1)
        setDisplayDate(newDate)
        onMonthChange?.(newDate)
    }

    const handleDateClick = (date: Date) => {
        setSelectedDate(date)
        onDateSelect?.(date)
    }

    // Generate calendar grid
    const monthStart = startOfMonth(displayDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

    // Helper to get events for a day
    const getDayEvents = (date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd")
        return events.filter(event => event.date === dateStr)
    }

    return (
        <div className={cn(
            "flex flex-col h-full p-5 gap-4",
            "bg-card border rounded-xl shadow-sm"
        )}>
            {/* Header: Title & Navigation */}
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground border-primary px-2 py-0.5 h-6">
                        <CalendarIcon className="w-3 h-3 mr-1.5" />
                        CALENDAR
                    </Badge>
                    <span className="text-sm font-semibold ml-1">
                        {format(displayDate, "MMMM yyyy")}
                    </span>
                </div>
                <div className="flex gap-0.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-accent rounded-md"
                        onClick={handlePrevMonth}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-accent rounded-md"
                        onClick={handleNextMonth}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} className="text-[11px] text-muted-foreground text-center font-medium h-6 flex items-center justify-center">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 flex-1 auto-rows-fr gap-1.5">
                    {calendarDays.map((date, index) => {
                        const isCurrentMonth = isSameMonth(date, monthStart)
                        const isDateToday = isToday(date)
                        const isDateSelected = selectedDate && isSameDay(date, selectedDate)
                        const dayEvents = getDayEvents(date)
                        const isWeekendDay = isWeekend(date)

                        return (
                            <button
                                key={index}
                                onClick={() => handleDateClick(date)}
                                className={cn(
                                    "relative flex flex-col items-center justify-start pt-1.5 rounded-md transition-all duration-200 group",
                                    "hover:scale-105 hover:shadow-sm hover:z-10",
                                    !isCurrentMonth && "opacity-30 hover:opacity-50",
                                    isWeekendDay && isCurrentMonth && !isDateSelected && !isDateToday && "bg-accent/20",
                                    isDateSelected && !isDateToday && "bg-primary/10 ring-1 ring-primary text-primary",
                                    isDateToday && "bg-primary text-primary-foreground font-bold shadow-md ring-2 ring-primary/20",
                                    !isDateSelected && !isDateToday && isCurrentMonth && "hover:bg-accent",
                                )}
                            >
                                <span className={cn(
                                    "text-[13px] leading-none",
                                    !isCurrentMonth && "text-muted-foreground"
                                )}>
                                    {format(date, "d")}
                                </span>

                                {/* Event Indicators */}
                                <div className="flex gap-0.5 mt-1 h-1.5 items-end">
                                    {dayEvents.slice(0, 3).map((_, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "w-1 h-1 rounded-full",
                                                isDateToday ? "bg-primary-foreground" : "bg-primary/70"
                                            )}
                                        />
                                    ))}
                                    {dayEvents.length > 3 && (
                                        <div className={cn(
                                            "w-0.5 h-0.5 rounded-full mb-0.5",
                                            isDateToday ? "bg-primary-foreground" : "bg-primary/70"
                                        )} />
                                    )}
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
