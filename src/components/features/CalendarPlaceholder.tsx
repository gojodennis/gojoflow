import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"

export function CalendarPlaceholder() {
    return (
        <div className="flex h-full w-full items-center justify-center p-8">
            <Card className="w-full max-w-md border-dashed">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Work in Progress</CardTitle>
                    <CardDescription>
                        We are currently building the new calendar experience.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center p-6">
                    <div className="pointer-events-none opacity-50 grayscale filter">
                        <Calendar
                            mode="single"
                            selected={new Date()}
                            className="rounded-md border shadow-sm"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
