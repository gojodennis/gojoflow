import { useState, useEffect } from 'react';
import { PomodoroTimer } from '@/components/features/PomodoroTimer';
import { PomodoroControls } from '@/components/features/PomodoroControls';
import { PomodoroTaskSidebar } from '@/components/features/PomodoroTaskSidebar';
import { PomodoroStats } from '@/components/features/PomodoroStats';
import { PomodoroNotes } from '@/components/features/PomodoroNotes';
import { usePomodoroStore } from '@/store/pomodoro-store';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

import { useSearchParams } from 'react-router-dom';

export default function PomodoroPage() {
    const { settings, setActiveTask } = usePomodoroStore();
    const { permission, requestPermission, isSupported } = useNotifications();
    const [sessionNotes, setSessionNotes] = useState('');
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const taskId = searchParams.get('taskId');
        if (taskId) {
            setActiveTask(taskId);
        }
    }, [searchParams, setActiveTask]);

    useEffect(() => {
        if (isSupported && permission === 'default' && settings.notificationsEnabled) {
            requestPermission();
        }
    }, [isSupported, permission, requestPermission, settings.notificationsEnabled]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger shortcuts if user is typing in an input or textarea
            if (
                document.activeElement instanceof HTMLInputElement ||
                document.activeElement instanceof HTMLTextAreaElement
            ) {
                return;
            }

            switch (e.code) {
                case 'Space':
                    e.preventDefault(); // Prevent scrolling
                    if (usePomodoroStore.getState().status === 'running') {
                        usePomodoroStore.getState().pauseTimer();
                    } else {
                        usePomodoroStore.getState().startTimer();
                    }
                    break;
                case 'KeyR':
                    usePomodoroStore.getState().resetTimer();
                    break;
                case 'KeyS':
                    usePomodoroStore.getState().skipSession();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Notification Permission Banner */}
            {settings.notificationsEnabled && permission !== 'granted' && isSupported && (
                <div className="mb-6 p-4 border rounded-lg bg-muted/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Enable Notifications</p>
                            <p className="text-xs text-muted-foreground">
                                Get notified when your Pomodoro sessions end
                            </p>
                        </div>
                    </div>
                    <Button size="sm" onClick={requestPermission}>
                        Enable
                    </Button>
                </div>
            )}

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
                {/* Main Timer Area */}
                <div className="space-y-6">
                    {/* Timer */}
                    <div className="border rounded-lg overflow-hidden">
                        <PomodoroTimer />
                        <PomodoroControls />
                    </div>

                    {/* Notes */}
                    <PomodoroNotes value={sessionNotes} onChange={setSessionNotes} />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <PomodoroTaskSidebar />
                    <PomodoroStats />
                </div>
            </div>
        </div>
    );
}
