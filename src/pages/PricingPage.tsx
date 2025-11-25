"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BackgroundBeams from "@/components/ui/background-beams";
import { AuthModal } from "@/components/ui/auth-modal";
import { PricingCard } from "@/components/ui/pricing-card";


const PricingPage = () => {
    const [authOpen, setAuthOpen] = useState(false);

    const features = [
        "Unified Calendar",
        "Task Consolidation",
        "Command Bar Navigation",
        "Focus Mode",
        "Energy-Based Scheduling",
        "Auto-Sort AI",
        "Contribution Tracking",
        "Dark Mode Support",
        "Keyboard Shortcuts",
        "Unlimited Tasks"
    ];

    return (
        <div className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden">
            <BackgroundBeams className="opacity-70" />
            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <h1 className="text-5xl sm:text-7xl font-bold mb-8 tracking-tighter text-foreground">
                        Pricing Plans
                    </h1>
                    <p className="text-xl text-muted-foreground mb-12">
                        All features, completely free. Forever.
                    </p>
                </motion.div>

                <div className="flex justify-center">
                    <PricingCard
                        features={features}
                        buttonText="Start Free"
                        onButtonClick={() => setAuthOpen(true)}
                        isFree={true}
                    />
                </div>
            </div>
            <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
        </div>
    );
};

export default PricingPage;

