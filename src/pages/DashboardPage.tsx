"use client"

import { TaskList } from "@/components/features/TaskList"
import { SmallCalendar } from "@/components/features/SmallCalendar"
import { EnergyStats } from "@/components/features/EnergyStats"
import { StatsCarousel } from "@/components/features/StatsCarousel"
import { FeedbackPopup } from "@/components/features/FeedbackPopup"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useTaskContext } from "@/components/providers/TaskContext"

export default function DashboardPage() {
    const { tasks } = useTaskContext()
    const [currentDate, setCurrentDate] = useState<Date>(new Date())
    const navigate = useNavigate()

    const handleFocusTask = (taskId: string) => {
        navigate(`/pomodoro?taskId=${taskId}`)
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
                        <TaskList onEnterFocus={handleFocusTask} className="min-h-[400px] h-auto" />
                    </div>
                </div>

                {/* Desktop View: 3 Columns */}
                <div className="hidden md:grid grid-cols-12 gap-4 h-full">
                    {/* Center: Task List (8 cols) */}
                    <div className="col-span-8 h-full overflow-hidden">
                        <TaskList onEnterFocus={handleFocusTask} />
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
