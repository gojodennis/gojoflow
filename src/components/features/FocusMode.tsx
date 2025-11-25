"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, X, Zap, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface FocusModeProps {
    onExit: () => void
}

const QUOTES = [
    "The only way to do great work is to love what you do.",
    "Focus is the key to productivity.",
    "One thing at a time.",
    "Deep work is valuable.",
    "Distraction is the enemy of progress.",
]

export function FocusMode({ onExit }: FocusModeProps) {
    const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes
    const [isActive, setIsActive] = useState(false)
    const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)])

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

    const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

    return (
        <div className="fixed inset-0 bg-neutral-950 flex items-center justify-center overflow-hidden z-50">
            {/* Distractions (Blurred Background) */}
            <div className="absolute inset-0 grid grid-cols-3 gap-4 p-4 opacity-20 blur-sm">
                {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="bg-neutral-800 rounded-lg h-full w-full" />
                ))}
            </div>

            {/* Focused Item */}
            <div className="relative z-10 bg-black border border-neutral-800 p-12 rounded-2xl shadow-2xl shadow-purple-900/20 max-w-md text-center">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4"
                    onClick={onExit}
                >
                    <X className="h-5 w-5" />
                </Button>

                <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Zap className="text-white fill-white" size={32} />
                </div>

                <h4 className="text-white font-bold text-3xl mb-4">Deep Work</h4>

                <div className="text-7xl font-bold font-mono tracking-tighter mb-8 tabular-nums text-white">
                    {formatTime(timeLeft)}
                </div>

                <div className="h-2 w-full bg-neutral-800 mx-auto rounded-full overflow-hidden mb-8">
                    <div
                        className="h-full bg-purple-500 transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex items-center justify-center gap-6 mb-6">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-full border-2 border-neutral-700"
                        onClick={resetTimer}
                    >
                        <RotateCcw className="h-5 w-5" />
                    </Button>

                    <Button
                        variant="default"
                        size="icon"
                        className={cn(
                            "h-16 w-16 rounded-full transition-all",
                            isActive ? "bg-yellow-500 hover:bg-yellow-600" : "bg-purple-500 hover:bg-purple-600"
                        )}
                        onClick={toggleTimer}
                    >
                        {isActive ? (
                            <Pause className="h-8 w-8 fill-current" />
                        ) : (
                            <Play className="h-8 w-8 fill-current ml-1" />
                        )}
                    </Button>

                    <div className="h-12 w-12" />
                </div>

                <blockquote className="text-sm italic text-neutral-400 max-w-sm mx-auto">
                    "{quote}"
                </blockquote>
            </div>

            {/* Done/Stop Button on Right Side */}
            <Button
                onClick={onExit}
                size="lg"
                className="fixed right-8 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-full shadow-2xl flex items-center gap-3"
            >
                <Check className="h-6 w-6" />
                <span className="font-semibold text-lg">Done</span>
            </Button>
        </div>
    )
}
