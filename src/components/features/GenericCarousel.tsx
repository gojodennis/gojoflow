import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenericCarouselProps {
    items: {
        title: string;
        content: React.ReactNode;
    }[];
    className?: string;
}

export function GenericCarousel({ items, className }: GenericCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % items.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    return (
        <div className={cn("flex flex-col h-full", className)}>
            {/* Carousel Header / Navigation */}
            <div className="flex items-center justify-between mb-2 shrink-0">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={prevSlide}
                    title="Previous"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="text-sm font-medium text-muted-foreground select-none">
                    {items[activeIndex].title}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={nextSlide}
                    title="Next"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative border rounded-xl bg-card/50 shadow-sm border-border/50">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 w-full h-full"
                    >
                        {items[activeIndex].content}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-1.5 mt-2 shrink-0">
                {items.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all",
                            idx === activeIndex
                                ? "bg-primary w-3"
                                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
