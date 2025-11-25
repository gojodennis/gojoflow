
export type EnergyLevel = 'low' | 'medium' | 'high';

export function predictEnergyLevel(title: string): EnergyLevel {
    const lowerTitle = title.toLowerCase();

    const highEnergyKeywords = [
        'workout', 'run', 'gym', 'exercise', 'training',
        'study', 'learn', 'exam', 'test',
        'project', 'presentation', 'deadline', 'urgent', 'important',
        'meeting', 'interview', 'coding', 'programming', 'debug',
        'clean house', 'move'
    ];

    const lowEnergyKeywords = [
        'read', 'book', 'article',
        'email', 'reply', 'check',
        'call', 'phone', 'text',
        'buy', 'shop', 'groceries', 'order',
        'relax', 'meditate', 'nap', 'sleep',
        'watch', 'movie', 'show', 'series',
        'listen', 'music', 'podcast',
        'pay', 'bill'
    ];

    // Check for high energy keywords first
    if (highEnergyKeywords.some(keyword => lowerTitle.includes(keyword))) {
        return 'high';
    }

    // Check for low energy keywords
    if (lowEnergyKeywords.some(keyword => lowerTitle.includes(keyword))) {
        return 'low';
    }

    // Default to medium
    return 'medium';
}

export function extractDuration(text: string): number | null {
    const lowerText = text.toLowerCase();

    // Match hours: 1h, 1.5h, 1 hour, 1 hours
    const hourMatch = lowerText.match(/(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hour|hours)/);
    if (hourMatch) {
        return Math.round(parseFloat(hourMatch[1]) * 60);
    }

    // Match minutes: 30m, 30 min, 30 mins, 30 minutes
    const minMatch = lowerText.match(/(\d+)\s*(?:m|min|mins|minute|minutes)/);
    if (minMatch) {
        return parseInt(minMatch[1]);
    }

    return null;
}
