import { useState } from 'react';
import { usePomodoroStore } from '@/store/pomodoro-store';
import { useTaskContext } from '@/components/providers/TaskContext';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface ActiveTaskDisplayProps {
    className?: string;
}

export function ActiveTaskDisplay({ className }: ActiveTaskDisplayProps) {
    const { activeTaskId, setActiveTask, status, timeRemaining, settings, logCustomSession } = usePomodoroStore();
    const { tasks, toggleTask } = useTaskContext();
    const [showTaskSwitchPrompt, setShowTaskSwitchPrompt] = useState(false);
    const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);

    const activeTask = tasks.find(t => t.id === activeTaskId);
    const activeTasks = tasks.filter(t => !t.completed);

    const handleTaskChange = (newTaskId: string) => {
        if (status === 'running' && activeTaskId && newTaskId !== activeTaskId) {
            // Show prompt if switching mid-session
            setPendingTaskId(newTaskId);
            setShowTaskSwitchPrompt(true);
        } else {
            setActiveTask(newTaskId);
        }
    };

    const confirmTaskSwitch = async (shouldLogTime: boolean) => {
        if (pendingTaskId) {
            if (shouldLogTime && activeTaskId) {
                // Calculate time spent
                const totalDuration = settings.focusDuration * 60;
                const timeSpentSeconds = totalDuration - timeRemaining;
                const timeSpentMinutes = timeSpentSeconds / 60;

                if (timeSpentMinutes > 0.5) { // Only log if > 30 seconds
                    await logCustomSession(activeTaskId, timeSpentMinutes, "Partial session (task switch)");
                }
            }

            setActiveTask(pendingTaskId);
            setPendingTaskId(null);
            setShowTaskSwitchPrompt(false);
        }
    };

    const handleCompleteTask = async () => {
        if (activeTask) {
            await toggleTask(activeTask.id);
            setActiveTask(null);
        }
    };

    const energyColors = {
        low: 'bg-green-500/10 text-green-500 border-green-500/20',
        medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        high: 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    return (
        <Card className={cn("border-border/50 bg-muted/30 shadow-sm", className)}>
            <CardContent className="p-4 space-y-3">
                {/* Header / Selector Row */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Active Task:</span>
                    <Select
                        value={activeTaskId || 'none'}
                        onValueChange={handleTaskChange}
                    >
                        <SelectTrigger className="h-8 bg-background">
                            <SelectValue placeholder="Select a task" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">No task selected</SelectItem>
                            {activeTasks.map((task) => (
                                <SelectItem key={task.id} value={task.id}>
                                    <span className="truncate block max-w-[240px]">{task.title}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Active Task Details (Inline) */}
                {activeTask && (
                    <div className="rounded-md border bg-background p-3 flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1 space-y-1">
                            <h4 className="font-medium truncate leading-tight">{activeTask.title}</h4>
                            <div className="flex items-center gap-2 text-xs">
                                <Badge variant="outline" className={cn("px-1.5 py-0", energyColors[activeTask.energy_level])}>
                                    {activeTask.energy_level}
                                </Badge>
                                <Badge variant="outline" className="px-1.5 py-0 flex items-center gap-1">
                                    <Clock className="h-2.5 w-2.5" />
                                    {activeTask.duration}m
                                </Badge>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCompleteTask}
                            className="h-8 w-8 p-0 shrink-0 text-muted-foreground hover:text-green-500"
                            title="Mark Complete"
                        >
                            <Check className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {/* Task Switch Prompt */}
                {showTaskSwitchPrompt && (
                    <Alert className="bg-background">
                        <AlertDescription className="space-y-2">
                            <p className="text-xs">
                                Log time for current task before switching?
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => confirmTaskSwitch(true)}
                                    className="flex-1 h-7 text-xs"
                                >
                                    Log & Switch
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => confirmTaskSwitch(false)}
                                    className="flex-1 h-7 text-xs"
                                >
                                    Just Switch
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
