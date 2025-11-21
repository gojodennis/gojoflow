"use client";

import { motion } from "framer-motion";
import BackgroundBeams from "@/components/ui/background-beams";
import { Input } from "@/components/ui/input";


const PricingPage = () => {
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
                    <Input
                        type="email"
                        placeholder="Enter your email for a quote"
                        className="w-full max-w-md mx-auto bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-500 focus-visible:ring-neutral-900"
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default PricingPage;
