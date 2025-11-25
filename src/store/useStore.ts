import { create } from 'zustand'

interface AppState {
    user: any | null
    setUser: (user: any | null) => void
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void
    energy: "low" | "medium" | "high"
    setEnergy: (energy: "low" | "medium" | "high") => void
}

export const useStore = create<AppState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),
    energy: "medium",
    setEnergy: (energy) => set({ energy }),
}))
