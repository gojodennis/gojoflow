import { useEffect } from 'react';
import { usePomodoroStore } from '@/store/pomodoro-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Clock, Target } from 'lucide-react';

export function PomodoroStats() {
    const { todayFocusTime, totalSessionsToday, currentStreak, weeklyStats, loadStats, isLoading } = usePomodoroStore();

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

    const maxMinutes = Math.max(...(weeklyStats?.map(d => d.minutes) || []), 60);

    return (
        <div className="space-y-4">
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

            {/* Weekly Overview Chart */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Weekly Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end justify-between gap-2 h-32 pt-4">
                        {weeklyStats?.map((day, i) => {
                            const heightPercentage = Math.round((day.minutes / maxMinutes) * 100);
                            const dateLabel = new Date(day.date).toLocaleDateString('en-US', { weekday: 'narrow' });
                            return (
                                <div key={i} className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
                                    <div className="w-full bg-muted/30 rounded-t-sm relative group flex items-end h-full">
                                        <div
                                            className="w-full bg-primary/80 hover:bg-primary transition-all rounded-t-sm"
                                            style={{ height: `${heightPercentage}%` }}
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md whitespace-nowrap z-10">
                                                {day.minutes}m
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground uppercase">{dateLabel}</span>
                                </div>
                            );
                        })}
                        {(!weeklyStats || weeklyStats.length === 0) && (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                                No data for this week
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
