export interface Task {
    id: string
    title: string
    energy_level: "low" | "medium" | "high"
    duration: number
    completed: boolean
    created_at: string
}

export interface TimeBlock {
    id: string
    task: {
        title: string
        energy_level: "low" | "medium" | "high"
    }
    start_time: string
    end_time: string
}

interface ScheduleResult {
    scheduled: { task: Task; start: Date; end: Date }[]
    unscheduled: Task[]
}


// Helper to check if two ranges overlap
const isOverlapping = (start1: Date, end1: Date, start2: Date, end2: Date) => {
    return start1 < end2 && start2 < end1
}

export const calculateTaskEnergy = (task: Partial<Task>): "low" | "medium" | "high" => {
    // 1. Manual override (if already set)
    if (task.energy_level) return task.energy_level

    // 2. Duration based inference
    const duration = task.duration || 30
    if (duration > 80) return "high"
    if (duration > 40) return "medium"

    // 3. Keyword inference (simple heuristic)
    const title = task.title?.toLowerCase() || ""
    if (title.includes("study") || title.includes("research") || title.includes("build")) return "high"
    if (title.includes("meeting") || title.includes("email")) return "low"

    return "low"
}

// Helper to split long tasks
const splitTask = (task: Task, maxDuration = 90): Task[] => {
    if (task.duration <= maxDuration) return [task]

    const parts: Task[] = []
    let remainingDuration = task.duration
    let partCount = 1

    while (remainingDuration > 0) {
        const chunkDuration = Math.min(remainingDuration, 60) // Split into 60 min chunks
        parts.push({
            ...task,
            id: `${task.id}-part${partCount}`,
            title: `${task.title} (Part ${partCount})`,
            duration: chunkDuration,
            // Inherit other props
        })
        remainingDuration -= chunkDuration
        partCount++
    }

    return parts
}

export const autoSchedule = (
    tasks: Task[],
    existingBlocks: TimeBlock[],
    userEnergy: "low" | "medium" | "high",
    targetDate: Date = new Date(), // Default to now/today
    workStartHour = 9, // 9 AM
    workEndHour = 17   // 5 PM
): ScheduleResult => {
    const scheduled: { task: Task; start: Date; end: Date }[] = []
    const unscheduled: Task[] = []

    // 1. Filter and Sort Tasks
    // Rule: Task Energy <= User Energy
    const energyMap = { low: 1, medium: 2, high: 3 }
    const eligibleTasks = tasks.filter(t => {
        const taskEnergy = energyMap[t.energy_level]
        const currentEnergy = energyMap[userEnergy]
        return taskEnergy <= currentEnergy && !t.completed
    })

    // 2. Split Long Tasks
    let tasksToSchedule: Task[] = []
    eligibleTasks.forEach(task => {
        tasksToSchedule.push(...splitTask(task))
    })

    // Sort: High Energy first, then Shortest Duration (to fit more)
    tasksToSchedule.sort((a, b) => {
        const energyDiff = energyMap[b.energy_level] - energyMap[a.energy_level]
        if (energyDiff !== 0) return energyDiff
        return a.duration - b.duration
    })

    // 3. Define Available Slots
    const startOfTargetDay = new Date(targetDate)
    startOfTargetDay.setHours(workStartHour, 0, 0, 0)

    const now = new Date()
    let searchStart = new Date(targetDate)

    // If target is today, start from next half hour or work start, whichever is later
    if (searchStart.toDateString() === now.toDateString()) {
        if (now.getHours() >= workStartHour) {
            searchStart = new Date(now)
            if (searchStart.getMinutes() > 30) {
                searchStart.setHours(searchStart.getHours() + 1, 0, 0, 0)
            } else {
                searchStart.setMinutes(30, 0, 0)
            }
        } else {
            searchStart = new Date(startOfTargetDay)
        }
    } else {
        // Future date: start at work start time
        searchStart = new Date(startOfTargetDay)
    }

    // 4. Find Slots
    // We iterate through time in 15 min increments
    const timeStep = 15 * 60 * 1000 // 15 mins in ms
    let currentTime = searchStart.getTime()
    const endTime = new Date(targetDate).setHours(workEndHour + 4) // Allow overtime for now

    for (const task of tasksToSchedule) {
        let scheduledTask = false
        const taskDurationMs = task.duration * 60 * 1000

        // Try to find a slot for this task
        // Simple greedy search
        let slotStart = currentTime

        // Look ahead for a gap
        while (slotStart + taskDurationMs <= endTime) {
            const slotEnd = slotStart + taskDurationMs
            const slotStartDate = new Date(slotStart)
            const slotEndDate = new Date(slotEnd)

            // Check collision with existing blocks
            const hasCollision = existingBlocks.some(block => {
                const blockStart = new Date(block.start_time)
                const blockEnd = new Date(block.end_time)
                return isOverlapping(slotStartDate, slotEndDate, blockStart, blockEnd)
            })

            // Check collision with newly scheduled blocks
            const hasNewCollision = scheduled.some(s => {
                return isOverlapping(slotStartDate, slotEndDate, s.start, s.end)
            })

            if (!hasCollision && !hasNewCollision) {
                // Found a slot!
                scheduled.push({
                    task,
                    start: slotStartDate,
                    end: slotEndDate
                })
                scheduledTask = true
                // Advance current time to end of this task to optimize search for next
                // But strictly we should keep searching from start for smaller holes.
                // For MVP greedy:
                // currentTime = slotEnd 
                break
            }

            slotStart += timeStep
        }

        if (!scheduledTask) {
            unscheduled.push(task)
        }
    }

    return { scheduled, unscheduled }
}

export const checkBurnout = (blocks: TimeBlock[], limitHours = 8): { isBurnout: boolean; totalHours: number } => {
    const totalMinutes = blocks.reduce((acc, block) => {
        const start = new Date(block.start_time)
        const end = new Date(block.end_time)
        const duration = (end.getTime() - start.getTime()) / (1000 * 60)
        return acc + duration
    }, 0)

    const totalHours = totalMinutes / 60
    return {
        isBurnout: totalHours > limitHours,
        totalHours
    }
}
