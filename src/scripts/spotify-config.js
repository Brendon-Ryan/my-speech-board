/**
 * Spotify API Configuration
 * 
 * ENVIRONMENT-SPECIFIC SETUP:
 * 
 * LOCAL DEVELOPMENT:
 * 1. Copy spotify-config.local.js.example to spotify-config.local.js
 * 2. Add your Spotify Client ID to spotify-config.local.js
 * 3. This file is gitignored and won't be committed
 * 
 * PRODUCTION (Azure):
 * - Client ID will be fetched from Azure Key Vault
 * - Set Key Vault name in environment: AZURE_KEYVAULT_NAME
 * - Store Client ID in Key Vault with key: SPOTIFY-CLIENT-ID
 * 
 * SETUP INSTRUCTIONS FOR GETTING CLIENT ID:
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
 * 8. For LOCAL: Add to spotify-config.local.js
 *    For PRODUCTION: Store in Azure Key Vault
 * 
 * NOTE: For security in production:
 * - Use Azure Key Vault for credentials
 * - Use HTTP-only cookies instead of localStorage for tokens
 * - Implement proper CSRF protection
 * - Use HTTPS only
 * - Add Content Security Policy headers
 * 
 * NOTE: About port numbers in redirect URIs:
 * - The default port 8080 is commonly used for development
 * - If your server uses a different port (e.g., 3000, 5000), update the redirect URI accordingly
 * - Example: http://localhost:3000 if using npm/node server on port 3000
 */

// Configuration will be loaded dynamically
let SPOTIFY_CLIENT_ID = null;

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
 * Load Spotify Client ID from appropriate source
 * - Local: loads from spotify-config.local.js
 * - Production: loads from Azure Key Vault via API endpoint
 */
async function loadSpotifyConfig() {
    // Check if running in production (Azure)
    const isProduction = window.location.hostname !== 'localhost' && 
                         window.location.hostname !== '127.0.0.1';
    
    if (isProduction) {
        // Production: Load from Azure Key Vault via API
        try {
            const response = await fetch('/api/config/spotify');
            if (response.ok) {
                const config = await response.json();
                SPOTIFY_CLIENT_ID = config.clientId;
                console.log('Spotify configuration loaded from Azure Key Vault');
            } else {
                console.error('Failed to load Spotify config from Key Vault:', response.status);
            }
        } catch (error) {
            console.error('Error loading Spotify config:', error);
        }
    } else {
        // Local development: Try to load from local config file
        try {
            // Attempt to load spotify-config.local.js if it exists
            if (window.SPOTIFY_LOCAL_CONFIG && window.SPOTIFY_LOCAL_CONFIG.clientId) {
                SPOTIFY_CLIENT_ID = window.SPOTIFY_LOCAL_CONFIG.clientId;
                console.log('Spotify configuration loaded from local config file');
            } else {
                console.warn('Local Spotify config not found. Please create spotify-config.local.js');
            }
        } catch (error) {
            console.warn('Could not load local Spotify configuration:', error);
        }
    }
    
    return SPOTIFY_CLIENT_ID;
}

/**
 * Check if configuration is valid
 */
function isSpotifyConfigured() {
    return SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_ID !== 'YOUR_CLIENT_ID_HERE' && SPOTIFY_CLIENT_ID.length > 0;
}

/**
 * Get configuration error message
 */
function getConfigErrorMessage() {
    const isProduction = window.location.hostname !== 'localhost' && 
                         window.location.hostname !== '127.0.0.1';
    
    if (isProduction) {
        return `
            <div style="padding: 20px; background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; margin: 20px;">
                <h3 style="color: #856404; margin-top: 0;">⚠️ Spotify API Not Configured</h3>
                <p style="color: #856404; line-height: 1.6;">
                    The Spotify Client ID could not be loaded from Azure Key Vault.
                </p>
                <p style="color: #856404; line-height: 1.6;">
                    Please ensure:
                </p>
                <ol style="color: #856404; text-align: left; line-height: 1.8; padding-left: 20px;">
                    <li>Azure Key Vault is properly configured</li>
                    <li>The secret <code style="background: #fff; padding: 2px 6px; border-radius: 3px;">SPOTIFY-CLIENT-ID</code> exists in Key Vault</li>
                    <li>The application has permission to read from Key Vault</li>
                    <li>The API endpoint <code style="background: #fff; padding: 2px 6px; border-radius: 3px;">/api/config/spotify</code> is working</li>
                </ol>
            </div>
        `;
    } else {
        return `
            <div style="padding: 20px; background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; margin: 20px;">
                <h3 style="color: #856404; margin-top: 0;">⚠️ Spotify API Not Configured</h3>
                <p style="color: #856404; line-height: 1.6;">
                    To use the Spotify integration in local development:
                </p>
                <ol style="color: #856404; text-align: left; line-height: 1.8; padding-left: 20px;">
                    <li>Go to <a href="https://developer.spotify.com/dashboard" target="_blank" style="color: #1DB954; font-weight: bold;">Spotify Developer Dashboard</a></li>
                    <li>Create a new app and copy your Client ID</li>
                    <li>Add redirect URI: <code style="background: #fff; padding: 2px 6px; border-radius: 3px;">${SPOTIFY_REDIRECT_URI}</code></li>
                    <li>Copy <code style="background: #fff; padding: 2px 6px; border-radius: 3px;">src/scripts/spotify-config.local.js.example</code> to <code style="background: #fff; padding: 2px 6px; border-radius: 3px;">spotify-config.local.js</code></li>
                    <li>Edit <code style="background: #fff; padding: 2px 6px; border-radius: 3px;">spotify-config.local.js</code> and paste your Client ID</li>
                    <li>Reload this page</li>
                </ol>
                <p style="color: #856404; margin-bottom: 0;">
                    See <code style="background: #fff; padding: 2px 6px; border-radius: 3px;">SPOTIFY_SETUP.md</code> for detailed instructions.
                </p>
            </div>
        `;
    }
}
