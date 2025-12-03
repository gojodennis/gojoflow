import { create } from "zustand";
import {
    format,
    startOfWeek,
    addWeeks,
    subWeeks,
    addDays,
    getDay,
} from "date-fns";
import { type CalendarEvent } from "../mock-data/events";
import { initGoogleClient, signInToGoogle, isSignedInToGoogle } from "@/lib/google-auth";


interface CalendarState {
    currentWeekStart: Date;
    searchQuery: string;
    eventTypeFilter: "all" | "with-meeting" | "without-meeting";
    participantsFilter: "all" | "with-participants" | "without-participants";
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    initialize: () => Promise<void>;
    signIn: () => Promise<void>;
    fetchEvents: () => Promise<void>;
    goToNextWeek: () => void;
    goToPreviousWeek: () => void;
    goToToday: () => void;
    goToDate: (date: Date) => void;
    setSearchQuery: (query: string) => void;
    setEventTypeFilter: (
        filter: "all" | "with-meeting" | "without-meeting"
    ) => void;
    setParticipantsFilter: (
        filter: "all" | "with-participants" | "without-participants"
    ) => void;
    events: CalendarEvent[];
    addEvent: (event: CalendarEvent) => Promise<void>;
    deleteEvent: (eventId: string) => Promise<void>;
    getCurrentWeekEvents: () => CalendarEvent[];
    getWeekDays: () => Date[];
}



function getDayOfWeek(date: Date): number {
    const day = getDay(date);
    return day === 0 ? 6 : day - 1;
}

