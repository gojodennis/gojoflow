import { usePomodoroStore } from '@/store/pomodoro-store';
import { soundManager } from '@/lib/pomodoro-sounds';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Volume2 } from 'lucide-react';

interface PomodoroSettingsProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PomodoroSettings({ open, onOpenChange }: PomodoroSettingsProps) {
    const { settings, updateSettings } = usePomodoroStore();

    const handleTestSound = () => {
        soundManager.setVolume(settings.volume);
        soundManager.testSound(settings.soundPreset);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Pomodoro Settings</DialogTitle>
                    <DialogDescription>
                        Customize your Pomodoro timer preferences
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Duration Settings */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Durations (minutes)</h3>

                        <div className="grid gap-2">
                            <Label htmlFor="focus-duration">Focus Duration</Label>
                            <Input
                                id="focus-duration"
                                type="number"
                                min="1"
                                max="60"
                                value={settings.focusDuration}
                                onChange={(e) => updateSettings({ focusDuration: parseInt(e.target.value) || 25 })}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="short-break-duration">Short Break Duration</Label>
                            <Input
                                id="short-break-duration"
                                type="number"
                                min="1"
                                max="30"
                                value={settings.shortBreakDuration}
                                onChange={(e) => updateSettings({ shortBreakDuration: parseInt(e.target.value) || 5 })}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="long-break-duration">Long Break Duration</Label>
                            <Input
                                id="long-break-duration"
                                type="number"
                                min="1"
                                max="60"
                                value={settings.longBreakDuration}
                                onChange={(e) => updateSettings({ longBreakDuration: parseInt(e.target.value) || 15 })}
                            />
                        </div>
                    </div>

                    {/* Session Cycle */}
                    <div className="space-y-2">
                        <Label htmlFor="sessions-per-cycle">Sessions Before Long Break</Label>
                        <Input
                            id="sessions-per-cycle"
                            type="number"
                            min="1"
                            max="10"
                            value={settings.sessionsPerCycle}
                            onChange={(e) => updateSettings({ sessionsPerCycle: parseInt(e.target.value) || 4 })}
                        />
                    </div>

                    {/* Auto-Start Options */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Auto-Start</h3>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="auto-start-breaks" className="cursor-pointer">
                                Auto-start breaks
                            </Label>
                            <Switch
                                id="auto-start-breaks"
                                checked={settings.autoStartBreaks}
                                onCheckedChange={(checked) => updateSettings({ autoStartBreaks: checked })}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="auto-start-pomodoros" className="cursor-pointer">
                                Auto-start next focus
                            </Label>
                            <Switch
                                id="auto-start-pomodoros"
                                checked={settings.autoStartPomodoros}
                                onCheckedChange={(checked) => updateSettings({ autoStartPomodoros: checked })}
                            />
                        </div>
                    </div>

                    {/* Sound Settings */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Sound</h3>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="sound-enabled" className="cursor-pointer">
                                Enable sounds
                            </Label>
                            <Switch
                                id="sound-enabled"
                                checked={settings.soundEnabled}
                                onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
                            />
                        </div>

                        {settings.soundEnabled && (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="sound-preset">Sound Preset</Label>
                                    <div className="flex gap-2">
                                        <Select
                                            value={settings.soundPreset}
                                            onValueChange={(value: 'default' | 'gentle' | 'bell' | 'none') => updateSettings({ soundPreset: value })}
                                        >
                                            <SelectTrigger id="sound-preset">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="default">Default</SelectItem>
                                                <SelectItem value="gentle">Gentle</SelectItem>
                                                <SelectItem value="bell">Bell</SelectItem>
                                                <SelectItem value="none">None</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleTestSound}
                                            disabled={settings.soundPreset === 'none'}
                                        >
                                            <Volume2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="volume">Volume</Label>
                                        <span className="text-sm text-muted-foreground">{settings.volume}%</span>
                                    </div>
                                    <Slider
                                        id="volume"
                                        min={0}
                                        max={100}
                                        step={5}
                                        value={[settings.volume]}
                                        onValueChange={(values: number[]) => updateSettings({ volume: values[0] })}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Notifications */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="notifications-enabled" className="cursor-pointer">
                            Browser notifications
                        </Label>
                        <Switch
                            id="notifications-enabled"
                            checked={settings.notificationsEnabled}
                            onCheckedChange={(checked) => updateSettings({ notificationsEnabled: checked })}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
