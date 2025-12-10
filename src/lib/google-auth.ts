import { supabase } from './supabase';

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// Scopes for Calendar and Tasks
const SCOPES = 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/tasks';
const DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
    'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest'
];

const GOOGLE_TOKEN_KEY = 'google_oauth_token';

interface StoredGoogleToken {
    access_token: string;
    expires_at: number;
    refresh_token?: string;
}

let tokenClient: google.accounts.oauth2.TokenClient;
let gapiInited = false;
let gisInited = false;

/**
 * Stores the Google OAuth token in localStorage
 */
export const storeGoogleToken = (accessToken: string, expiresIn: number, refreshToken?: string) => {
    const expiresAt = Date.now() + (expiresIn * 1000);
    const tokenData: StoredGoogleToken = {
        access_token: accessToken,
        expires_at: expiresAt,
    };

    // Preserve existing refresh token if not provided
    if (refreshToken) {
        tokenData.refresh_token = refreshToken;
    } else {
        const existingToken = getStoredGoogleToken();
        if (existingToken?.refresh_token) {
            tokenData.refresh_token = existingToken.refresh_token;
        }
    }

    localStorage.setItem(GOOGLE_TOKEN_KEY, JSON.stringify(tokenData));
};

/**
 * Gets the stored Google OAuth token from localStorage
 */
export const getStoredGoogleToken = (): StoredGoogleToken | null => {
    const storedToken = localStorage.getItem(GOOGLE_TOKEN_KEY);
    if (!storedToken) return null;

    try {
        return JSON.parse(storedToken) as StoredGoogleToken;
    } catch {
        return null;
    }
};

/**
 * Clears the stored Google OAuth token
 */
export const clearStoredGoogleToken = () => {
    localStorage.removeItem(GOOGLE_TOKEN_KEY);
};

/**
 * Attempts to refresh the Google access token using Supabase session refresh
 * Returns true if refresh was successful, false otherwise
 */
export const refreshGoogleToken = async (): Promise<boolean> => {
    try {
        // Use Supabase to refresh the session - this can provide new OAuth tokens
        const { data, error } = await supabase.auth.refreshSession();

        if (error || !data.session) {
            console.log('Failed to refresh Supabase session:', error?.message);
            return false;
        }

        // Check if we got a new provider token
        if (data.session.provider_token) {
            // Store the new access token (typically 1 hour expiry)
            storeGoogleToken(
                data.session.provider_token,
                3600, // 1 hour default
                data.session.provider_refresh_token || undefined
            );

            // Set the token in gapi client
            if (window.gapi?.client) {
                window.gapi.client.setToken({ access_token: data.session.provider_token });
            }

            console.log('Successfully refreshed Google token via Supabase');
            return true;
        }

        console.log('No provider token in refreshed session');
        return false;
    } catch (err) {
        console.error('Error refreshing Google token:', err);
        return false;
    }
};

/**
 * Checks if the stored token is valid and not expired
 * If expired, attempts to refresh it
 * Returns true if we have a valid token, false otherwise
 */
export const ensureValidGoogleToken = async (): Promise<boolean> => {
    const storedToken = getStoredGoogleToken();

    if (!storedToken) {
        return false;
    }

    // Check if token is still valid (with 5 minute buffer)
    const bufferMs = 5 * 60 * 1000;
    if (storedToken.expires_at > Date.now() + bufferMs) {
        // Token is still valid, ensure it's set in gapi
        if (window.gapi?.client) {
            window.gapi.client.setToken({ access_token: storedToken.access_token });
        }
        return true;
    }

    // Token expired or expiring soon, try to refresh
    console.log('Google token expired or expiring soon, attempting refresh...');
    return await refreshGoogleToken();
};

export const initGoogleClient = async () => {
    return new Promise<void>((resolve, reject) => {
        const checkGapi = () => {
            if (window.gapi) {
                window.gapi.load('client', async () => {
                    try {
                        await window.gapi.client.init({
                            apiKey: GOOGLE_API_KEY,
                            discoveryDocs: DISCOVERY_DOCS,
                        });

                        // Try to restore/refresh token
                        const hasValidToken = await ensureValidGoogleToken();
                        if (!hasValidToken) {
                            // No valid token, clear any stale data
                            clearStoredGoogleToken();
                        }

                        gapiInited = true;
                        if (gisInited) resolve();
                    } catch (err) {
                        reject(err);
                    }
                });
            } else {
                setTimeout(checkGapi, 100);
            }
        };

        const checkGis = () => {
            if (window.google) {
                tokenClient = window.google.accounts.oauth2.initTokenClient({
                    client_id: GOOGLE_CLIENT_ID,
                    scope: SCOPES,
                    callback: (_resp: google.accounts.oauth2.TokenResponse) => { }, // defined later
                });
                gisInited = true;
                if (gapiInited) resolve();
            } else {
                setTimeout(checkGis, 100);
            }
        };

        checkGapi();
        checkGis();
    });
};

export const signInToGoogle = () => {
    return new Promise<void>((resolve, reject) => {
        if (!tokenClient) return reject('Google Client not initialized');

        tokenClient.callback = async (resp: google.accounts.oauth2.TokenResponse) => {
            if (resp.error !== undefined) {
                reject(resp);
                return;
            }

            // Store token using the helper function
            storeGoogleToken(resp.access_token, Number(resp.expires_in));

            // Set token in gapi client
            window.gapi.client.setToken({ access_token: resp.access_token });

            resolve();
        };

        const token = window.gapi.client.getToken();
        if (token === null) {
            // Prompt the user to select a Google Account and ask for consent to share their data
            // when establishing a new session.
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            // Check if we have all the needed scopes
            const hasScopes = window.google.accounts.oauth2.hasGrantedAllScopes(
                token,
                SCOPES
            );

            if (!hasScopes) {
                // Force consent if we don't have all scopes
                tokenClient.requestAccessToken({ prompt: 'consent' });
            } else {
                // Skip display of account chooser and consent dialog for an existing session.
                tokenClient.requestAccessToken({ prompt: '' });
            }
        }
    });
};

export const signOutFromGoogle = () => {
    const token = window.gapi.client.getToken();
    if (token !== null) {
        window.google.accounts.oauth2.revoke(token.access_token, () => {
            window.gapi.client.setToken(null);
            clearStoredGoogleToken();
        });
    } else {
        clearStoredGoogleToken();
    }
};

export const isSignedInToGoogle = () => {
    return window.gapi && window.gapi.client && window.gapi.client.getToken() !== null;
};
