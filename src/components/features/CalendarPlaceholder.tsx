import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
            </Card>
        </div>
    )
}
