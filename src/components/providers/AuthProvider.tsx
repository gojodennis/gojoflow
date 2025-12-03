'use client';

import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { AuthModal } from "@/components/ui/auth-modal";
import { initGoogleClient } from "@/lib/google-auth";

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    openAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    signOut: async () => { },
    openAuthModal: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        let mounted = true;

        // 1. Setup auth listener first to catch all events (including initial session from URL)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!mounted) return;

            setSession(session);
            setUser(session?.user ?? null);

            // Sync token on auth state change (e.g. sign in)
            if (session?.provider_token) {
                const expiresAt = Date.now() + (3600 * 1000);
                localStorage.setItem('google_oauth_token', JSON.stringify({
                    access_token: session.provider_token,
                    expires_at: expiresAt
                }));

                // Ensure Google Client is ready
                await initGoogleClient();
                if (window.gapi && window.gapi.client) {
                    window.gapi.client.setToken({ access_token: session.provider_token });
                }
            }

            setLoading(false);
        });

        // 2. Initialize Google Client and check initial session
        const initializeAuth = async () => {
            try {
                // Initialize Google Client first to restore token from localStorage
                await initGoogleClient();

                // We rely on onAuthStateChange for the session, but we can check it here too
                // to ensure we don't hang if the listener doesn't fire immediately (though it should).
                // However, strictly speaking, onAuthStateChange(..., { dispatch: true }) is default?
                // Supabase v2 fires INITIAL_SESSION immediately.

            } catch (error) {
                console.error("Error checking auth session:", error);
                if (mounted) setLoading(false);
            }
        };

        initializeAuth();

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const openAuthModal = () => setIsAuthModalOpen(true);

    return (
        <AuthContext.Provider value={{ session, user, loading, signOut, openAuthModal }}>
            {children}
            <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
