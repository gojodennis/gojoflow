"use client"

import * as React from "react"
import {
    Calendar,
    User,
    Zap,
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/providers/AuthProvider"
import { useTaskContext } from "@/components/providers/TaskContext"

export function CommandMenu() {
    const { user } = useAuth()
    const { createTask } = useTaskContext()
    const [open, setOpen] = React.useState(false)
    const [taskDialogOpen, setTaskDialogOpen] = React.useState(false)
    const [newTask, setNewTask] = React.useState({ title: "", duration: "30", energy: "medium" })

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const handleCreateTask = async () => {
        try {
            if (!newTask.title || !user) return

            await createTask({
                title: newTask.title,
                duration: parseInt(newTask.duration) || 30,
                energy_level: newTask.energy as "low" | "medium" | "high",
                completed: false,
            })

            setTaskDialogOpen(false)
            setNewTask({ title: "", duration: "30", energy: "medium" })
        } catch (error) {
            console.error('Error creating task:', error)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCreateTask()
        }
    }

    return (
        <>
            <div className="hidden"></div>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." className="focus:ring-0 focus:border-none" />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Calendar</span>
                        </CommandItem>
                        <CommandItem onSelect={() => {
                            setOpen(false)
                            setTaskDialogOpen(true)
                        }}>
                            <Zap className="mr-2 h-4 w-4" />
                            <span>Quick Task</span>
                            <CommandShortcut>⌘T</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                        <CommandItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                            <CommandShortcut>⌘P</CommandShortcut>
                        </CommandItem>
                        {/* ... other items ... */}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>

            <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Task</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Task Title</Label>
                            <Input
                                id="title"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g. Review PRD"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="duration">Duration (min)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    value={newTask.duration}
                                    onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="energy">Energy Level</Label>
                                <Select
                                    value={newTask.energy}
                                    onValueChange={(v: "low" | "medium" | "high") => setNewTask({ ...newTask, energy: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select energy" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="high">High (Focus)</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleCreateTask}>Create Task</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
