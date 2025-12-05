import { useEffect, useState } from 'react';

export function useNotifications() {
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const result = await Notification.requestPermission();
            setPermission(result);
            return result === 'granted';
        }

        return false;
    };

    const showNotification = (title: string, options?: NotificationOptions) => {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return;
        }

        if (Notification.permission === 'granted') {
            new Notification(title, {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                ...options,
            });
        } else if (Notification.permission === 'default') {
            requestPermission().then((granted) => {
                if (granted) {
                    new Notification(title, {
                        icon: '/favicon.ico',
                        badge: '/favicon.ico',
                        ...options,
                    });
                }
            });
        }
    };

    return {
        permission,
        requestPermission,
        showNotification,
        isSupported: 'Notification' in window,
    };
}
