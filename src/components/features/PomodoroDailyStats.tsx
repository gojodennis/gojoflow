import { useEffect } from 'react';
import { usePomodoroStore } from '@/store/pomodoro-store';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Clock, Target } from 'lucide-react';

export function PomodoroDailyStats() {
    const { todayFocusTime, totalSessionsToday, currentStreak, loadStats, isLoading } = usePomodoroStore();

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center text-muted-foreground">
                        Loading stats...
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                    <Clock className="h-5 w-5 text-primary mb-1" />
                    <div className="text-2xl font-bold">{todayFocusTime}m</div>
                    <div className="text-xs text-muted-foreground">Focus Today</div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                    <Target className="h-5 w-5 text-primary mb-1" />
                    <div className="text-2xl font-bold">{totalSessionsToday}</div>
                    <div className="text-xs text-muted-foreground">Sessions</div>
                </CardContent>
            </Card>
            <Card className="col-span-2">
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/10 rounded-full">
                            <Flame className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                            <div className="font-medium">Current Streak</div>
                            <div className="text-xs text-muted-foreground">Keep it up!</div>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-orange-500">
                        {currentStreak} <span className="text-sm font-normal text-muted-foreground">days</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
