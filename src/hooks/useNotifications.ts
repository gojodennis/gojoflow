import { toast } from 'sonner';

export function useNotifications() {
    // Permission state is no longer needed for in-app toasts, but kept for interface compatibility if needed later
    // or we can remove it. For now, we'll keep the signature but make it no-op.

    const requestPermission = async () => {
        return true; // Always "granted" for in-app toasts
    };

    const showNotification = (title: string, options?: NotificationOptions) => {
        // Map NotificationOptions to toast options
        // options.body -> description
        // options.tag -> id (for deduplication, though sonner handles this differently, we can use id)

        toast(title, {
            description: options?.body,
            id: options?.tag, // efficient for preventing duplicates if tag is provided
        });
    };

    return {
        permission: 'granted' as NotificationPermission,
        requestPermission,
        showNotification,
        isSupported: true,
    };
}
