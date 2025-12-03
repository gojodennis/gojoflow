export interface CalendarEvent {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    date: string;
    participants: string[];
    meetingLink?: string;
    timezone?: string;
    description?: string;
    location?: string;
}

export const events: CalendarEvent[] = [];

export const getTodayEvents = (): CalendarEvent[] => {
    return events;
};
