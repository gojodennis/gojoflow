import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Trash2 } from 'lucide-react';

interface PomodoroNotesProps {
    value: string;
    onChange: (value: string) => void;
}

export function PomodoroNotes({ value, onChange }: PomodoroNotesProps) {
    const [localValue, setLocalValue] = useState(value);

    const handleSave = () => {
        onChange(localValue);
    };

    const handleClear = () => {
        setLocalValue('');
        onChange('');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Session Notes</CardTitle>
                <CardDescription>
                    Jot down thoughts during your session
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <Textarea
                    placeholder="What did you accomplish? Any blockers?"
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    className="min-h-[120px] resize-none"
                />

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSave}
                        disabled={localValue === value}
                        className="flex-1"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        disabled={!localValue}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear
                    </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                    Notes are automatically saved when a session completes
                </p>
            </CardContent>
        </Card>
    );
}
