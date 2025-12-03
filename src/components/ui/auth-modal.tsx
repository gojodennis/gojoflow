import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalTrigger,
} from '@/components/ui/modal';
import { Link } from 'react-router-dom';
import { Button } from './button';
import { Input } from './input';
import { AtSignIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

type AuthModalProps = Omit<React.ComponentProps<typeof Modal>, 'children'> & {
    children?: React.ReactNode;
};

export function AuthModal({ children, ...props }: AuthModalProps) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [isSignUp, setIsSignUp] = React.useState(false);
    const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);
    const navigate = useNavigate();

    const handleAuth = async () => {
        try {
            setLoading(true);
            setMessage(null);

            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/dashboard`,
                    },
                });
                if (error) throw error;
                setMessage({ type: 'success', text: 'Check your email for the confirmation link!' });
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                props.onOpenChange?.(false);
                navigate('/dashboard');
            }
        } catch (error: any) {
            console.error('Supabase Auth Error:', error);
            setMessage({ type: 'error', text: error.message || 'An error occurred' });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        console.log('Starting Google Sign In...');
        try {
            setLoading(true);
            setMessage(null);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`,
                    scopes: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/tasks',
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });

            if (error) throw error;
        } catch (error: any) {
            console.error('Supabase Auth Error:', error);
            alert(`Sign In Error: ${error.message || JSON.stringify(error)}`);
            setMessage({ type: 'error', text: error.message || 'An error occurred' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal {...props}>
            {children && (
                <ModalTrigger asChild>
                    {children}
                </ModalTrigger>
            )}
            <ModalContent>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <ModalHeader>
                        <ModalTitle>{isSignUp ? 'Create an Account' : 'Welcome Back'}</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <Button
                            type="button"
                            variant="outline"
                            className="animate-in fade-in w-full duration-300"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                        >
                            <GoogleIcon className="w-4 h-4 me-2" />
                            <span>Continue With Google</span>
                        </Button>

                        <div className="relative my-5">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background text-muted-foreground px-4 text-lg">
                                    OR
                                </span>
                            </div>
                        </div>
                        <p className="text-muted-foreground mb-2 text-start text-xs">
                            {isSignUp ? 'Enter your email to create an account' : 'Enter your email to sign in'}
                        </p>

                        {message && (
                            <div className={`p-3 rounded-md text-sm mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative h-max">
                                <Input
                                    placeholder="your.email@example.com"
                                    className="peer ps-9"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                                    <AtSignIcon className="size-4" aria-hidden="true" />
                                </div>
                            </div>

                            <div className="relative h-max">
                                <Input
                                    placeholder="Password"
                                    className="peer ps-9"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="animate-in fade-in mt-4 w-full duration-300"
                            onClick={handleAuth}
                            disabled={loading}
                        >
                            <span>{loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}</span>
                        </Button>

                        <div className="mt-4 text-center text-xs">
                            <span className="text-muted-foreground">
                                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-foreground hover:underline font-medium"
                            >
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </div>
                    </ModalBody>
                    <div className="p-4">
                        <p className="text-muted-foreground text-center text-xs">
                            By clicking Continue, you agree to our{' '}
                            <Link className="text-foreground hover:underline" to="/policy">
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </motion.div>
            </ModalContent>
        </Modal>
    );
}

const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        {...props}
    >
        <g>
            <path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
        </g>
    </svg>
);
