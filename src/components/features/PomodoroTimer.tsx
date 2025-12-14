import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, Minimize2, Maximize2 } from 'lucide-react';
import { usePomodoroStore } from '@/store/pomodoro-store';
import { useTaskContext } from '@/components/providers/TaskContext';
import { soundManager } from '@/lib/pomodoro-sounds';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function PomodoroTimer() {
    const {
        mode,
        status,
        timeRemaining,
        settings,
        startTimer,
        pauseTimer,
        resetTimer,
        skipSession,
        completeSession,
        activeTaskId,
    } = usePomodoroStore();

    const { showNotification } = useNotifications();
    const { toggleTask, tasks } = useTaskContext();
    const [sessionNotes, setSessionNotes] = useState('');
    const [isPiP, setIsPiP] = useState(false); // For In-App PiP
    const [pipWindow, setPipWindow] = useState<Window | null>(null); // For Document PiP

    const handleStartTimer = () => {
        if (mode === 'focus' && !activeTaskId) {
            showNotification('No Task Selected', {
                body: 'Please select a task to focus on before starting the timer.',
                tag: 'no-task-selected',
            });
            return;
        }
        startTimer();
    };

    // Define handleSessionComplete before useEffect
    const handleSessionComplete = async () => {
        const currentMode = usePomodoroStore.getState().mode;
        const currentSettings = usePomodoroStore.getState().settings;
        const currentActiveTaskId = usePomodoroStore.getState().activeTaskId;

        // Play sound
        if (currentSettings.soundEnabled && currentSettings.soundPreset !== 'none') {
            soundManager.setVolume(currentSettings.volume);
            soundManager.playSessionEnd(currentSettings.soundPreset);
        }

        // Auto-complete task if in focus mode
        if (currentMode === 'focus' && currentActiveTaskId) {
            const task = tasks.find(t => t.id === currentActiveTaskId);
            if (task && !task.completed) {
                await toggleTask(currentActiveTaskId);
            }
        }

        // Show notification
        if (currentSettings.notificationsEnabled) {
            const modeText = currentMode === 'focus' ? 'Focus Session' : currentMode === 'short-break' ? 'Short Break' : 'Long Break';
            const bodyText = currentMode === 'focus'
                ? 'Great job! Task marked as completed.'
                : `Your ${modeText.toLowerCase()} has ended.`;

            showNotification(`${modeText} Complete!`, {
                body: bodyText,
                tag: 'pomodoro-complete',
            });
        }

        // Save session
        await completeSession(sessionNotes);
        setSessionNotes('');
    };

    // Timer countdown logic
    useEffect(() => {
        if (status !== 'running') return;

        const interval = setInterval(() => {
            const newTime = usePomodoroStore.getState().timeRemaining - 1;

            if (newTime <= 0) {
                // Session complete
                clearInterval(interval);
                handleSessionComplete();
            } else {
                usePomodoroStore.setState({ timeRemaining: newTime });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [status, handleSessionComplete]);

    // Cleanup PiP window on unmount
    useEffect(() => {
        return () => {
            if (pipWindow) {
                pipWindow.close();
            }
        };
    }, [pipWindow]);

    const togglePiP = async () => {
        // If PiP is already active (either Document or In-App), close it
        if (pipWindow) {
            pipWindow.close();
            setPipWindow(null);
            return;
        }
        if (isPiP) {
            setIsPiP(false);
            return;
        }

        // Try Document Picture-in-Picture API
        if ('documentPictureInPicture' in window) {
            try {
                // @ts-ignore - Types might not be up to date for this experimental API
                const windowPIP = await window.documentPictureInPicture.requestWindow({
                    width: 300,
                    height: 350,
                });

                // Copy styles
                [...document.styleSheets].forEach((styleSheet) => {
                    try {
                        const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
                        const style = document.createElement('style');
                        style.textContent = cssRules;
                        windowPIP.document.head.appendChild(style);
                    } catch {
                        const link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.type = styleSheet.type;
                        link.media = styleSheet.media.toString();
                        link.href = styleSheet.href || '';
                        windowPIP.document.head.appendChild(link);
                    }
                });

                // Sync dark mode class
                if (document.documentElement.classList.contains('dark')) {
                    windowPIP.document.documentElement.classList.add('dark');
                }

                // Explicitly set background color to ensure variables resolve
                const computedStyle = window.getComputedStyle(document.body);
                windowPIP.document.body.style.backgroundColor = computedStyle.backgroundColor;
                windowPIP.document.body.style.color = computedStyle.color;

                // Handle closing
                windowPIP.addEventListener('pagehide', () => {
                    setPipWindow(null);
                });

                setPipWindow(windowPIP);
            } catch (err) {
                console.error("Failed to enter Document PiP:", err);
                setIsPiP(true); // Fallback
            }
        } else {
            // Fallback to In-App PiP
            setIsPiP(true);
        }
    };

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate progress percentage
    const totalDuration =
        mode === 'focus'
            ? settings.focusDuration * 60
            : mode === 'short-break'
                ? settings.shortBreakDuration * 60
                : settings.longBreakDuration * 60;

    const progress = ((totalDuration - timeRemaining) / totalDuration) * 100;

    // SVG circle calculations
    // Adjust radius based on PiP mode
    const isCompact = isPiP || !!pipWindow;
    const radius = isCompact ? 60 : 120;
    const strokeWidth = isCompact ? 6 : 12; // Thicker stroke
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    // Mode colors
    const modeColors = {
        focus: 'text-primary',
        'short-break': 'text-blue-500',
        'long-break': 'text-green-500',
    };

    const modeStrokeColors = {
        focus: 'stroke-primary',
        'short-break': 'stroke-blue-500',
        'long-break': 'stroke-green-500',
    };

    const modeLabels = {
        focus: 'Focus',
        'short-break': 'Short Break',
        'long-break': 'Long Break',
    };

    // Content to render (shared between main app and PiP)
    const TimerContent = (
        <motion.div
            layout={!pipWindow} // Disable layout animation for portal as it causes issues
            className={cn(
                "flex items-center justify-center transition-all duration-300 ease-in-out relative",
                isCompact
                    ? "flex-col p-6 space-y-4 fixed bottom-8 right-8 z-50 bg-background/95 backdrop-blur-sm shadow-2xl border rounded-3xl w-auto h-auto scale-90 origin-bottom-right"
                    : pipWindow
                        ? "min-h-screen flex items-center justify-center bg-background p-4 flex-col"
                        : "w-full h-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 p-4 md:p-8"
            )}
        >
            {/* Toggle Button - Only show if NOT in Document PiP window (or show a close button there) */}
            {!pipWindow && (
                <div className={cn("absolute top-4 right-4 z-10", !isPiP && "w-full flex justify-end px-8 absolute top-0")}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={togglePiP}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title={isPiP ? "Expand" : "Picture in Picture"}
                    >
                        {isPiP ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                </div>
            )}

            {/* Control Buttons - Left on Desktop, Bottom on Mobile/Compact */}
            <div className={cn(
                "flex items-center gap-4 z-10",
                isCompact ? "order-2 flex-row gap-2" : "order-2 md:order-1 flex-row md:flex-col"
            )}>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={resetTimer}
                    disabled={status === 'idle' && timeRemaining === totalDuration}
                    className={cn(isCompact ? "h-8 w-8" : "h-12 w-12")}
                    title="Reset Timer"
                >
                    <RotateCcw className={cn(isCompact ? "h-3 w-3" : "h-5 w-5")} />
                </Button>

                <Button
                    size="lg"
                    onClick={status === 'running' ? pauseTimer : handleStartTimer}
                    className={cn("rounded-full", isCompact ? "h-10 w-10" : "h-16 w-16")}
                    title={status === 'running' ? "Pause" : "Start"}
                >
                    {status === 'running' ? (
                        <Pause className={cn(isCompact ? "h-4 w-4" : "h-6 w-6")} />
                    ) : (
                        <Play className={cn("ml-0.5", isCompact ? "h-4 w-4" : "h-6 w-6")} />
                    )}
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={skipSession}
                    className={cn(isCompact ? "h-8 w-8" : "h-12 w-12")}
                    title="Skip Session"
                >
                    <SkipForward className={cn(isCompact ? "h-3 w-3" : "h-5 w-5")} />
                </Button>
            </div>

            {/* Timer Display Group - Right on Desktop, Top on Mobile/Compact */}
            <div className={cn(
                "flex flex-col items-center justify-center relative",
                isCompact ? "order-1" : "order-1 md:order-2 flex-1 max-h-full"
            )}>
                {/* Mode Indicator - Minimalist Text */}
                <motion.div
                    layout={!pipWindow}
                    className={cn(
                        'text-sm uppercase tracking-[0.2em] font-medium text-muted-foreground/80 mb-4',
                        modeColors[mode],
                        isCompact && "text-[10px] mb-2"
                    )}
                    transition={{ duration: 0.3 }}
                >
                    {modeLabels[mode]}
                </motion.div>

                {/* Circular Timer */}
                <div className={cn("relative flex items-center justify-center mx-auto", !isCompact && "h-full w-auto aspect-square max-w-full")}>
                    <svg
                        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
                        className="w-full h-full transform -rotate-90 overflow-visible"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        {/* Background circle */}
                        <circle
                            stroke="currentColor"
                            className="text-muted"
                            fill="transparent"
                            strokeWidth={strokeWidth}
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                        />
                        {/* Progress circle */}
                        <motion.circle
                            stroke="currentColor"
                            className={modeStrokeColors[mode]}
                            fill="transparent"
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference + ' ' + circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{
                                duration: progress === 0 ? 0 : 0.5,
                                ease: 'easeInOut'
                            }}
                        />
                    </svg>

                    {/* Time Display */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={cn(
                            "font-mono font-bold tracking-tighter transition-all tabular-nums",
                            isCompact ? "text-4xl" : "text-7xl md:text-8xl"
                        )}>
                            {formatTime(timeRemaining)}
                        </span>
                    </div>
                </div>

                {/* Session Info */}
                {!isCompact && (
                    <div className="text-sm text-muted-foreground text-center mt-4 absolute -bottom-8">
                        {status === 'idle' && 'Press play to start'}
                        {status === 'running' && 'Focus on your task'}
                        {status === 'paused' && 'Timer paused'}
                    </div>
                )}
            </div>
        </motion.div>
    );

    if (pipWindow) {
        return createPortal(TimerContent, pipWindow.document.body);
    }

    return TimerContent;
}
