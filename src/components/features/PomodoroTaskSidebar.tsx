import { useTaskContext } from '@/components/providers/TaskContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';


interface PomodoroTaskSidebarProps {
    className?: string;
}

export function PomodoroTaskSidebar({ className }: PomodoroTaskSidebarProps) {
    const { tasks, deleteTask } = useTaskContext();
    const activeTasks = tasks.filter(t => !t.completed);

    const energyColors = {
        low: 'bg-green-500/10 text-green-500 border-green-500/20',
        medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        high: 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    return (
        <Card className={cn("h-full flex flex-col border-border/50 bg-card/50", className)}>
            <CardHeader className="shrink-0 p-4 pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold">Tasks</CardTitle>
                        <CardDescription className="text-xs">
                            {activeTasks.length} pending
                        </CardDescription>
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0 min-h-0 relative">
                <div className="absolute inset-0 overflow-y-auto p-4 pt-0 space-y-3">
                    {activeTasks.length === 0 && (
                        <div className="text-center py-8 text-sm text-muted-foreground">
                            No pending tasks.
                        </div>
                    )}
                    {activeTasks.map(task => (
                        <div key={task.id} className="group flex items-start justify-between gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                            <div className="space-y-1 min-w-0">
                                <p className="text-sm font-medium leading-none truncate">{task.title}</p>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className={cn("text-[10px] px-1 py-0 h-4 font-normal", energyColors[task.energy_level])}>
                                        {task.energy_level}
                                    </Badge>
                                    <span className="flex items-center text-[10px] text-muted-foreground">
                                        <Clock className="mr-1 h-3 w-3" />
                                        {task.duration}m
                                    </span>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteTask(task.id)}
                                className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
