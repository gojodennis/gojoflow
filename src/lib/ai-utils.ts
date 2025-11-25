
export type EnergyLevel = 'low' | 'medium' | 'high' | 'shizo';

export function predictEnergyLevel(title: string): EnergyLevel {
    const lowerTitle = title.toLowerCase();

    // Check for shizo keyword first
    if (lowerTitle.includes('meow')) {
        return 'shizo';
    }

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
