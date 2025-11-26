import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Tiles } from '@/components/ui/tiles';
import { AuthModal } from '@/components/ui/auth-modal';
import { useAuth } from '@/components/providers/AuthProvider';
import { Features } from '@/components/ui/features-8';



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

            {/* Features Section */}
            <Features />



            <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
        </div>
    );
};

export default LandingPage;