function getEventsForWeek(startDate: Date, allEvents: CalendarEvent[]): CalendarEvent[] {
    const weekEvents: CalendarEvent[] = [];

    for (let i = 0; i < 7; i++) {
        const currentDay = addDays(startDate, i);
        const currentDayOfWeek = getDayOfWeek(currentDay);

        allEvents.forEach((event) => {
            const eventDate = new Date(event.date);
            const eventDayOfWeek = getDayOfWeek(eventDate);

            if (eventDayOfWeek === currentDayOfWeek) {
                const eventDateStr = format(currentDay, "yyyy-MM-dd");
                // Avoid duplicates if event spans multiple days (simplified logic)
                if (event.date === eventDateStr) {
                    weekEvents.push(event);
                }
            }
        });
    }

    return weekEvents;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
    currentWeekStart: startOfWeek(new Date(), { weekStartsOn: 1 }),
    searchQuery: "",
    eventTypeFilter: "all",
    participantsFilter: "all",
    isLoading: false,
    error: null,
    isAuthenticated: false,
    events: [], // Internal state to store fetched events

    initialize: async () => {
        try {
            await initGoogleClient();
            set({ isAuthenticated: isSignedInToGoogle() });
            if (isSignedInToGoogle()) {
                get().fetchEvents();
            }
        } catch (error) {
            console.error("Failed to initialize Google Client", error);
            set({ error: "Failed to initialize Google Client" });
        }
    },

    signIn: async () => {
        try {
            await signInToGoogle();
            set({ isAuthenticated: true });
            get().fetchEvents();
        } catch (error) {
            console.error("Failed to sign in", error);
            set({ error: "Failed to sign in" });
        }
    },

    fetchEvents: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await window.gapi.client.calendar.events.list({
                'calendarId': 'primary',
                'timeMin': subWeeks(get().currentWeekStart, 1).toISOString(), // Fetch a bit more context
                'timeMax': addWeeks(get().currentWeekStart, 2).toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'orderBy': 'startTime',
            });

            const googleEvents = response.result.items || [];
            const mappedEvents: CalendarEvent[] = googleEvents.map((event: {
                id: string;
                summary?: string;
                start: { dateTime?: string; date?: string; timeZone?: string };
                end: { dateTime?: string; date?: string };
                attendees?: { email: string }[];
                hangoutLink?: string;
            }) => {
                const start = event.start.dateTime || event.start.date || '';
                const end = event.end.dateTime || event.end.date || '';
                const date = start.split('T')[0];
                const startTime = start.includes('T') ? start.split('T')[1].substring(0, 5) : '00:00';
                const endTime = end.includes('T') ? end.split('T')[1].substring(0, 5) : '23:59';

                return {
                    id: event.id,
                    title: event.summary || 'No Title',
                    startTime,
                    endTime,
                    date,
                    participants: event.attendees ? event.attendees.map((a) => a.email) : [],
                    meetingLink: event.hangoutLink,
                    timezone: event.start.timeZone,
                };
            });

            // We need to store these events in a way that getEventsForWeek can use them.
            // For now, let's attach them to the store state (we need to add 'events' to the interface if we want to be strict, but for now we can just use a closure or extend the state)
            // Let's extend the state interface implicitly by adding it to the object returned by create
            // Actually, let's just update the getEventsForWeek to take the events as an argument, and store them in the state.
            // I'll add `events: CalendarEvent[]` to the state interface in a separate edit or assume it's there.
            // Wait, I missed adding `events` to the interface. I should add it.
            set({ events: mappedEvents, isLoading: false });

        } catch (error) {
            console.error("Failed to fetch events", error);
            set({ error: "Failed to fetch events", isLoading: false });
        }
    },

    goToNextWeek: () => {
        set((state) => ({
            currentWeekStart: addWeeks(state.currentWeekStart, 1),
        }));
        get().fetchEvents();
    },

    goToPreviousWeek: () => {
        set((state) => ({
            currentWeekStart: subWeeks(state.currentWeekStart, 1),
        }));
        get().fetchEvents();
    },

    goToToday: () => {
        set({
            currentWeekStart: startOfWeek(new Date(), { weekStartsOn: 1 }),
        });
        get().fetchEvents();
    },

    goToDate: (date: Date) => {
        set({
            currentWeekStart: startOfWeek(date, { weekStartsOn: 1 }),
        });
        get().fetchEvents();
    },

    setSearchQuery: (query: string) => set({ searchQuery: query }),
    setEventTypeFilter: (filter: "all" | "with-meeting" | "without-meeting") =>
        set({ eventTypeFilter: filter }),
    setParticipantsFilter: (
        filter: "all" | "with-participants" | "without-participants"
    ) => set({ participantsFilter: filter }),

    addEvent: async (event: CalendarEvent) => {
        // Optimistic update - add event to local state immediately
        set((state) => ({
            events: [...state.events, event],
        }));

        try {
            if (!isSignedInToGoogle()) {
                throw new Error('Not authenticated with Google');
            }

            // Create event in Google Calendar
            const response = await window.gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': {
                    'summary': event.title,
                    'start': {
                        'dateTime': `${event.date}T${event.startTime}:00`,
                        'timeZone': event.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                    },
                    'end': {
                        'dateTime': `${event.date}T${event.endTime}:00`,
                        'timeZone': event.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                    },
                    'attendees': event.participants?.length > 0
                        ? event.participants.map(email => ({ email }))
                        : undefined,
                    'hangoutLink': event.meetingLink,
                },
            });

            const googleEvent = response.result;

            // Update with real Google Calendar event ID
            set((state) => ({
                events: state.events.map(e =>
                    e.id === event.id ? { ...e, id: googleEvent.id || e.id } : e
                ),
            }));

            // Refresh events to ensure we have the latest from Google
            await get().fetchEvents();
        } catch (error) {
            console.error('Failed to create event in Google Calendar', error);

            // Rollback - remove the optimistically added event
            set((state) => ({
                events: state.events.filter(e => e.id !== event.id),
                error: 'Failed to create event. Please try again.',
            }));

            throw error;
        }
    },

    deleteEvent: async (eventId: string) => {
        const eventToDelete = get().events.find(e => e.id === eventId);
        if (!eventToDelete) return;

        // Optimistic update - remove event from local state immediately
        set((state) => ({
            events: state.events.filter(e => e.id !== eventId),
        }));

        try {
            if (!isSignedInToGoogle()) {
                throw new Error('Not authenticated with Google');
            }

            // Delete event from Google Calendar
            await (window.gapi.client.calendar.events as any).delete({
                'calendarId': 'primary',
                'eventId': eventId,
            });

            // Refresh events to ensure sync
            await get().fetchEvents();

        } catch (error) {
            console.error('Failed to delete event from Google Calendar', error);

            // Rollback - restore the event
            set((state) => ({
                events: [...state.events, eventToDelete],
                error: 'Failed to delete event. Please try again.',
            }));

            throw error;
        }
    },

    getCurrentWeekEvents: () => {
        const state = get();
        if (!state.events) return [];

        let weekEvents = getEventsForWeek(state.currentWeekStart, state.events);

        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            weekEvents = weekEvents.filter(
                (event) =>
                    event.title.toLowerCase().includes(query) ||
                    event.participants.some((p: string) => p.toLowerCase().includes(query))
            );
        }

        if (state.eventTypeFilter === "with-meeting") {
            weekEvents = weekEvents.filter((event) => event.meetingLink);
        } else if (state.eventTypeFilter === "without-meeting") {
            weekEvents = weekEvents.filter((event) => !event.meetingLink);
        }

        if (state.participantsFilter === "with-participants") {
            weekEvents = weekEvents.filter((event) => event.participants.length > 0);
        } else if (state.participantsFilter === "without-participants") {
            weekEvents = weekEvents.filter(
                (event) => event.participants.length === 0
            );
        }

        return weekEvents;
    },

    getWeekDays: () => {
        const state = get();
        const days: Date[] = [];
        for (let i = 0; i < 7; i++) {
            days.push(addDays(state.currentWeekStart, i));
        }
        return days;
    },
}));
