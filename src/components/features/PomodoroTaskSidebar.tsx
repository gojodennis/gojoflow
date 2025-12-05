import { useState } from 'react';
import { usePomodoroStore } from '@/store/pomodoro-store';
import { useTaskContext } from '@/components/providers/TaskContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function PomodoroTaskSidebar() {
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
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Active Task</CardTitle>
                <CardDescription>
                    Select a task to focus on
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Task Selector */}
                <Select
                    value={activeTaskId || 'none'}
                    onValueChange={handleTaskChange}
                >
                    <SelectTrigger>
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

                {/* Active Task Card */}
                {activeTask && (
                    <div className="space-y-3 p-4 border rounded-lg bg-card">
                        <div className="space-y-2">
                            <h4 className="font-medium break-words leading-tight">{activeTask.title}</h4>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className={energyColors[activeTask.energy_level]}>
                                    {activeTask.energy_level} energy
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {activeTask.duration}m
                                </Badge>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCompleteTask}
                            className="w-full"
                        >
                            <Check className="h-4 w-4 mr-2" />
                            Mark Complete
                        </Button>
                    </div>
                )}

                {!activeTask && (
                    <div className="text-sm text-muted-foreground text-center py-4">
                        No task selected
                    </div>
                )}

                {/* Task Switch Prompt */}
                {showTaskSwitchPrompt && (
                    <Alert>
                        <AlertDescription className="space-y-3">
                            <p className="text-sm">
                                You're currently in a focus session. Do you want to log the time spent so far to the current task?
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => confirmTaskSwitch(true)}
                                    className="flex-1"
                                >
                                    Yes, Log & Switch
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => confirmTaskSwitch(false)}
                                    className="flex-1"
                                >
                                    Just Switch
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setShowTaskSwitchPrompt(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
