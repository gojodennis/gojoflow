"use client"

import { useState, useEffect } from "react"
import { Check, RotateCcw, Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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
                {/* Timer Display */}
                <div className="text-[120px] font-bold font-mono tracking-tighter tabular-nums text-white leading-none">
                    {formatTime(timeLeft)}
                </div>

                {/* Progress Bar */}
                <div className="w-[500px] h-3 bg-background/60 backdrop-blur-xl border border-white/10 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full transition-all duration-1000",
                            progress < 33 ? "bg-emerald-500" :
                                progress < 66 ? "bg-orange-500" :
                                    "bg-pink-500"
                        )}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Action Buttons - Carousel Pill Style */}
                <div className="flex p-1.5 bg-background/60 backdrop-blur-xl border border-white/10 rounded-lg gap-1">
                    {/* Done Button */}
                    <Button
                        variant="ghost"
                        onClick={onExit}
                        className={cn(
                            "h-10 px-4 text-sm font-medium rounded-md transition-all",
                            "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                        )}
                    >
                        <Check className="w-4 h-4 mr-2" />
                        Done
                    </Button>

                    {/* Restart Button */}
                    <Button
                        variant="ghost"
                        onClick={resetTimer}
                        className={cn(
                            "h-10 px-4 text-sm font-medium rounded-md transition-all",
                            "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                        )}
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Restart
                    </Button>

                    {/* Play/Pause Button */}
                    <Button
                        variant="ghost"
                        onClick={toggleTimer}
                        className={cn(
                            "h-10 px-4 text-sm font-medium rounded-md transition-all",
                            "bg-pink-500/20 text-pink-400 hover:bg-pink-500/30"
                        )}
                    >
                        {isActive ? (
                            <>
                                <Pause className="w-4 h-4 mr-2" />
                                Pause
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 mr-2" />
                                Play
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
