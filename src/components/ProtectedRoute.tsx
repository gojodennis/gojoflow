import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/providers/AuthProvider';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const location = useLocation();
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        // Wait for auth to finish loading before making redirect decision
        if (!loading && !user) {
            setShouldRedirect(true);
        } else if (!loading && user) {
            setShouldRedirect(false);
        }
    }, [loading, user]);

    // Show nothing while loading to prevent flash
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    // Redirect to landing page if not authenticated
    if (shouldRedirect) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Render protected content if authenticated
    return <>{children}</>;
}
