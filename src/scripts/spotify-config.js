/**
 * Spotify API Configuration
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Go to https://developer.spotify.com/dashboard
 * 2. Log in with your Spotify account (or create one)
 * 3. Click "Create app"
 * 4. Fill in the app details:
 *    - App name: "Accessible Speech Board" (or your preferred name)
 *    - App description: "Music integration for accessible speech board"
 *    - Redirect URI: Add the following URIs (one per line):
 *      - http://localhost:8080
 *      - http://127.0.0.1:8080
 *      - YOUR_PRODUCTION_URL (if deploying)
 *    - APIs used: Check "Web Playback SDK" and "Web API"
 * 5. Agree to terms and click "Save"
 * 6. On your app's dashboard, click "Settings"
 * 7. Copy your "Client ID"
 * 8. Paste it below in the SPOTIFY_CLIENT_ID constant
 * 
 * NOTE: For security, in production you should:
 * - Use environment variables for Client ID
 * - Store credentials server-side
 * - Never commit real credentials to git
 * - Use HTTP-only cookies instead of localStorage for tokens
 * - Implement proper CSRF protection
 * - Use HTTPS only
 * 
 * NOTE: About port numbers in redirect URIs:
 * - The default port 8080 is commonly used for development
 * - If your server uses a different port (e.g., 3000, 5000), update the redirect URI accordingly
 * - Example: http://localhost:3000 if using npm/node server on port 3000
 */

// Replace this with your Spotify Client ID from the dashboard
const SPOTIFY_CLIENT_ID = 'YOUR_CLIENT_ID_HERE';

// Redirect URI must match one registered in your Spotify app settings
const SPOTIFY_REDIRECT_URI = window.location.origin + window.location.pathname;

// Scopes define what access your app needs
const SPOTIFY_SCOPES = [
    'streaming',                          // Play music through Web Playback SDK
    'user-read-email',                    // Read user's email
    'user-read-private',                  // Read user profile info
    'user-library-read',                  // Read user's saved tracks
    'user-library-modify',                // Save tracks to user's library
    'user-read-playback-state',          // Read playback state
    'user-modify-playback-state',        // Control playback
    'playlist-read-private',             // Read private playlists
    'playlist-read-collaborative',       // Read collaborative playlists
    'playlist-modify-public',            // Modify public playlists
    'playlist-modify-private'            // Modify private playlists
].join(' ');

// Spotify API endpoints
const SPOTIFY_AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

/**
 * Check if configuration is valid
 */
function isSpotifyConfigured() {
    return SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_ID !== 'YOUR_CLIENT_ID_HERE';
}

/**
 * Get configuration error message
 */
function getConfigErrorMessage() {
    return `
        <div style="padding: 20px; background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; margin: 20px;">
            <h3 style="color: #856404; margin-top: 0;">⚠️ Spotify API Not Configured</h3>
            <p style="color: #856404; line-height: 1.6;">
                To use the Spotify integration, you need to set up API credentials:
            </p>
            <ol style="color: #856404; text-align: left; line-height: 1.8; padding-left: 20px;">
                <li>Go to <a href="https://developer.spotify.com/dashboard" target="_blank" style="color: #1DB954; font-weight: bold;">Spotify Developer Dashboard</a></li>
                <li>Create a new app and copy your Client ID</li>
                <li>Add redirect URI: <code style="background: #fff; padding: 2px 6px; border-radius: 3px;">${SPOTIFY_REDIRECT_URI}</code></li>
                <li>Edit <code style="background: #fff; padding: 2px 6px; border-radius: 3px;">src/scripts/spotify-config.js</code> and paste your Client ID</li>
                <li>Reload this page</li>
            </ol>
            <p style="color: #856404; margin-bottom: 0;">
                See <code style="background: #fff; padding: 2px 6px; border-radius: 3px;">spotify-config.js</code> for detailed instructions.
            </p>
        </div>
    `;
}
