"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/AuthProvider"
import { LogOut, MessageSquare, Calendar } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { FeedbackPopup } from "@/components/features/FeedbackPopup"
import { useCalendarStore } from "@/store/calendar-store"

export default function SettingsPage() {
    const { signOut, user } = useAuth()
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            return
        }

        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            const { error } = await supabase.functions.invoke('delete-account', {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            })

            if (error) throw error

            await signOut()
        } catch (error) {
            console.error("Error deleting account:", error)
            alert("Failed to delete account. Please try again.")
        }
    }

    const { isAuthenticated, signIn, fetchEvents, initialize, isLoading } = useCalendarStore()

    useEffect(() => {
        initialize()
    }, [])

    const handleGoogleConnect = async () => {
        if (!isAuthenticated) {
            await signIn()
        } else {
            await fetchEvents()
            alert("Calendar events synced!")
        }
    }

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            <div className="space-y-6">
                <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Account</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                        <Button variant="outline" onClick={signOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Log Out
                        </Button>
                    </div>
                </div>

                <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Integrations</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Google Calendar</p>
                            <p className="text-sm text-muted-foreground">
                                {isAuthenticated
                                    ? "Connected to your primary calendar."
                                    : "Import events from your Google Calendar."}
                            </p>
                        </div>
                        <Button
                            variant={isAuthenticated ? "secondary" : "default"}
                            onClick={handleGoogleConnect}
                            disabled={isLoading}
                        >
                            <Calendar className="mr-2 h-4 w-4" />
                            {isLoading ? "Syncing..." : (isAuthenticated ? "Sync Now" : "Connect")}
                        </Button>
                    </div>
                </div>

                <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Feedback</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Send Feedback</p>
                            <p className="text-sm text-muted-foreground">
                                Share your thoughts, suggestions, or report issues.
                            </p>
                        </div>
                        <Button variant="outline" onClick={() => setIsFeedbackOpen(true)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send Feedback
                        </Button>
                    </div>
                </div>

                <div className="p-6 rounded-lg border border-destructive/20 bg-destructive/5 text-card-foreground shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-destructive">Danger Zone</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Delete Account</p>
                            <p className="text-sm text-muted-foreground">
                                Permanently delete your account and all of your content.
                            </p>
                        </div>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                            Delete Account
                        </Button>
                    </div>
                </div>
            </div>

            {/* Controlled Feedback Popup */}
            <FeedbackPopup
                controlled={true}
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
            />
        </div>
    )
}
