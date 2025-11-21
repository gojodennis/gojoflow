import { motion } from 'framer-motion';
import { ArrowRight, Calendar, CheckCircle2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackgroundBeams from '@/components/ui/background-beams';

const LandingPage = () => {
    return (

        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-32 md:py-48 text-center overflow-hidden">
                <BackgroundBeams className="opacity-70" />

                <div className="container mx-auto px-4 relative z-10 space-y-8 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                            CONSOLIDATE YOUR<br />ENTIRE WORKFLOW
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                            The universal task manager that brings all your tools into one timeline.
                            Minimal, fast, and keyboard-centric.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link to="/signup" className="bg-primary text-primary-foreground px-8 py-4 rounded-md text-lg font-medium hover:opacity-90 transition-all flex items-center gap-2 group">
                                Start for free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-8 py-4 rounded-md text-lg font-medium transition-colors">
                                Watch Demo
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Calendar className="w-6 h-6" />,
                            title: "Unified Calendar",
                            description: "Pull events from Google, Outlook, and more into a single view."
                        },
                        {
                            icon: <CheckCircle2 className="w-6 h-6" />,
                            title: "Task Consolidation",
                            description: "Turn emails, Slack messages, and Jira tickets into tasks instantly."
                        },
                        {
                            icon: <Zap className="w-6 h-6" />,
                            title: "Command Bar",
                            description: "Navigate everything with your keyboard. Speed is our priority."
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="border border-border p-6 rounded-lg hover:border-primary/50 transition-colors"
                        >
                            <div className="mb-4 p-3 bg-secondary w-fit rounded-md">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
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
        </div>
    );
};

export default LandingPage;
