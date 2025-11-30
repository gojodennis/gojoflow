
import { CalendarControls } from "@/components/features/calendar/calendar-controls";
import { CalendarView } from "@/components/features/calendar/calendar-view";

export default function CalendarPage() {
    return (
        <div className="flex flex-col h-full bg-background overflow-hidden">
            <CalendarControls />
            <div className="flex-1 overflow-hidden relative">
                <CalendarView />
            </div>
        </div>
    );
}
