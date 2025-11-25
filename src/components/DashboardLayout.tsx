import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './providers/AuthProvider';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { CommandMenu } from './features/CommandMenu';
import { ModeToggle } from './mode-toggle';

const DashboardLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { signOut } = useAuth();
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col font-mono selection:bg-primary selection:text-primary-foreground">
            <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
                    {/* Hidden logo for spacing */}
                    <div className="w-1" />

                    {/* Desktop Navigation - Centered */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Link
                            to="/dashboard"
                            className={cn("transition-colors hover:text-primary/80", location.pathname === "/dashboard" ? "text-primary" : "text-foreground")}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/calendar"
                            className={cn("transition-colors hover:text-primary/80", location.pathname === "/calendar" ? "text-primary" : "text-foreground")}
                        >
                            Calendar
                        </Link>
                        <Link
                            to="/settings"
                            className={cn("transition-colors hover:text-primary/80", location.pathname === "/settings" ? "text-primary" : "text-foreground")}
                        >
                            Settings
                        </Link>
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <Button variant="ghost" size="sm" onClick={signOut} className="hidden md:flex">
                            Sign Out
                        </Button>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden z-50 relative p-2 -mr-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

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
                                        to="/dashboard"
                                        className="p-2 hover:bg-secondary rounded-md transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/calendar"
                                        className="p-2 hover:bg-secondary rounded-md transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Calendar
                                    </Link>
                                    <Link
                                        to="/settings"
                                        className="p-2 hover:bg-secondary rounded-md transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Settings
                                    </Link>
                                    <div className="mt-2">
                                        <Button className="w-full" variant="outline" onClick={signOut}>
                                            Sign Out
                                        </Button>
                                    </div>
                                </nav>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <CommandMenu />
        </div>
    );
};

export default DashboardLayout;
