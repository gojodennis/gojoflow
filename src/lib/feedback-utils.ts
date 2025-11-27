import { supabase } from './supabase';

const FEEDBACK_DISMISSED_KEY = 'gojoflow_feedback_dismissed';
const NEW_USER_THRESHOLD_DAYS = 7;

/**
 * Check if user should see the feedback popup
 * A user is considered "new" if their account was created within the last 7 days
 * and they haven't dismissed the popup yet
 */
export async function shouldShowFeedbackPopup(): Promise<boolean> {
    // Check if user has dismissed the popup
    const dismissed = localStorage.getItem(FEEDBACK_DISMISSED_KEY);
    if (dismissed === 'true') {
        return false;
    }

    // Check if user is new (account created within threshold)
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const createdAt = new Date(user.created_at);
        const now = new Date();
        const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

        return daysSinceCreation <= NEW_USER_THRESHOLD_DAYS;
    } catch (error) {
        console.error('Error checking user status:', error);
        return false;
    }
}

/**
 * Mark the feedback popup as dismissed in localStorage
 */
export function dismissFeedbackPopup(): void {
    localStorage.setItem(FEEDBACK_DISMISSED_KEY, 'true');
}

/**
 * Submit user feedback to Supabase
 */
export async function submitFeedback(message: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        const { error } = await supabase
            .from('feedback')
            .insert({
                user_id: user.id,
                message: message.trim(),
                user_email: user.email,
                metadata: {
                    source: 'dashboard_popup',
                    timestamp: new Date().toISOString()
                }
            });

        if (error) {
            console.error('Error submitting feedback:', error);
            return { success: false, error: error.message };
        }

        // Fire and forget email sending via Edge Function
        supabase.functions.invoke('send-feedback', {
            body: {
                message: message.trim(),
                user_email: user.email,
                user_id: user.id
            }
        });

        // Mark as dismissed after successful submission
        dismissFeedbackPopup();
        return { success: true };
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}
