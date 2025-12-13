/**
 * Spotify API Integration
 * Handles authentication, search, and playback using Spotify Web API and SDK
 */

// Constants for token management
const TOKEN_REFRESH_BUFFER_MS = 300000; // 5 minutes in milliseconds
const PLAYER_INIT_DELAY_MS = 1000; // 1 second delay for player initialization

class SpotifyAPI {
    constructor() {
        this.accessToken = null;
        this.refreshToken = null;
        this.tokenExpiry = null;
        this.player = null;
        this.deviceId = null;
        this.currentTrack = null;
        
        // Load saved tokens
        this.loadTokens();
        
        // Check for OAuth callback
        this.handleCallback();
    }

    /**
     * Generate code verifier and challenge for PKCE flow
     */
    generateCodeChallenge() {
        const codeVerifier = this.generateRandomString(128);
        localStorage.setItem('spotify_code_verifier', codeVerifier);
        return codeVerifier;
    }

    generateRandomString(length) {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }

    async sha256(plain) {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return window.crypto.subtle.digest('SHA-256', data);
    }

    base64encode(input) {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }

    /**
     * Initiate Spotify login with PKCE
     */
    async login() {
        if (!isSpotifyConfigured()) {
            alert('Spotify API is not configured. Please add your Client ID to spotify-config.js');
            return false;
        }

        const codeVerifier = this.generateCodeChallenge();
        const hashed = await this.sha256(codeVerifier);
        const codeChallenge = this.base64encode(hashed);

        const params = new URLSearchParams({
            client_id: SPOTIFY_CLIENT_ID,
            response_type: 'code',
            redirect_uri: SPOTIFY_REDIRECT_URI,
            scope: SPOTIFY_SCOPES,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            show_dialog: 'false'
        });

        // Redirect to Spotify authorization
        window.location.href = `${SPOTIFY_AUTH_ENDPOINT}?${params.toString()}`;
        return true;
    }

