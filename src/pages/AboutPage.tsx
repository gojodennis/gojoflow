import { motion } from 'framer-motion';

const AboutPage = () => {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                <section>
                    <h1 className="text-4xl font-bold mb-6">OBJECTIVE</h1>
                    <p className="text-xl leading-relaxed text-muted-foreground">
                        We believe that productivity tools have become too complex.
                        They demand too much attention, too many clicks, and too much maintenance.
                    </p>
                    <p className="text-xl leading-relaxed text-muted-foreground mt-4">
                        <span className="text-foreground font-medium">Gojoflow</span> is our answer.
                        A return to simplicity, speed, and keyboard-first interaction.
                        Inspired by the best, refined for the minimalists.
                    </p>
                </section>

                <section className="border-t border-border pt-12">
                    <h2 className="text-2xl font-bold mb-4">OUR MISSION</h2>
                    <ul className="space-y-4 list-disc list-inside text-lg text-muted-foreground">
                        <li>Eliminate context switching.</li>
                        <li>Make every action instantaneous.</li>
                        <li>Design for flow state, not engagement.</li>
                        <li>Respect your attention.</li>
                    </ul>
                </section>

                <section className="border-t border-border pt-12">
                    <h2 className="text-2xl font-bold mb-4">THE TEAM</h2>
                    <p className="text-muted-foreground">
                        Built by a small team of developers who were tired of slow software.
                        We are open source at heart and privacy-focused by design.
                    </p>
                </section>
            </motion.div>
        </div>
    );
};

export default AboutPage;
