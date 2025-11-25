"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/AuthProvider"
import { LogOut } from "lucide-react"

export default function SettingsPage() {
    const { signOut, user } = useAuth()

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
                        <Button variant="destructive" onClick={signOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Log Out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
