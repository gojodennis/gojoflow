"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Zap } from "lucide-react"

interface StatsCarouselProps {
    calendar: React.ReactNode
    energy: React.ReactNode
}

export function StatsCarousel({ calendar, energy }: StatsCarouselProps) {
    const [activeTab, setActiveTab] = React.useState<"calendar" | "energy">("calendar")

    return (
        <div className="flex flex-col h-full gap-4">
            {/* Toggle Controls */}
            <div className="flex p-1 bg-background/60 backdrop-blur-xl border border-white/10 rounded-lg w-fit self-end">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("calendar")}
                    className={cn(
                        "h-7 px-3 text-xs font-medium rounded-md transition-all",
                        activeTab === "calendar"
                            ? "bg-primary/20 text-primary hover:bg-primary/25"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                >
                    <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
                    Calendar
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("energy")}
                    className={cn(
                        "h-7 px-3 text-xs font-medium rounded-md transition-all",
                        activeTab === "energy"
                            ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/25"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                >
                    <Zap className="w-3.5 h-3.5 mr-1.5" />
                    Energy
                </Button>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden rounded-xl border border-white/10 bg-background/40 backdrop-blur-sm">
                <AnimatePresence mode="wait" initial={false}>
                    {activeTab === "calendar" ? (
                        <motion.div
                            key="calendar"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0"
                        >
                            {calendar}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="energy"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0"
                        >
                            {energy}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
