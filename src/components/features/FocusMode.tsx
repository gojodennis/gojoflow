"use client"

import { useState, useEffect } from "react"
import { Check, RotateCcw, Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FocusModeProps {
    onExit: () => void
    onComplete?: () => void
}

export function FocusMode({ onExit, onComplete }: FocusModeProps) {
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
        <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden z-50 p-4">
            {/* Main Timer Container */}
            <div className="flex flex-col items-center justify-center gap-6 md:gap-8 w-full max-w-2xl">
                {/* Timer Display */}
                <div className="text-7xl md:text-9xl font-bold font-mono tracking-tighter tabular-nums text-white leading-none">
                    {formatTime(timeLeft)}
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-md md:max-w-2xl h-2 md:h-3 bg-white/10 border border-white/20 rounded-full overflow-hidden">
                    <div
                        className="h-full transition-all duration-1000 bg-white/90"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Action Buttons - Minimal Style */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 w-full max-w-md">
                    {/* Done Button */}
                    <Button
                        variant="ghost"
                        onClick={() => {
                            if (onComplete) {
                                onComplete()
                            } else {
                                onExit()
                            }
                        }}
                        className={cn(
                            "min-h-[44px] px-4 md:px-6 text-sm font-medium rounded-md transition-all",
                            "border border-white/20 text-white/90 hover:bg-white/10 hover:border-white/30"
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
                            "min-h-[44px] px-4 md:px-6 text-sm font-medium rounded-md transition-all",
                            "border border-white/20 text-white/90 hover:bg-white/10 hover:border-white/30"
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
                            "min-h-[44px] px-4 md:px-6 text-sm font-medium rounded-md transition-all",
                            "border border-white/20 text-white/90 hover:bg-white/10 hover:border-white/30"
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
