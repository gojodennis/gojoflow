import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePomodoroStore } from '@/store/pomodoro-store';
import { soundManager } from '@/lib/pomodoro-sounds';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Volume2, Clock, Settings2, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PomodoroSettingsProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type SettingsTab = 'timer' | 'sound' | 'system';

export function PomodoroSettings({ open, onOpenChange }: PomodoroSettingsProps) {
    const { settings, updateSettings } = usePomodoroStore();
    const [activeTab, setActiveTab] = useState<SettingsTab>('timer');

    const handleTestSound = () => {
        soundManager.setVolume(settings.volume);
        soundManager.testSound(settings.soundPreset);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md gap-0 p-0 overflow-hidden bg-background border-border">
                <DialogHeader className="p-6 pb-4 border-b border-border/40 space-y-4">
                    <DialogTitle className="text-xl font-mono tracking-tight">Settings</DialogTitle>

                    {/* Compact Tab Switcher */}
                    <div className="flex p-1 bg-muted/50 rounded-lg border border-border/50">
                        {(['timer', 'sound', 'system'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                                    activeTab === tab
                                        ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                )}
                            >
                                {tab === 'timer' && <Clock className="w-3.5 h-3.5" />}
                                {tab === 'sound' && <Volume2 className="w-3.5 h-3.5" />}
                                {tab === 'system' && <Settings2 className="w-3.5 h-3.5" />}
                                <span className="capitalize">{tab}</span>
                            </button>
                        ))}
                    </div>
                </DialogHeader>

                <div className="p-6 min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'timer' && (
                            <motion.div
                                key="timer"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="focus" className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Focus (min)</Label>
                                        <Input
                                            id="focus"
                                            type="number"
                                            min="1"
                                            max="60"
                                            value={settings.focusDuration}
                                            onChange={(e) => updateSettings({ focusDuration: parseInt(e.target.value) || 25 })}
                                            className="font-mono text-center h-12 text-lg bg-muted/30 focus:bg-background transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="short-break" className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Short Break</Label>
                                        <Input
                                            id="short-break"
                                            type="number"
                                            min="1"
                                            max="30"
                                            value={settings.shortBreakDuration}
                                            onChange={(e) => updateSettings({ shortBreakDuration: parseInt(e.target.value) || 5 })}
                                            className="font-mono text-center h-12 text-lg bg-muted/30 focus:bg-background transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="long-break" className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Long Break</Label>
                                        <Input
                                            id="long-break"
                                            type="number"
                                            min="1"
                                            max="60"
                                            value={settings.longBreakDuration}
                                            onChange={(e) => updateSettings({ longBreakDuration: parseInt(e.target.value) || 15 })}
                                            className="font-mono text-center h-12 text-lg bg-muted/30 focus:bg-background transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rounds" className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Rounds</Label>
                                        <Input
                                            id="rounds"
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={settings.sessionsPerCycle}
                                            onChange={(e) => updateSettings({ sessionsPerCycle: parseInt(e.target.value) || 4 })}
                                            className="font-mono text-center h-12 text-lg bg-muted/30 focus:bg-background transition-colors"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'sound' && (
                            <motion.div
                                key="sound"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30">
                                    <Label htmlFor="sound-enabled" className="cursor-pointer flex items-center gap-2">
                                        <Volume2 className="w-4 h-4" />
                                        <span>Enable Sounds</span>
                                    </Label>
                                    <Switch
                                        id="sound-enabled"
                                        checked={settings.soundEnabled}
                                        onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
                                    />
                                </div>

                                {settings.soundEnabled && (
                                    <div className="space-y-6 pt-2">
                                        <div className="space-y-3">
                                            <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Preset</Label>
                                            <div className="flex gap-2">
                                                <Select
                                                    value={settings.soundPreset}
                                                    onValueChange={(value: 'default' | 'gentle' | 'bell' | 'none') => updateSettings({ soundPreset: value })}
                                                >
                                                    <SelectTrigger id="sound-preset" className="flex-1 font-mono">
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
                                                    className="shrink-0"
                                                >
                                                    <Volume2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Volume</Label>
                                                <span className="text-xs font-mono text-muted-foreground">{settings.volume}%</span>
                                            </div>
                                            <Slider
                                                min={0}
                                                max={100}
                                                step={5}
                                                value={[settings.volume]}
                                                onValueChange={(values: number[]) => updateSettings({ volume: values[0] })}
                                                className="[&_.relative]:h-1.5 [&_.absolute]:bg-primary"
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'system' && (
                            <motion.div
                                key="system"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30 transition-colors hover:bg-muted/50">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="auto-breaks" className="text-sm font-medium cursor-pointer">Auto-start Breaks</Label>
                                        <p className="text-xs text-muted-foreground">Automatically start break timer</p>
                                    </div>
                                    <Switch
                                        id="auto-breaks"
                                        checked={settings.autoStartBreaks}
                                        onCheckedChange={(checked) => updateSettings({ autoStartBreaks: checked })}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30 transition-colors hover:bg-muted/50">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="auto-pomodoros" className="text-sm font-medium cursor-pointer">Auto-start Focus</Label>
                                        <p className="text-xs text-muted-foreground">Automatically start next focus session</p>
                                    </div>
                                    <Switch
                                        id="auto-pomodoros"
                                        checked={settings.autoStartPomodoros}
                                        onCheckedChange={(checked) => updateSettings({ autoStartPomodoros: checked })}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30 transition-colors hover:bg-muted/50">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="notifications" className="text-sm font-medium cursor-pointer">Notifications</Label>
                                        <p className="text-xs text-muted-foreground">Browser desktop notifications</p>
                                    </div>
                                    <Switch
                                        id="notifications"
                                        checked={settings.notificationsEnabled}
                                        onCheckedChange={(checked) => updateSettings({ notificationsEnabled: checked })}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}
