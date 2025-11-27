'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { shouldShowFeedbackPopup, dismissFeedbackPopup, submitFeedback } from '@/lib/feedback-utils';

interface FeedbackPopupProps {
    /** If true, popup is controlled externally via isOpen prop */
    controlled?: boolean;
    /** External control for popup visibility (only used if controlled=true) */
    isOpen?: boolean;
    /** Callback when popup closes (only used if controlled=true) */
    onClose?: () => void;
}

export function FeedbackPopup({ controlled = false, isOpen: externalIsOpen, onClose }: FeedbackPopupProps = {}) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Use external control if controlled, otherwise use internal state
    const isOpen = controlled ? (externalIsOpen ?? false) : internalIsOpen;

    useEffect(() => {
        // Only auto-show for non-controlled mode
        if (controlled) return;

        // Check if we should show the popup
        const checkAndShow = async () => {
            const shouldShow = await shouldShowFeedbackPopup();
            if (shouldShow) {
                // Delay showing the popup slightly for better UX
                setTimeout(() => setInternalIsOpen(true), 1500);
            }
        };

        checkAndShow();
    }, [controlled]);

    const handleDismiss = () => {
        // Only mark as dismissed in localStorage for auto-shown popups
        if (!controlled) {
            dismissFeedbackPopup();
        }

        // Close the popup
        if (controlled && onClose) {
            onClose();
        } else {
            setInternalIsOpen(false);
        }
    };

    const handleSubmit = async () => {
        if (!message.trim()) return;

        setIsSubmitting(true);
        const result = await submitFeedback(message);

        if (result.success) {
            setSubmitStatus('success');
            setTimeout(() => {
                if (controlled && onClose) {
                    onClose();
                } else {
                    setInternalIsOpen(false);
                }
                // Reset form after closing
                setTimeout(() => {
                    setMessage('');
                    setSubmitStatus('idle');
                }, 300);
            }, 2000);
        } else {
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus('idle'), 3000);
        }

        setIsSubmitting(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
                    onClick={handleDismiss}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md bg-background border border-border rounded-lg shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Glassmorphism effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />

                        {/* Close button */}
                        <button
                            onClick={handleDismiss}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary/50 transition-colors z-10"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Content */}
                        <div className="relative p-6 space-y-4">
                            {/* Header */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <MessageSquare className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold font-heading">
                                        Welcome to gojoflow! 👋
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        We'd love to hear your thoughts. How's your experience so far?
                                    </p>
                                </div>
                            </div>

                            {/* Textarea */}
                            <div className="space-y-2">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Share your feedback, suggestions, or just say hi..."
                                    className="w-full min-h-[120px] px-4 py-3 bg-secondary/50 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                                    disabled={isSubmitting || submitStatus === 'success'}
                                />
                            </div>

                            {/* Status messages */}
                            <AnimatePresence>
                                {submitStatus === 'success' && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-sm text-green-600 dark:text-green-400"
                                    >
                                        ✓ Thank you for your feedback!
                                    </motion.p>
                                )}
                                {submitStatus === 'error' && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-sm text-red-600 dark:text-red-400"
                                    >
                                        Failed to submit. Please try again.
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={handleDismiss}
                                    className="flex-1"
                                    disabled={isSubmitting}
                                >
                                    Maybe Later
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    className="flex-1 gap-2"
                                    disabled={!message.trim() || isSubmitting || submitStatus === 'success'}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Send Feedback
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
