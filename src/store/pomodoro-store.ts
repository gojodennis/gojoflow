import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export type PomodoroMode = 'focus' | 'short-break' | 'long-break';
export type TimerStatus = 'idle' | 'running' | 'paused';

export interface PomodoroSettings {
    focusDuration: number; // minutes
    shortBreakDuration: number; // minutes
    longBreakDuration: number; // minutes
    sessionsPerCycle: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
    soundEnabled: boolean;
    soundPreset: 'default' | 'gentle' | 'bell' | 'none';
    volume: number; // 0-100
    notificationsEnabled: boolean;
}

export interface PomodoroSession {
    id: string;
    user_id: string;
    task_id?: string;
    session_type: PomodoroMode;
    duration_minutes: number;
    completed_at: string;
    notes?: string;
    created_at: string;
}

interface PomodoroState {
    // Timer State
    mode: PomodoroMode;
    status: TimerStatus;
    timeRemaining: number; // seconds
    completedSessions: number; // sessions completed in current cycle
    totalSessionsToday: number;

    // Task Integration
    activeTaskId: string | null;

    // Settings
    settings: PomodoroSettings;

    // Stats
    todayFocusTime: number; // minutes
    currentStreak: number; // consecutive days
    weeklyStats: { date: string; minutes: number }[];
    isLoading: boolean;
    error: string | null;

    // Actions
    startTimer: () => void;
    pauseTimer: () => void;
    resetTimer: () => void;
    skipSession: () => void;
    completeSession: (notes?: string) => Promise<void>;
    setMode: (mode: PomodoroMode) => void;
    setActiveTask: (taskId: string | null) => void;
    updateSettings: (settings: Partial<PomodoroSettings>) => void;
    loadStats: () => Promise<void>;
    loadSettings: () => void;
    saveSettings: () => void;
    logCustomSession: (taskId: string, duration: number, notes?: string) => Promise<void>;
}

// Default settings
const defaultSettings: PomodoroSettings = {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsPerCycle: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: true,
    soundPreset: 'default',
    volume: 70,
    notificationsEnabled: true,
};

// Load settings from localStorage
const loadSettingsFromStorage = (): PomodoroSettings => {
    try {
        const stored = localStorage.getItem('pomodoro-settings');
        if (stored) {
            return { ...defaultSettings, ...JSON.parse(stored) };
        }
    } catch (error) {
        console.error('Failed to load settings:', error);
    }
    return defaultSettings;
};

