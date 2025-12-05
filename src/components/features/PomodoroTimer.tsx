import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
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

    // Define handleSessionComplete before useEffect
    const handleSessionComplete = React.useCallback(async () => {
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
    }, [sessionNotes, showNotification, completeSession]);

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
    const radius = 120;
    const strokeWidth = 8;
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

    return (
        <div className="flex flex-col items-center justify-center space-y-8 p-8">
            {/* Mode Indicator */}
            <motion.div
                className={cn(
                    'px-6 py-2 rounded-full text-sm font-medium border',
                    modeColors[mode]
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
                    <span className="text-6xl md:text-7xl font-mono font-bold tracking-tight">
                        {formatTime(timeRemaining)}
                    </span>
                </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={resetTimer}
                    disabled={status === 'idle' && timeRemaining === totalDuration}
                    className="h-12 w-12"
                >
                    <RotateCcw className="h-5 w-5" />
                </Button>

                <Button
                    size="lg"
                    onClick={status === 'running' ? pauseTimer : startTimer}
                    className="h-16 w-16 rounded-full"
                >
                    {status === 'running' ? (
                        <Pause className="h-6 w-6" />
                    ) : (
                        <Play className="h-6 w-6 ml-0.5" />
                    )}
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={skipSession}
                    className="h-12 w-12"
                >
                    <SkipForward className="h-5 w-5" />
                </Button>
            </div>

            {/* Session Info */}
            <div className="text-sm text-muted-foreground text-center">
                {status === 'idle' && 'Press play to start'}
                {status === 'running' && 'Focus on your task'}
                {status === 'paused' && 'Timer paused'}
            </div>
        </div>
    );
}
