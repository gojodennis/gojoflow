export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// Scopes for Calendar and Tasks
const SCOPES = 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/tasks';
const DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
    'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest'
];

let tokenClient: google.accounts.oauth2.TokenClient;
let gapiInited = false;
let gisInited = false;

export const initGoogleClient = async () => {
    return new Promise<void>((resolve, reject) => {
        const checkGapi = () => {
            if (window.gapi) {
                window.gapi.load('client', async () => {
                    try {
                        await window.gapi.client.init({
                            apiKey: GOOGLE_API_KEY, // Optional if only using OAuth for user data
                            discoveryDocs: DISCOVERY_DOCS,
                        });

                        // Restore token from localStorage if it exists and is not expired
                        const storedToken = localStorage.getItem('google_oauth_token');
                        if (storedToken) {
                            try {
                                const { access_token, expires_at } = JSON.parse(storedToken);
                                if (expires_at > Date.now()) {
                                    window.gapi.client.setToken({ access_token });
                                } else {
                                    // Token expired, remove it
                                    localStorage.removeItem('google_oauth_token');
                                }
                            } catch (e) {
                                // Invalid stored token, remove it
                                localStorage.removeItem('google_oauth_token');
                            }
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

            // Store token in localStorage with expiration time
            const expiresAt = Date.now() + (Number(resp.expires_in) * 1000);
            localStorage.setItem('google_oauth_token', JSON.stringify({
                access_token: resp.access_token,
                expires_at: expiresAt
            }));

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
            // Remove token from localStorage
            localStorage.removeItem('google_oauth_token');
        });
    } else {
        // Clear localStorage even if no token in gapi
        localStorage.removeItem('google_oauth_token');
    }
};

export const isSignedInToGoogle = () => {
    return window.gapi && window.gapi.client && window.gapi.client.getToken() !== null;
};