// Save settings to localStorage
const saveSettingsToStorage = (settings: PomodoroSettings) => {
    try {
        localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
    } catch (error) {
        console.error('Failed to save settings:', error);
    }
};

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
    // Initial State
    mode: 'focus',
    status: 'idle',
    timeRemaining: 25 * 60, // 25 minutes in seconds
    completedSessions: 0,
    totalSessionsToday: 0,
    activeTaskId: null,
    settings: loadSettingsFromStorage(),
    todayFocusTime: 0,
    currentStreak: 0,
    weeklyStats: [],
    isLoading: false,
    error: null,

    // Start Timer
    startTimer: () => {
        const state = get();
        if (state.status === 'idle') {
            // Starting fresh - set time based on current mode
            const duration =
                state.mode === 'focus'
                    ? state.settings.focusDuration
                    : state.mode === 'short-break'
                        ? state.settings.shortBreakDuration
                        : state.settings.longBreakDuration;

            set({ status: 'running', timeRemaining: duration * 60 });
        } else {
            // Resuming from pause
            set({ status: 'running' });
        }
    },

    // Pause Timer
    pauseTimer: () => {
        set({ status: 'paused' });
    },

    // Reset Timer
    resetTimer: () => {
        const state = get();
        const duration =
            state.mode === 'focus'
                ? state.settings.focusDuration
                : state.mode === 'short-break'
                    ? state.settings.shortBreakDuration
                    : state.settings.longBreakDuration;

        set({ status: 'idle', timeRemaining: duration * 60 });
    },

    // Skip to next session
    skipSession: () => {
        const state = get();
        let nextMode: PomodoroMode;
        let newCompletedSessions = state.completedSessions;

        if (state.mode === 'focus') {
            newCompletedSessions += 1;
            // After focus, go to break
            if (newCompletedSessions >= state.settings.sessionsPerCycle) {
                nextMode = 'long-break';
                newCompletedSessions = 0; // Reset cycle
            } else {
                nextMode = 'short-break';
            }
        } else {
            // After break, go to focus
            nextMode = 'focus';
        }

        const duration =
            nextMode === 'focus'
                ? state.settings.focusDuration
                : nextMode === 'short-break'
                    ? state.settings.shortBreakDuration
                    : state.settings.longBreakDuration;

        set({
            mode: nextMode,
            status: 'idle',
            timeRemaining: duration * 60,
            completedSessions: newCompletedSessions,
        });
    },

    // Complete session and save to database
    completeSession: async (notes?: string) => {
        const state = get();
        const userId = (await supabase.auth.getUser()).data.user?.id;

        if (!userId) {
            console.error('User not authenticated');
            return;
        }

        try {
            // Save session to Supabase
            const duration =
                state.mode === 'focus'
                    ? state.settings.focusDuration
                    : state.mode === 'short-break'
                        ? state.settings.shortBreakDuration
                        : state.settings.longBreakDuration;

            const { error } = await supabase
                .from('pomodoro_sessions')
                .insert([{
                    user_id: userId,
                    task_id: state.activeTaskId,
                    session_type: state.mode,
                    duration_minutes: duration,
                    notes,
                }]);

            if (error) throw error;

            // Update local stats
            if (state.mode === 'focus') {
                set({
                    todayFocusTime: state.todayFocusTime + duration,
                    totalSessionsToday: state.totalSessionsToday + 1,
                });
            }

            // Determine next mode
            let nextMode: PomodoroMode;
            let newCompletedSessions = state.completedSessions;

            if (state.mode === 'focus') {
                newCompletedSessions += 1;
                if (newCompletedSessions >= state.settings.sessionsPerCycle) {
                    nextMode = 'long-break';
                    newCompletedSessions = 0;
                } else {
                    nextMode = 'short-break';
                }
            } else {
                nextMode = 'focus';
            }

            const nextDuration =
                nextMode === 'focus'
                    ? state.settings.focusDuration
                    : nextMode === 'short-break'
                        ? state.settings.shortBreakDuration
                        : state.settings.longBreakDuration;

            // Auto-start next session if enabled
            const shouldAutoStart =
                (nextMode === 'focus' && state.settings.autoStartPomodoros) ||
                (nextMode !== 'focus' && state.settings.autoStartBreaks);

            set({
                mode: nextMode,
                status: shouldAutoStart ? 'running' : 'idle',
                timeRemaining: nextDuration * 60,
                completedSessions: newCompletedSessions,
            });

        } catch (error) {
            console.error('Failed to save session:', error);
            set({ error: error instanceof Error ? error.message : 'Failed to save session' });
        }
    },

    // Set mode manually
    setMode: (mode: PomodoroMode) => {
        const state = get();
        const duration =
            mode === 'focus'
                ? state.settings.focusDuration
                : mode === 'short-break'
                    ? state.settings.shortBreakDuration
                    : state.settings.longBreakDuration;

        set({ mode, status: 'idle', timeRemaining: duration * 60 });
    },

    // Set active task
    setActiveTask: (taskId: string | null) => {
        set({ activeTaskId: taskId });
    },

    // Update settings
    updateSettings: (newSettings: Partial<PomodoroSettings>) => {
        const state = get();
        const updatedSettings = { ...state.settings, ...newSettings };
        set({ settings: updatedSettings });
        saveSettingsToStorage(updatedSettings);

        // If currently idle, update time remaining if duration changed
        if (state.status === 'idle') {
            const duration =
                state.mode === 'focus'
                    ? updatedSettings.focusDuration
                    : state.mode === 'short-break'
                        ? updatedSettings.shortBreakDuration
                        : updatedSettings.longBreakDuration;

            set({ timeRemaining: duration * 60 });
        }
    },

    // Load stats from Supabase
    loadStats: async () => {
        const userId = (await supabase.auth.getUser()).data.user?.id;

        if (!userId) return;

        set({ isLoading: true });

        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Get today's sessions
            const { data: todaySessions, error: todayError } = await supabase
                .from('pomodoro_sessions')
                .select('*')
                .eq('user_id', userId)
                .gte('completed_at', today.toISOString());

            if (todayError) throw todayError;

            // Calculate today's focus time
            const focusTime = todaySessions
                ?.filter(s => s.session_type === 'focus')
                .reduce((acc, s) => acc + s.duration_minutes, 0) || 0;

            const sessionCount = todaySessions?.filter(s => s.session_type === 'focus').length || 0;

            // Calculate streak (simplified - just checks last 7 days)
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 6); // Last 7 days

            const { data: weekSessions, error: weekError } = await supabase
                .from('pomodoro_sessions')
                .select('completed_at, duration_minutes')
                .eq('user_id', userId)
                .eq('session_type', 'focus')
                .gte('completed_at', weekAgo.toISOString())
                .order('completed_at', { ascending: true });

            if (weekError) throw weekError;

            // Calculate streak
            let streak = 0;
            if (weekSessions && weekSessions.length > 0) {
                const dates = new Set(
                    weekSessions.map(s => new Date(s.completed_at).toDateString())
                );

                const checkDate = new Date();
                while (dates.has(checkDate.toDateString())) {
                    streak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                }
            }

            // Calculate weekly stats
            const weeklyStatsMap = new Map<string, number>();

            // Initialize map with 0 for last 7 days
            for (let i = 0; i < 7; i++) {
                const d = new Date(weekAgo);
                d.setDate(d.getDate() + i);
                weeklyStatsMap.set(d.toDateString(), 0);
            }

            weekSessions?.forEach(session => {
                const date = new Date(session.completed_at).toDateString();
                if (weeklyStatsMap.has(date)) {
                    weeklyStatsMap.set(date, (weeklyStatsMap.get(date) || 0) + session.duration_minutes);
                }
            });

            const weeklyStats = Array.from(weeklyStatsMap.entries()).map(([date, minutes]) => ({
                date,
                minutes
            }));

            set({
                todayFocusTime: focusTime,
                totalSessionsToday: sessionCount,
                currentStreak: streak,
                weeklyStats,
                isLoading: false
            });

        } catch (error) {
            console.error('Failed to load stats:', error);
            set({ error: error instanceof Error ? error.message : 'Failed to load stats', isLoading: false });
        }
    },

    // Load settings
    loadSettings: () => {
        const settings = loadSettingsFromStorage();
        set({ settings });
    },

    // Save settings
    saveSettings: () => {
        const state = get();
        saveSettingsToStorage(state.settings);
    },

    // Log a custom session (e.g. for partial sessions when switching tasks)
    logCustomSession: async (taskId: string, duration: number, notes?: string) => {
        const state = get();
        const userId = (await supabase.auth.getUser()).data.user?.id;

        if (!userId || duration <= 0) return;

        try {
            const { error } = await supabase
                .from('pomodoro_sessions')
                .insert([{
                    user_id: userId,
                    task_id: taskId,
                    session_type: state.mode,
                    duration_minutes: Math.round(duration),
                    notes,
                }]);

            if (error) throw error;

            // Update local stats if it was a focus session
            if (state.mode === 'focus') {
                set({
                    todayFocusTime: state.todayFocusTime + Math.round(duration),
                    totalSessionsToday: state.totalSessionsToday + 1,
                });
            }
        } catch (error) {
            console.error('Failed to log custom session:', error);
        }
    },
}));
