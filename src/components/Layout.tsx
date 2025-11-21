
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col font-mono selection:bg-primary selection:text-primary-foreground">
            <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold tracking-tighter">
                        GOJOFLOW
                    </Link>
                    <nav className="flex gap-6 text-sm">
                        <Link to="/" className="hover:underline underline-offset-4">Product</Link>
                        <Link to="/about" className="hover:underline underline-offset-4">Objective</Link>
                        <Link to="/pricing" className="hover:underline underline-offset-4">Pricing</Link>
                        <Link to="/login" className="bg-primary text-primary-foreground px-4 py-2 rounded-sm hover:opacity-90 transition-opacity">
                            Get Started
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="border-t border-border py-8 mt-20">
                <div className="container mx-auto px-4 flex justify-between items-center text-sm text-muted-foreground">
                    <p>&copy; 2024 Gojoflow. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-foreground">Twitter</a>
                        <a href="#" className="hover:text-foreground">GitHub</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
