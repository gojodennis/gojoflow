"use client"

import { TaskList } from "@/components/features/TaskList"
import { SmallCalendar } from "@/components/features/SmallCalendar"
import { EnergyStats } from "@/components/features/EnergyStats"
import { StatsCarousel } from "@/components/features/StatsCarousel"
import { FocusMode } from "@/components/features/FocusMode"
import { FeedbackPopup } from "@/components/features/FeedbackPopup"
import { useState } from "react"
import { useTaskContext } from "@/components/providers/TaskContext"

export default function DashboardPage() {
    const { tasks, toggleTask } = useTaskContext()
    const [currentDate, setCurrentDate] = useState<Date>(new Date())
    const [focusTaskId, setFocusTaskId] = useState<string | null>(null)

    if (focusTaskId) {
        return (
            <div className="h-full p-4 bg-background overflow-hidden">
                <FocusMode
                    onExit={() => setFocusTaskId(null)}
                    onComplete={async () => {
                        await toggleTask(focusTaskId)
                        setFocusTaskId(null)
                    }}
                    duration={tasks.find(t => t.id === focusTaskId)?.duration}
                />
            </div>
        )
    }

    return (
        <>
            <div className="h-full p-4 gap-4 bg-background overflow-hidden flex flex-col md:block">

                {/* Mobile View: Stack */}
                <div className="md:hidden flex flex-col gap-4 h-full overflow-y-auto pb-20">
                    <div className="h-[400px] shrink-0">
                        <StatsCarousel
                            calendar={<SmallCalendar currentDate={currentDate} onMonthChange={setCurrentDate} />}
                            energy={<EnergyStats tasks={tasks} />}
                        />
                    </div>
                    <div className="shrink-0">
                        <TaskList onEnterFocus={setFocusTaskId} className="min-h-[400px] h-auto" />
                    </div>
                </div>

                {/* Desktop View: 3 Columns */}
                <div className="hidden md:grid grid-cols-12 gap-4 h-full">
                    {/* Center: Task List (8 cols) */}
                    <div className="col-span-8 h-full overflow-hidden">
                        <TaskList onEnterFocus={setFocusTaskId} />
                    </div>

                    {/* Right: Graphs (4 cols) */}
                    <div className="col-span-4 h-full flex flex-col gap-4 overflow-hidden">
                        <div className="flex-1 min-h-[350px]">
                            <StatsCarousel
                                calendar={<SmallCalendar currentDate={currentDate} onMonthChange={setCurrentDate} />}
                                energy={<EnergyStats tasks={tasks} />}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback Popup for New Users */}
            <FeedbackPopup />
        </>
    )
}