    /**
     * Handle OAuth callback
     */
    async handleCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
            console.error('Spotify auth error:', error);
            alert('Failed to authenticate with Spotify: ' + error);
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
        }

        if (code) {
            // Exchange code for tokens
            await this.exchangeCodeForToken(code);
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    /**
     * Exchange authorization code for access token
     */
    async exchangeCodeForToken(code) {
        const codeVerifier = localStorage.getItem('spotify_code_verifier');
        
        if (!codeVerifier) {
            console.error('Code verifier not found');
            return;
        }

        const payload = {
            client_id: SPOTIFY_CLIENT_ID,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: SPOTIFY_REDIRECT_URI,
            code_verifier: codeVerifier
        };

        try {
            const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(payload)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error_description || 'Failed to get access token');
            }

            const data = await response.json();
            this.setTokens(data.access_token, data.refresh_token, data.expires_in);
            
            // Clean up code verifier
            localStorage.removeItem('spotify_code_verifier');
            
            // Initialize player after getting token
            await this.initializePlayer();
            
            return true;
        } catch (error) {
            console.error('Token exchange error:', error);
            alert('Failed to complete Spotify login: ' + error.message);
            return false;
        }
    }

    /**
     * Save tokens to localStorage
     */
    setTokens(accessToken, refreshToken, expiresIn) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenExpiry = Date.now() + (expiresIn * 1000);
        
        localStorage.setItem('spotify_access_token', accessToken);
        if (refreshToken) {
            localStorage.setItem('spotify_refresh_token', refreshToken);
        }
        localStorage.setItem('spotify_token_expiry', this.tokenExpiry.toString());
        localStorage.setItem('spotify_authenticated', 'true');
    }

    /**
     * Load tokens from localStorage
     */
    loadTokens() {
        this.accessToken = localStorage.getItem('spotify_access_token');
        this.refreshToken = localStorage.getItem('spotify_refresh_token');
        const expiry = localStorage.getItem('spotify_token_expiry');
        this.tokenExpiry = expiry ? parseInt(expiry) : null;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        if (!this.accessToken || !this.tokenExpiry) {
            return false;
        }
        
        // Check if token is expired (with 5 minute buffer)
        if (Date.now() >= this.tokenExpiry - TOKEN_REFRESH_BUFFER_MS) {
            return false;
        }
        
        return true;
    }

    /**
     * Refresh access token
     */
    async refreshAccessToken() {
        if (!this.refreshToken) {
            return false;
        }

        const payload = {
            client_id: SPOTIFY_CLIENT_ID,
            grant_type: 'refresh_token',
            refresh_token: this.refreshToken
        };

        try {
            const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }

            const data = await response.json();
            this.setTokens(data.access_token, this.refreshToken, data.expires_in);
            return true;
        } catch (error) {
            console.error('Token refresh error:', error);
            this.logout();
            return false;
        }
    }

    /**
     * Logout and clear tokens
     */
    logout() {
        this.accessToken = null;
        this.refreshToken = null;
        this.tokenExpiry = null;
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_refresh_token');
        localStorage.removeItem('spotify_token_expiry');
        localStorage.removeItem('spotify_authenticated');
        
        if (this.player) {
            this.player.disconnect();
            this.player = null;
        }
    }

    /**
     * Make authenticated API request
     */
    async apiRequest(endpoint, options = {}) {
        // Ensure we have a valid token
        if (!this.isAuthenticated()) {
            if (this.refreshToken) {
                await this.refreshAccessToken();
            } else {
                throw new Error('Not authenticated');
            }
        }

        const url = endpoint.startsWith('http') ? endpoint : `${SPOTIFY_API_BASE}${endpoint}`;
        
        const response = await fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        if (response.status === 401) {
            // Token expired, try to refresh
            if (await this.refreshAccessToken()) {
                // Retry request with new token
                return this.apiRequest(endpoint, options);
            } else {
                throw new Error('Authentication expired. Please log in again.');
            }
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `API request failed: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Search for tracks
     */
    async searchTracks(query, limit = 20) {
        if (!query || query.trim() === '') {
            return [];
        }

        try {
            const params = new URLSearchParams({
                q: query,
                type: 'track',
                limit: limit.toString()
            });

            const data = await this.apiRequest(`/search?${params.toString()}`);
            
            return data.tracks.items.map(track => ({
                id: track.id,
                title: track.name,
                artist: track.artists.map(a => a.name).join(', '),
                album: track.album.name,
                duration: this.formatDuration(track.duration_ms),
                uri: track.uri,
                imageUrl: track.album.images[0]?.url,
                previewUrl: track.preview_url
            }));
        } catch (error) {
            console.error('Search error:', error);
            throw error;
        }
    }

    /**
     * Format duration from milliseconds to MM:SS
     */
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    /**
     * Initialize Spotify Web Playback SDK
     */
    async initializePlayer() {
        return new Promise((resolve, reject) => {
            // Load Spotify Web Playback SDK if not already loaded
            if (!window.Spotify) {
                const script = document.createElement('script');
                script.src = 'https://sdk.scdn.co/spotify-player.js';
                script.async = true;
                document.body.appendChild(script);

                window.onSpotifyWebPlaybackSDKReady = () => {
                    this.createPlayer().then(resolve).catch(reject);
                };
            } else if (!this.player) {
                this.createPlayer().then(resolve).catch(reject);
            } else {
                resolve();
            }
        });
    }

    /**
     * Create Spotify player instance
     */
    async createPlayer() {
        const player = new window.Spotify.Player({
            name: 'Accessible Speech Board',
            getOAuthToken: cb => {
                if (this.isAuthenticated()) {
                    cb(this.accessToken);
                } else if (this.refreshToken) {
                    this.refreshAccessToken().then(() => {
                        cb(this.accessToken);
                    });
                }
            },
            volume: 0.5
        });

        // Error handling
        player.addListener('initialization_error', ({ message }) => {
            console.error('Player initialization error:', message);
        });
        player.addListener('authentication_error', ({ message }) => {
            console.error('Player authentication error:', message);
            this.logout();
        });
        player.addListener('account_error', ({ message }) => {
            console.error('Player account error:', message);
            alert('Spotify Premium required for playback. Free accounts can only preview tracks.');
        });
        player.addListener('playback_error', ({ message }) => {
            console.error('Playback error:', message);
        });

        // Ready
        player.addListener('ready', ({ device_id }) => {
            console.log('Spotify player ready with device ID:', device_id);
            this.deviceId = device_id;
        });

        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID gone offline:', device_id);
        });

        // Player state changed
        player.addListener('player_state_changed', state => {
            if (state) {
                this.currentTrack = {
                    title: state.track_window.current_track.name,
                    artist: state.track_window.current_track.artists.map(a => a.name).join(', '),
                    album: state.track_window.current_track.album.name,
                    duration: this.formatDuration(state.track_window.current_track.duration_ms),
                    isPlaying: !state.paused,
                    position: state.position,
                    uri: state.track_window.current_track.uri
                };
            }
        });

        // Connect to the player
        const connected = await player.connect();
        
        if (!connected) {
            throw new Error('Failed to connect to Spotify player');
        }

        this.player = player;
        return player;
    }

    /**
     * Play a track
     */
    async playTrack(trackUri) {
        if (!this.deviceId) {
            // Try to initialize player if not ready
            if (!this.player) {
                await this.initializePlayer();
            }
            // Wait a bit for device to be ready
            await new Promise(resolve => setTimeout(resolve, PLAYER_INIT_DELAY_MS));
        }

        if (!this.deviceId) {
            throw new Error('Spotify player not ready. Please wait and try again.');
        }

        try {
            await this.apiRequest(`/me/player/play?device_id=${this.deviceId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    uris: [trackUri]
                })
            });
            return true;
        } catch (error) {
            console.error('Play track error:', error);
            throw error;
        }
    }

    /**
     * Pause playback
     */
    async pause() {
        if (this.player) {
            await this.player.pause();
        }
    }

    /**
     * Resume playback
     */
    async resume() {
        if (this.player) {
            await this.player.resume();
        }
    }

    /**
     * Skip to next track
     */
    async nextTrack() {
        if (this.player) {
            await this.player.nextTrack();
        }
    }

    /**
     * Skip to previous track
     */
    async previousTrack() {
        if (this.player) {
            await this.player.previousTrack();
        }
    }

    /**
     * Get current playback state
     */
    async getCurrentState() {
        if (this.player) {
            return await this.player.getCurrentState();
        }
        return null;
    }
}

// Create global instance
window.spotifyAPI = new SpotifyAPI();
