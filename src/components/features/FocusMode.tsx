"use client"

import { useState, useEffect, useRef } from "react"
import { Check, RotateCcw, Play, Pause, Coffee, Brain, Timer } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type SessionType = 'work' | 'shortBreak' | 'longBreak'

interface FocusModeProps {
    onExit: () => void
    onComplete?: () => void
    duration?: number // Duration in minutes for work sessions
}

export function FocusMode({ onExit, onComplete, duration = 25 }: FocusModeProps) {
    // Configuration
    const workDuration = duration
    const shortBreakDuration = 5
    const longBreakDuration = 15
    const sessionsUntilLongBreak = 4

    // State
    const [sessionType, setSessionType] = useState<SessionType>('work')
    const [timeLeft, setTimeLeft] = useState(workDuration * 60)
    const [isActive, setIsActive] = useState(false)
    const [completedSessions, setCompletedSessions] = useState(0)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Initialize audio on mount
    useEffect(() => {
        // Create a simple notification sound using Web Audio API
        audioRef.current = new Audio()
        // Using a data URL for a simple beep sound
        audioRef.current.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGJ0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltryxHMnBSp+zPLaizsIGGS57OihUBELTKXh8bllHAY2jtHz0YExBiFsvu7mnEoPEFOq5O+zYBoGPJPY8shoKQYndsn03I4+CRJYr+fxolYUCkmd";
    }, [])

    // Get duration for current session type
    const getCurrentDuration = () => {
        switch (sessionType) {
            case 'work': return workDuration
            case 'shortBreak': return shortBreakDuration
            case 'longBreak': return longBreakDuration
        }
    }

    // Timer effect
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0 && isActive) {
            // Session completed
            handleSessionComplete()
        }

        return () => clearInterval(interval)
    }, [isActive, timeLeft])

    const handleSessionComplete = () => {
        setIsActive(false)

        // Play notification sound
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log('Audio play failed:', e))
        }

        // Show browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Pomodoro Timer', {
                body: sessionType === 'work'
                    ? 'Work session complete! Time for a break.'
                    : 'Break complete! Ready to focus?',
                icon: '⏰'
            })
        }

        // Transition to next session
        if (sessionType === 'work') {
            const newCompletedSessions = completedSessions + 1
            setCompletedSessions(newCompletedSessions)

            // Decide break type
            if (newCompletedSessions % sessionsUntilLongBreak === 0) {
                setSessionType('longBreak')
                setTimeLeft(longBreakDuration * 60)
            } else {
                setSessionType('shortBreak')
                setTimeLeft(shortBreakDuration * 60)
            }
        } else {
            // Break finished, back to work
            setSessionType('work')
            setTimeLeft(workDuration * 60)
        }
    }

    const toggleTimer = () => {
        // Request notification permission on first play
        if (!isActive && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission()
        }
        setIsActive(!isActive)
    }

    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(getCurrentDuration() * 60)
    }

    const resetAll = () => {
        setIsActive(false)
        setSessionType('work')
        setTimeLeft(workDuration * 60)
        setCompletedSessions(0)
    }

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        if (hours > 0) {
            return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
        }
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const progress = ((getCurrentDuration() * 60 - timeLeft) / (getCurrentDuration() * 60)) * 100

    // Session type styling
    const getSessionColor = () => {
        switch (sessionType) {
            case 'work': return 'bg-red-500/20 border-red-500/40 text-red-200'
            case 'shortBreak': return 'bg-green-500/20 border-green-500/40 text-green-200'
            case 'longBreak': return 'bg-blue-500/20 border-blue-500/40 text-blue-200'
        }
    }

    const getSessionIcon = () => {
        switch (sessionType) {
            case 'work': return <Brain className="w-5 h-5" />
            case 'shortBreak': return <Coffee className="w-5 h-5" />
            case 'longBreak': return <Timer className="w-5 h-5" />
        }
    }

    const getSessionLabel = () => {
        switch (sessionType) {
            case 'work': return 'Focus Time'
            case 'shortBreak': return 'Short Break'
            case 'longBreak': return 'Long Break'
        }
    }

    const getProgressColor = () => {
        switch (sessionType) {
            case 'work': return 'bg-red-400'
            case 'shortBreak': return 'bg-green-400'
            case 'longBreak': return 'bg-blue-400'
        }
    }

    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden z-50 p-4">
            {/* Main Timer Container */}
            <div className="flex flex-col items-center justify-center gap-6 md:gap-8 w-full max-w-2xl">
                {/* Session Type Badge */}
                <div className="flex items-center gap-3">
                    <Badge
                        variant="outline"
                        className={cn(
                            "px-4 py-2 text-sm font-semibold border-2 backdrop-blur-sm",
                            getSessionColor()
                        )}
                    >
                        <span className="mr-2">{getSessionIcon()}</span>
                        {getSessionLabel()}
                    </Badge>

                    {/* Session Counter */}
                    <Badge
                        variant="outline"
                        className="px-3 py-2 text-xs border-white/30 text-white/70 backdrop-blur-sm"
                    >
                        {completedSessions % sessionsUntilLongBreak}/{sessionsUntilLongBreak}
                    </Badge>
                </div>

                {/* Timer Display */}
                <div className="text-7xl md:text-9xl font-bold font-mono tracking-tighter tabular-nums text-white leading-none">
                    {formatTime(timeLeft)}
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-md md:max-w-2xl h-2 md:h-3 bg-white/10 border border-white/20 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full transition-all duration-1000",
                            getProgressColor()
                        )}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Session Info */}
                <div className="text-center text-white/60 text-sm">
                    <p>Sessions completed: {completedSessions}</p>
                    {sessionType === 'work' && (
                        <p className="text-xs mt-1">
                            {sessionsUntilLongBreak - (completedSessions % sessionsUntilLongBreak)} more until long break
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
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

                    {/* Reset Session */}
                    <Button
                        variant="ghost"
                        onClick={resetTimer}
                        className={cn(
                            "min-h-[44px] px-4 md:px-6 text-sm font-medium rounded-md transition-all",
                            "border border-white/20 text-white/90 hover:bg-white/10 hover:border-white/30"
                        )}
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
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
                                {timeLeft === getCurrentDuration() * 60 ? 'Start' : 'Resume'}
                            </>
                        )}
                    </Button>
                </div>

                {/* Reset All (smaller, secondary action) */}
                <Button
                    variant="ghost"
                    onClick={resetAll}
                    className="text-xs text-white/40 hover:text-white/60 transition-colors"
                >
                    Reset All Sessions
                </Button>
            </div>
        </div>
    )
}
