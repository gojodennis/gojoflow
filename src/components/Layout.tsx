import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './providers/AuthProvider';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { AuthModal } from './ui/auth-modal';
import { CommandMenu } from './features/CommandMenu';
import { ModeToggle } from './mode-toggle';

const Layout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user } = useAuth();
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col font-mono selection:bg-primary selection:text-primary-foreground">
            <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
                    <Link to="/" className="text-xl font-bold tracking-tighter z-50 relative" onClick={() => setIsMobileMenuOpen(false)}>
                        GOJOFLOW
                    </Link>

                    {/* Desktop Navigation - Centered */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Link
                            to="/"
                            className={cn("transition-colors hover:text-primary/80", location.pathname === "/" ? "text-primary" : "text-foreground")}
                        >
                            Product
                        </Link>
                        <Link
                            to="/about"
                            className={cn("transition-colors hover:text-primary/80", location.pathname === "/about" ? "text-primary" : "text-foreground")}
                        >
                            Objective
                        </Link>
                        <Link
                            to="/pricing"
                            className={cn("transition-colors hover:text-primary/80", location.pathname === "/pricing" ? "text-primary" : "text-foreground")}
                        >
                            Pricing
                        </Link>
                        {user && (
                            <>
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
                            </>
                        )}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        {user ? (
                            <Link to="/dashboard">
                                <Button variant="default" size="sm" className="hidden md:flex">
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <AuthModal>
                                <Button size="sm" className="hidden md:flex">Get Started</Button>
                            </AuthModal>
                        )}

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
                                    {user && (
                                        <>
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
                                        </>
                                    )}
                                    {!user && (
                                        <div className="mt-2">
                                            <AuthModal>
                                                <Button className="w-full">Get Started</Button>
                                            </AuthModal>
                                        </div>
                                    )}
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
                    <p>&copy; 2024 Gojoflow. made with <Heart className="w-4 h-4 text-muted-foreground fill-current inline mx-1" /> by hrishikesh</p>
                    <div className="flex gap-6">
                        <a
                            href="https://x.com/goj0dennis"
                            target="_blank"
                            rel="noreferrer noopener"
                            className="hover:text-foreground transition-colors"
                        >
                            Twitter
                        </a>
                        <a
                            href="https://github.com/gojodennis"
                            target="_blank"
                            rel="noreferrer noopener"
                            className="hover:text-foreground transition-colors"
                        >
                            GitHub
                        </a>
                    </div>
                </div>
            </footer>
            <CommandMenu />
        </div>
    );
};

export default Layout;
