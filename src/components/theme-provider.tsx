import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
    setThemeWithTransition: (theme: Theme, x: number, y: number) => void
}

const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null,
    setThemeWithTransition: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    )

    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove("light", "dark")

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light"

            root.classList.add(systemTheme)
            return
        }

        root.classList.add(theme)
    }, [theme])

    const setThemeWithTransition = async (newTheme: Theme, x: number, y: number) => {
        // Check if View Transitions API is supported
        if (!document.startViewTransition) {
            // Fallback for unsupported browsers
            localStorage.setItem(storageKey, newTheme)
            setTheme(newTheme)
            return
        }

        // Calculate the maximum distance from click point to corners
        const maxX = Math.max(x, window.innerWidth - x)
        const maxY = Math.max(y, window.innerHeight - y)
        const radius = Math.hypot(maxX, maxY)

        // Start the view transition
        const transition = document.startViewTransition(async () => {
            localStorage.setItem(storageKey, newTheme)
            setTheme(newTheme)
        })

        // Apply the circular clip-path animation
        await transition.ready

        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${radius}px at ${x}px ${y}px)`,
                ],
            },
            {
                duration: 600,
                easing: "ease-in-out",
                pseudoElement: "::view-transition-new(root)",
            }
        )
    }

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
        },
        setThemeWithTransition,
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}
