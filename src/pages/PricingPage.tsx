"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import BackgroundBeams from "@/components/ui/background-beams";
import { AuthModal } from "@/components/ui/auth-modal";


const PricingPage = () => {
    const [authOpen, setAuthOpen] = useState(false);

    return (
        <div className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden">
            <BackgroundBeams className="opacity-70" />
            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-5xl sm:text-7xl font-bold mb-8 tracking-tighter text-neutral-900">
                        Pricing Plans
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        Choose the plan that fits your workflow. All plans include unlimited access to core features.
                    </p>
                    <div className="flex justify-center">
                        <button
                            onClick={() => setAuthOpen(true)}
                            className="bg-primary text-primary-foreground px-8 py-4 rounded-md text-lg font-medium hover:opacity-90 transition-all flex items-center gap-2 group"
                        >
                            Sign Up <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>
            </div>
            <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
        </div>
    );
};

export default PricingPage;
