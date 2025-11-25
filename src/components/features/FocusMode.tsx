"use client"

import { useState, useEffect } from "react"
import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface FocusModeProps {
    onExit: () => void
}

export function FocusMode({ onExit }: FocusModeProps) {
    const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            setIsActive(false)
        }

        return () => clearInterval(interval)
    }, [isActive, timeLeft])

    const toggleTimer = () => setIsActive(!isActive)
    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(25 * 60)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100

    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden z-50">
            {/* Main Timer Container */}
            <div className="flex flex-col items-center justify-center gap-8">
                {/* Energy Indicator */}
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
                    <Zap className="text-white fill-white" size={32} />
                </div>

                {/* Timer Display */}
                <div className="text-[120px] font-bold font-mono tracking-tighter tabular-nums text-white leading-none">
                    {formatTime(timeLeft)}
                </div>

                {/* Progress Bar */}
                <div className="w-[500px] h-3 bg-neutral-900 rounded-full overflow-hidden mb-4">
                    <div
                        className={cn(
                            "h-full transition-all duration-1000",
                            progress < 33 ? "bg-emerald-400" :
                                progress < 66 ? "bg-orange-400" :
                                    "bg-pink-400"
                        )}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-6 mt-4">
                    {/* Done Button */}
                    <button
                        onClick={onExit}
                        className="w-24 h-24 bg-emerald-400 hover:bg-emerald-500 rounded-2xl transition-all shadow-lg shadow-emerald-400/30 hover:scale-105 active:scale-95"
                        aria-label="Done"
                    >
                        <span className="sr-only">Done</span>
                    </button>

                    {/* Restart Button */}
                    <button
                        onClick={resetTimer}
                        className="w-24 h-24 bg-orange-300 hover:bg-orange-400 rounded-2xl transition-all shadow-lg shadow-orange-300/30 hover:scale-105 active:scale-95"
                        aria-label="Restart"
                    >
                        <span className="sr-only">Restart</span>
                    </button>

                    {/* Pause Button */}
                    <button
                        onClick={toggleTimer}
                        className="w-24 h-24 bg-pink-300 hover:bg-pink-400 rounded-2xl transition-all shadow-lg shadow-pink-300/30 hover:scale-105 active:scale-95"
                        aria-label={isActive ? "Pause" : "Play"}
                    >
                        <span className="sr-only">{isActive ? "Pause" : "Play"}</span>
                    </button>
                </div>

                {/* Button Labels */}
                <div className="flex items-center justify-center gap-6 mt-2">
                    <span className="w-24 text-center text-emerald-400 font-bold text-lg">DONE</span>
                    <span className="w-24 text-center text-orange-300 font-bold text-lg">RESTART</span>
                    <span className="w-24 text-center text-pink-300 font-bold text-lg">{isActive ? "PAUSE" : "PLAY"}</span>
                </div>
            </div>
        </div>
    )
}
