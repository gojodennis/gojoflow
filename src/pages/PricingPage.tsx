"use client";

import BackgroundBeams from "@/components/ui/background-beams";
import { Input } from "@/components/ui/input";


const PricingPage = () => {
    return (
        <div className="relative min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center overflow-hidden">
            <BackgroundBeams className="opacity-70" />
            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center max-w-2xl">
                <h1 className="text-5xl sm:text-7xl font-bold mb-8 tracking-tighter">
                    Pricing Plans
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Choose the plan that fits your workflow. All plans include unlimited access to core features.
                </p>
                <Input
                    type="email"
                    placeholder="Enter your email for a quote"
                    className="w-full max-w-md mx-auto"
                />
            </div>
        </div>
    );
};

export default PricingPage;
