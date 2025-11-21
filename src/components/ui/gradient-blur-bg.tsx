import { cn } from "@/lib/utils";

interface GradientBlurBgProps {
    className?: string;
}

export const GradientBlurBg = ({ className }: GradientBlurBgProps) => {
    return (
        <div className={cn("absolute inset-0 w-full h-full bg-[#f9fafb] -z-10 overflow-hidden", className)}>
            {/* Diagonal Fade Grid Background - Top Right */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
            linear-gradient(to right, #d1d5db 1px, transparent 1px),
            linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
          `,
                    backgroundSize: "32px 32px",
                    WebkitMaskImage:
                        "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
                    maskImage:
                        "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
                }}
            />
        </div>
    );
};
