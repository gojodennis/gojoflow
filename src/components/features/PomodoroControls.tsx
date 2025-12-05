import { usePomodoroStore, type PomodoroMode } from '@/store/pomodoro-store';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { PomodoroSettings } from './PomodoroSettings';

export function PomodoroControls() {
    const { mode, completedSessions, settings, setMode } = usePomodoroStore();
    const [showSettings, setShowSettings] = useState(false);

    const modes: { key: PomodoroMode; label: string }[] = [
        { key: 'focus', label: 'Focus' },
        { key: 'short-break', label: 'Short Break' },
        { key: 'long-break', label: 'Long Break' },
    ];

    return (
        <>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
                {/* Mode Selector */}
                <div className="flex items-center gap-2">
                    {modes.map((m) => (
                        <Button
                            key={m.key}
                            variant={mode === m.key ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setMode(m.key)}
                            className="font-medium"
                        >
                            {m.label}
                        </Button>
                    ))}
                </div>

                {/* Session Counter & Settings */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Session:</span>
                        <span className="text-sm font-medium">
                            {completedSessions + 1}/{settings.sessionsPerCycle}
                        </span>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowSettings(true)}
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
