import { usePomodoroStore, type PomodoroMode } from '@/store/pomodoro-store';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { PomodoroSettings } from './PomodoroSettings';
import { cn } from '@/lib/utils';

interface PomodoroControlsProps {
    orientation?: 'horizontal' | 'vertical';
    className?: string;
}

export function PomodoroControls({ orientation = 'horizontal', className }: PomodoroControlsProps) {
    const { mode, completedSessions, settings, setMode } = usePomodoroStore();
    const [showSettings, setShowSettings] = useState(false);

    const modes: { key: PomodoroMode; label: string }[] = [
        { key: 'focus', label: 'Focus' },
        { key: 'short-break', label: 'Short Break' },
        { key: 'long-break', label: 'Long Break' },
    ];

    return (
        <>
            <div className={cn(
                "flex items-center justify-between gap-4 transition-all",
                orientation === 'horizontal' ? "flex-col sm:flex-row w-full p-4 border-t" : "flex-col gap-6",
                className
            )}>
                {/* Mode Selector */}
                <div className={cn("flex items-center gap-2", orientation === 'vertical' && "flex-col w-full")}>
                    {modes.map((m) => (
                        <Button
                            key={m.key}
                            variant={mode === m.key ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setMode(m.key)}
                            className={cn("font-medium transition-all", orientation === 'vertical' && "w-full")}
                        >
                            {m.label}
                        </Button>
                    ))}
                </div>

                {/* Session Counter & Settings */}
                <div className={cn("flex items-center gap-4", orientation === 'vertical' && "flex-col-reverse w-full gap-6")}>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Session:</span>
                        <span className="text-sm font-medium">
                            {completedSessions + 1}/{settings.sessionsPerCycle}
                        </span>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon" // Kept as icon for consistency, but maybe could be a full button in vertical? Sticking to icon for now.
                        onClick={() => setShowSettings(true)}
                        className={cn(orientation === 'vertical' && "h-10 w-10")}
                    >
                        <Settings className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Settings Dialog */}
            <PomodoroSettings
                open={showSettings}
                onOpenChange={setShowSettings}
            />
        </>
    );
}
