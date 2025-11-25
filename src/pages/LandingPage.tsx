import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, CheckCircle2, Zap } from 'lucide-react';
import { Tiles } from '@/components/ui/tiles';
import { AuthModal } from '@/components/ui/auth-modal';
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { useAuth } from '@/components/providers/AuthProvider';
import {
    CalendarAnimation,
    TaskConsolidationAnimation,
    CommandBarAnimation,
    FocusModeAnimation,
    AutomationsAnimation
} from '@/components/ui/bento-animations';

const features = [
    {
        Icon: Calendar,
        name: "Unified Calendar",
        description: "Pull events from Google, Outlook, and more into a single view.",
        href: "/",
        cta: "Learn more",
        background: <CalendarAnimation />,
        className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
        Icon: CheckCircle2,
        name: "Task Consolidation",
        description: "Turn emails, Slack messages, and Jira tickets into tasks instantly.",
        href: "/",
        cta: "Learn more",
        background: <TaskConsolidationAnimation />,
        className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
        Icon: Zap,
        name: "Command Bar",
        description: "Navigate everything with your keyboard. Speed is our priority.",
        href: "/",
        cta: "Learn more",
        background: <CommandBarAnimation />,
        className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
        Icon: ArrowRight,
        name: "Focus Mode",
        description: "Enter a distraction-free environment to get deep work done.",
        href: "/",
        cta: "Learn more",
        background: <FocusModeAnimation />,
        className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
        Icon: CheckCircle2,
        name: "Energy Based Patterns",
        description: "Learns from recurring basic tasks to suggest optimal meeting times and schedules.",
        href: "/",
        cta: "Learn more",
        background: <AutomationsAnimation />,
        className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
];

const LandingPage = () => {
    const [authOpen, setAuthOpen] = useState(false);
    const { user } = useAuth();

    return (

        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative w-full h-screen overflow-hidden">
                <Tiles className="absolute inset-0 z-0" rows={50} cols={25} tileSize="lg" />

                <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center h-full space-y-8 max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-foreground">
                            CONSOLIDATE YOUR<br />ENTIRE WORKFLOW
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                            The universal task manager that brings all your tools into one timeline.
                            Minimal, fast, and keyboard-centric.
                        </p>
                        <div className="flex justify-center gap-4">
                            {user ? (
                                <Link to="/dashboard">
                                    <button className="bg-foreground text-background px-8 py-4 rounded-md text-lg font-medium hover:opacity-90 transition-all flex items-center gap-2 group">
                                        Go to Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                            ) : (
                                <button
                                    onClick={() => setAuthOpen(true)}
                                    className="bg-foreground text-background px-8 py-4 rounded-md text-lg font-medium hover:opacity-90 transition-all flex items-center gap-2 group"
                                >
                                    Sign Up <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}
                            <button className="border border-border bg-background/50 text-foreground hover:bg-background/70 px-8 py-4 rounded-md text-lg font-medium transition-colors backdrop-blur-sm">
                                Watch Demo
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 container mx-auto px-4">
                <BentoGrid className="lg:grid-rows-2">
                    {features.map((feature) => (
                        <BentoCard key={feature.name} {...feature} />
                    ))}
                </BentoGrid>
            </section>

            {/* Social Proof / Trusted By */}
            <section className="py-10 border-y border-border container mx-auto px-4">
                <p className="text-center text-sm text-muted-foreground mb-6">TRUSTED BY TEAMS AT</p>
                <div className="flex justify-center gap-12 opacity-50 grayscale">
                    {/* Placeholders for logos */}
                    <span className="font-bold text-xl">ACME</span>
                    <span className="font-bold text-xl">STRIPE</span>
                    <span className="font-bold text-xl">VERCEL</span>
                    <span className="font-bold text-xl">LINEAR</span>
                </div>
            </section>

            <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
        </div>
    );
};

export default LandingPage;
