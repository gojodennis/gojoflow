import { useState, useEffect } from 'react';
import { PomodoroTimer } from '@/components/features/PomodoroTimer';
import { PomodoroControls } from '@/components/features/PomodoroControls';
import { PomodoroTaskSidebar } from '@/components/features/PomodoroTaskSidebar';
import { PomodoroDailyStats } from '@/components/features/PomodoroDailyStats';
import { PomodoroWeeklyChart } from '@/components/features/PomodoroWeeklyChart';
import { GenericCarousel } from '@/components/features/GenericCarousel';
import { PomodoroNotes } from '@/components/features/PomodoroNotes';
import { ActiveTaskDisplay } from '@/components/features/ActiveTaskDisplay';
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
            if (
                document.activeElement instanceof HTMLInputElement ||
                document.activeElement instanceof HTMLTextAreaElement
            ) {
                return;
            }

            switch (e.code) {
                case 'Space':
                    e.preventDefault();
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
        <div className="h-[calc(100vh-80px)] w-full overflow-hidden p-4">
            {/* Mobile View (< 1024px) */}
            <div className="lg:hidden h-full flex flex-col gap-4 overflow-y-auto no-scrollbar pb-20">
                {/* Notification Banner */}
                {settings.notificationsEnabled && permission !== 'granted' && isSupported && (
                    <div className="p-3 border rounded-lg bg-muted/50 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <Bell className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Enable Notifications</span>
                        </div>
                        <Button size="sm" variant="outline" onClick={requestPermission} className="h-7 text-xs">
                            Enable
                        </Button>
                    </div>
                )}

                {/* Top: Active Task */}
                <ActiveTaskDisplay />

                {/* Top: Timer */}
                <div className="shrink-0 flex justify-center py-4">
                    <PomodoroTimer />
                </div>

                {/* Middle: Streak (Daily Stats) */}
                <div className="shrink-0">
                    <PomodoroDailyStats />
                </div>

                {/* Middle: Task + Overview Carousel */}
                <div className="h-[400px] shrink-0">
                    <GenericCarousel
                        items={[
                            { title: "Tasks", content: <PomodoroTaskSidebar /> },
                            { title: "Weekly", content: <PomodoroWeeklyChart /> }
                        ]}
                    />
                </div>

                {/* Bottom: Session Notes */}
                <div className="shrink-0 flex flex-col gap-2">
                    <h3 className="text-sm font-medium text-muted-foreground ml-1">Session Notes</h3>
                    <div className="h-[200px]">
                        <PomodoroNotes value={sessionNotes} onChange={setSessionNotes} />
                    </div>
                </div>
            </div>

            {/* Desktop View (>= 1024px) */}
            <div className="hidden lg:grid h-full max-w-[1600px] mx-auto grid-cols-12 gap-4">
                {/* Left Column: Timer & Controls (Flex-grow) + Notes (Fixed height) */}
                <div className="col-span-8 h-full flex flex-col gap-4 overflow-hidden">

                    {/* Notification Banner */}
                    {settings.notificationsEnabled && permission !== 'granted' && isSupported && (
                        <div className="p-3 border rounded-lg bg-muted/50 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <Bell className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Enable Notifications for session alerts</span>
                            </div>
                            <Button size="sm" variant="outline" onClick={requestPermission} className="h-7 text-xs">
                                Enable
                            </Button>
                        </div>
                    )}

                    {/* Active Task Section */}
                    <div className="shrink-0">
                        <ActiveTaskDisplay />
                    </div>

                    {/* Main Content Carousel (Timer / Notes) */}
                    <div className="flex-1 min-h-0">
                        <GenericCarousel
                            items={[
                                {
                                    title: "Focus Timer",
                                    content: (
                                        <div className="h-full flex items-center justify-center gap-8 md:gap-16 p-6">
                                            <div className="shrink-0">
                                                <PomodoroControls orientation="vertical" />
                                            </div>
                                            <PomodoroTimer />
                                        </div>
                                    )
                                },
                                {
                                    title: "Session Notes",
                                    content: <PomodoroNotes value={sessionNotes} onChange={setSessionNotes} />
                                }
                            ]}
                        />
                    </div>
                </div>

                {/* Right Column: Sidebar (Tasks & Stats) */}
                <div className="col-span-4 h-full flex flex-col gap-4 overflow-hidden">
                    <PomodoroDailyStats />

                    <div className="flex-1 min-h-0">
                        <GenericCarousel
                            items={[
                                { title: "Tasks", content: <PomodoroTaskSidebar /> },
                                { title: "Weekly", content: <PomodoroWeeklyChart /> }
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
