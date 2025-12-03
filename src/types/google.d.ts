declare namespace google {
    namespace accounts {
        namespace oauth2 {
            function initTokenClient(config: TokenClientConfig): TokenClient;
            function revoke(accessToken: string, callback: () => void): void;
            function hasGrantedAllScopes(token: TokenResponse | gapi.client.GoogleApiToken, ...scopes: string[]): boolean;

            interface TokenClientConfig {
                client_id: string;
                scope: string;
                callback: (response: TokenResponse) => void;
            }

            interface TokenClient {
                callback: (response: TokenResponse) => void;
                requestAccessToken(options?: { prompt?: string }): void;
            }

            interface TokenResponse {
                access_token: string;
                error?: string;
                expires_in: string;
                prompt: string;
                scope: string;
                token_type: string;
            }
        }
    }
}

declare namespace gapi {
    function load(libraries: string, callback: () => void): void;
    namespace client {
        function init(config: { apiKey?: string; discoveryDocs?: string[]; clientId?: string; scope?: string }): Promise<void>;
        function getToken(): GoogleApiToken | null;
        function setToken(token: GoogleApiToken | null): void;

        interface GoogleApiToken {
            access_token: string;
        }

        namespace calendar {
            const events: EventsResource;
            interface EventsResource {
                list(request: {
                    calendarId: string;
                    timeMin?: string;
                    timeMax?: string;
                    showDeleted?: boolean;
                    singleEvents?: boolean;
                    orderBy?: string;
                }): Promise<any>;
                insert(request: {
                    calendarId: string;
                    resource: any;
                }): Promise<any>;
            }
        }

        namespace tasks {
            const tasks: TasksResource;
            const tasklists: TasklistsResource;

            interface TasksResource {
                list(request: {
                    tasklist: string;
                    showCompleted?: boolean;
                    showHidden?: boolean;
                }): Promise<any>;
                insert(request: {
                    tasklist: string;
                    resource: any;
                }): Promise<any>;
                update(request: {
                    tasklist: string;
                    task: string;
                    id: string;
                    resource: any;
                }): Promise<any>;
                delete(request: {
                    tasklist: string;
                    task: string;
                }): Promise<any>;
            }

            interface TasklistsResource {
                list(request?: {
                    maxResults?: number;
                    pageToken?: string;
                }): Promise<any>;
            }
        }
    }
}

interface Window {
    google?: typeof google;
    gapi?: typeof gapi;
}
