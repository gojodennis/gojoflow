import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, Minimize2, Maximize2 } from 'lucide-react';
import { usePomodoroStore } from '@/store/pomodoro-store';
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
    } = usePomodoroStore();

    const { showNotification } = useNotifications();
    const [sessionNotes, setSessionNotes] = useState('');
    const [isPiP, setIsPiP] = useState(false); // For In-App PiP
    const [pipWindow, setPipWindow] = useState<Window | null>(null); // For Document PiP

    // Define handleSessionComplete before useEffect
    const handleSessionComplete = async () => {
        const currentMode = usePomodoroStore.getState().mode;
        const currentSettings = usePomodoroStore.getState().settings;

        // Play sound
        if (currentSettings.soundEnabled && currentSettings.soundPreset !== 'none') {
            soundManager.setVolume(currentSettings.volume);
            soundManager.playSessionEnd(currentSettings.soundPreset);
        }

        // Show notification
        if (currentSettings.notificationsEnabled) {
            const modeText = currentMode === 'focus' ? 'Focus' : currentMode === 'short-break' ? 'Short Break' : 'Long Break';
            showNotification(`${modeText} Complete!`, {
                body: `Your ${modeText.toLowerCase()} session has ended.`,
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
    const strokeWidth = isCompact ? 4 : 8;
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
                "flex flex-col items-center justify-center transition-all duration-300 ease-in-out relative",
                isPiP
                    ? "fixed bottom-8 right-8 z-50 bg-background/95 backdrop-blur-sm shadow-2xl border rounded-3xl p-6 w-auto h-auto scale-90 origin-bottom-right"
                    : pipWindow
                        ? "min-h-screen flex items-center justify-center bg-background p-4" // Styles for inside PiP window
                        : "space-y-8 p-8"
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


            {/* Mode Indicator */}
            <motion.div
                layout={!pipWindow}
                className={cn(
                    'px-6 py-2 rounded-full text-sm font-medium border',
                    modeColors[mode],
                    isCompact && "px-3 py-1 text-xs mb-2"
                )}
                animate={{
                    backgroundColor: mode === 'focus' ? 'rgba(var(--primary), 0.05)' :
                        mode === 'short-break' ? 'rgba(59, 130, 246, 0.05)' :
                            'rgba(34, 197, 94, 0.05)',
                    borderColor: mode === 'focus' ? 'rgba(var(--primary), 0.2)' :
                        mode === 'short-break' ? 'rgba(59, 130, 246, 0.2)' :
                            'rgba(34, 197, 94, 0.2)'
                }}
                transition={{ duration: 0.3 }}
            >
                {modeLabels[mode]}
            </motion.div>

            {/* Circular Timer */}
            <div className="relative">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="transform -rotate-90"
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
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                </svg>

                {/* Time Display */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn(
                        "font-mono font-bold tracking-tight transition-all",
                        isCompact ? "text-3xl" : "text-6xl md:text-7xl"
                    )}>
                        {formatTime(timeRemaining)}
                    </span>
                </div>
            </div>

            {/* Control Buttons */}
            <div className={cn("flex items-center gap-4", isCompact && "gap-2")}>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={resetTimer}
                    disabled={status === 'idle' && timeRemaining === totalDuration}
                    className={cn(isCompact ? "h-8 w-8" : "h-12 w-12")}
                >
                    <RotateCcw className={cn(isCompact ? "h-3 w-3" : "h-5 w-5")} />
                </Button>

                <Button
                    size="lg"
                    onClick={status === 'running' ? pauseTimer : startTimer}
                    className={cn("rounded-full", isCompact ? "h-10 w-10" : "h-16 w-16")}
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
                >
                    <SkipForward className={cn(isCompact ? "h-3 w-3" : "h-5 w-5")} />
                </Button>
            </div>

            {/* Session Info */}
            {!isCompact && (
                <div className="text-sm text-muted-foreground text-center">
                    {status === 'idle' && 'Press play to start'}
                    {status === 'running' && 'Focus on your task'}
                    {status === 'paused' && 'Timer paused'}
                </div>
            )}
        </motion.div>
    );

    if (pipWindow) {
        return createPortal(TimerContent, pipWindow.document.body);
    }

    return TimerContent;
}
