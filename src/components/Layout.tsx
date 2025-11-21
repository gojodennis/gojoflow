
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col font-mono selection:bg-primary selection:text-primary-foreground">
            <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold tracking-tighter z-50 relative" onClick={() => setIsMobileMenuOpen(false)}>
                        GOJOFLOW
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <Link to="/" className="hover:text-primary/80 transition-colors">Product</Link>
                        <Link to="/about" className="hover:text-primary/80 transition-colors">Objective</Link>
                        <Link to="/pricing" className="hover:text-primary/80 transition-colors">Pricing</Link>
                        <Link to="/login" className="bg-primary text-primary-foreground px-4 py-2 rounded-sm hover:opacity-90 transition-opacity">
                            Get Started
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden z-50 relative p-2 -mr-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* Mobile Navigation Overlay */}
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="absolute inset-x-0 top-0 bg-background border-b border-border p-4 pt-20 md:hidden shadow-lg"
                            >
                                <nav className="flex flex-col gap-4 text-lg font-medium">
                                    <Link
                                        to="/"
                                        className="p-2 hover:bg-secondary rounded-md transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Product
                                    </Link>
                                    <Link
                                        to="/about"
                                        className="p-2 hover:bg-secondary rounded-md transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Objective
                                    </Link>
                                    <Link
                                        to="/pricing"
                                        className="p-2 hover:bg-secondary rounded-md transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Pricing
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="bg-primary text-primary-foreground p-3 rounded-md text-center mt-2 hover:opacity-90 transition-opacity"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </nav>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="border-t border-border py-8 mt-20">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>&copy; 2024 Gojoflow. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
                        <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
