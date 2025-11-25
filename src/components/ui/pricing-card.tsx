import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface PricingCardProps {
    price?: string;
    period?: string;
    features: string[];
    buttonText?: string;
    onButtonClick?: () => void;
    isFree?: boolean;
}

export const PricingCard = ({
    price = "0",
    period = "/mo",
    features,
    buttonText = "Get Started",
    onButtonClick,
    isFree = true
}: PricingCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-2xl max-w-2xl w-full"
        >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10">
                {/* Price Section */}
                <div className="mb-8 text-center">
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                        <span className="text-6xl font-bold tracking-tighter">
                            {isFree ? 'Free' : `$${price}`}
                        </span>
                        {!isFree && <span className="text-muted-foreground text-lg">{period}</span>}
                    </div>
                    {isFree && (
                        <p className="text-sm text-muted-foreground">Forever free, no credit card required</p>
                    )}
                </div>

                {/* Features List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                                <Check className="w-3 h-3 text-primary" strokeWidth={3} />
                            </div>
                            <span className="text-sm font-medium text-foreground">{feature}</span>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <button
                    onClick={onButtonClick}
                    className="w-full bg-foreground text-background hover:opacity-90 transition-all py-3 px-6 rounded-lg font-medium text-base"
                >
                    {buttonText}
                </button>
            </div>
        </motion.div>
    );
};
