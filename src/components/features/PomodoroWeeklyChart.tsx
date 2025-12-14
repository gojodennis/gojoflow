import { usePomodoroStore } from '@/store/pomodoro-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PomodoroWeeklyChart() {
    const { weeklyStats } = usePomodoroStore();
    const maxMinutes = Math.max(...(weeklyStats?.map(d => d.minutes) || []), 60);

    return (
        <Card className="h-full border-border/50 bg-card/50">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Weekly Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between gap-2 h-40 pt-4">
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
    );
}
