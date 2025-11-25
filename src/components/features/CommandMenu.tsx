"use client"

import * as React from "react"
import {
    Command as CommandIcon,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/providers/AuthProvider"
import { useTaskContext } from "@/components/providers/TaskContext"
import { predictEnergyLevel, extractDuration } from "@/lib/ai-utils"

export function CommandMenu() {
    const { signOut } = useAuth()
    const { createTask } = useTaskContext()
    const navigate = useNavigate()
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
            if (!newTask.title) return

            await createTask({
                title: newTask.title,
                duration: parseInt(newTask.duration) || 30,
                energy_level: newTask.energy as "low" | "medium" | "high",
                completed: false,
            })

            setTaskDialogOpen(false)
            setOpen(false)
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

    const handleSignOut = async () => {
        try {
            await signOut()
            setOpen(false)
            navigate('/')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    const handleNavigateCalendar = () => {
        setOpen(false)
        navigate('/calendar')
    }

    return (
        <>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <div className="relative">
                    <div className="flex items-center gap-3 border-b border-border/50 px-4 py-5">
                        <CommandIcon className="h-5 w-5 text-purple-500 shrink-0" />
                        <CommandInput
                            placeholder="Type a command..."
                            className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-lg placeholder:text-muted-foreground/60 px-0 h-10 flex-1"
                        />
                        <kbd className="pointer-events-none inline-flex h-7 select-none items-center gap-1 rounded bg-muted/30 px-2.5 font-mono text-[12px] font-medium text-muted-foreground/70">
                            ⌘K
                        </kbd>
                    </div>
                </div>
                <CommandList className="max-h-[400px] p-3">
                    <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
                        No results found.
                    </CommandEmpty>

                    <CommandGroup className="px-0">
                        <CommandItem
                            onSelect={() => {
                                setOpen(false)
                                setTaskDialogOpen(true)
                            }}
                            className="px-3 py-2.5 rounded-md cursor-pointer"
                        >
                            <span className="text-pink-500 mr-3 text-lg leading-none">•</span>
                            <span className="text-sm">Create Task</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={handleNavigateCalendar}
                            className="px-3 py-2.5 rounded-md cursor-pointer"
                        >
                            <span className="text-pink-500 mr-3 text-lg leading-none">•</span>
                            <span className="text-sm">Calendar</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={handleSignOut}
                            className="px-3 py-2.5 rounded-md cursor-pointer"
                        >
                            <span className="text-pink-500 mr-3 text-lg leading-none">•</span>
                            <span className="text-sm">Sign Out</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>

            <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Create New Task</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Task Name</Label>
                            <Input
                                id="title"
                                value={newTask.title}
                                onChange={(e) => {
                                    const title = e.target.value;
                                    const energy = predictEnergyLevel(title);
                                    const duration = extractDuration(title);
                                    setNewTask(prev => ({
                                        ...prev,
                                        title,
                                        energy,
                                        duration: duration ? duration.toString() : prev.duration
                                    }))
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g. Review PRD"
                                className="border-border focus-visible:ring-0 focus-visible:ring-offset-0"
                                autoFocus
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="duration">Time (minutes)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    value={newTask.duration}
                                    onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
                                    onKeyDown={handleKeyDown}
                                    className="border-border focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="energy">Intensity</Label>
                                <Select
                                    value={newTask.energy}
                                    onValueChange={(v: "low" | "medium" | "high") => setNewTask({ ...newTask, energy: v })}
                                >
                                    <SelectTrigger className="border-border focus:ring-0 focus:ring-offset-0">
                                        <SelectValue placeholder="Select intensity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setTaskDialogOpen(false)
                            setOpen(true)
                        }}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateTask} disabled={!newTask.title}>
                            Create Task
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
