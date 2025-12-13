# Spotify Integration Setup Guide

This guide explains how to set up real Spotify API integration for the Accessible Speech Board music player.

## Environment-Specific Setup

- **Local Development**: Use `spotify-config.local.js` file (gitignored)
- **Production (Azure)**: Use Azure Key Vault for secure storage

Choose your setup path:
- [Local Development Setup](#local-development-setup) - Quick setup for testing
- [Production Setup (Azure)](#production-setup-azure) - Secure deployment

---

## Local Development Setup

### Prerequisites

- A Spotify account (free or premium)
  - **Note**: Full playback requires Spotify Premium
  - Free accounts can search and see 30-second previews
- A modern web browser with JavaScript enabled
- Basic understanding of how to edit configuration files

### Step-by-Step Instructions

### 1. Create a Spotify Developer App

1. **Visit the Spotify Developer Dashboard**
   - Go to: https://developer.spotify.com/dashboard
   - Log in with your Spotify account (create one if needed)

2. **Create a New App**
   - Click the **"Create app"** button
   - Fill in the required fields:
     - **App name**: `Accessible Speech Board` (or your preferred name)
     - **App description**: `Music integration for accessible speech board application`
     - **Website**: Optional (you can leave blank or add your site URL)
     - **Redirect URI**: Add your application URLs (see below)

3. **Add Redirect URIs**
   
   Add each of the following URIs (click "Add" after each one):
   
   For local development:
   ```
   http://localhost:8080
   http://127.0.0.1:8080
   ```
   
   For production (replace with your actual domain):
   ```
   https://yourdomain.com
   https://www.yourdomain.com
   ```

4. **Select API/SDKs**
   - Check: ✅ **Web API**
   - Check: ✅ **Web Playback SDK**

5. **Accept Terms**
   - Read and accept Spotify's Developer Terms of Service
   - Read and accept Spotify's Branding Guidelines
   
6. **Save the App**
   - Click **"Save"**

### 2. Get Your Client ID

1. On your app's dashboard page, click **"Settings"**
2. Find the **"Client ID"** field
3. Copy your **Client ID** - you'll need this next

### 3. Configure Local Development

1. **Create local configuration file**
   - Navigate to: `src/scripts/`
   - Copy `spotify-config.local.js.example` to `spotify-config.local.js`
   
   ```bash
   cd src/scripts
   cp spotify-config.local.js.example spotify-config.local.js
   ```

2. **Add your Client ID**
   - Open `spotify-config.local.js` in any text editor
   - Find this line:
     ```javascript
     clientId: 'YOUR_CLIENT_ID_HERE'
     ```
   - Replace `YOUR_CLIENT_ID_HERE` with your actual Client ID:
     ```javascript
     clientId: 'abc123def456ghi789...' // Your actual Client ID
     ```

3. **Save the file**
   - The file is automatically gitignored and won't be committed
   - Keep it secure on your local machine

### 4. Test the Integration

1. **Start your development server**
   ```bash
   npm start
   # or
   python3 -m http.server 8080
   ```

2. **Open the application**
   - Navigate to: `http://localhost:8080`

3. **Click the Music button** (🎵 icon in left navigation)

4. **Log in to Spotify**
   - Click **"Login to Spotify"**
   - You'll be redirected to Spotify's login page
   - Authorize the application
   - You'll be redirected back to the app

5. **Test the features**
   - Search for music using the search bar
   - Click on a song to play it
   - Use playback controls (play, pause, next, previous)
   - Add songs to your playlist

## Features

### 🎵 Music Search
- Real-time search using Spotify's catalog
- Search by song title, artist, or album
- Results include: title, artist, album, duration

### 🎮 Playback Controls
- Play/Pause
- Next track
- Previous track
- Real audio playback (Premium required)

### 📝 Playlist Management
- Add songs to your personal playlist
- Remove songs from playlist
- Clear entire playlist
- Play songs directly from playlist

### 🔐 Authentication
- Secure OAuth 2.0 PKCE flow
- Automatic token refresh
- Persistent login (tokens cached in browser)

## Premium vs Free Accounts

| Feature | Free | Premium |
|---------|------|---------|
| Search | ✅ Yes | ✅ Yes |
| View Track Info | ✅ Yes | ✅ Yes |
| Add to Playlist | ✅ Yes | ✅ Yes |
| 30s Previews | ✅ Yes | ✅ Yes |
| Full Playback | ❌ No | ✅ Yes |
| Playback Controls | ❌ Limited | ✅ Full |

## Troubleshooting

### "Spotify API Not Configured" Message

**Problem**: You see a warning about API not being configured.

**Solution**: 
1. Make sure you've created a Spotify Developer App (Step 1)
2. Check that you've added your Client ID to `spotify-config.js` (Step 3)
3. Reload the page

### "Redirect URI Mismatch" Error

**Problem**: After clicking login, you get an error about redirect URI.

**Solution**:
1. Go back to your Spotify app settings
2. Make sure the redirect URI exactly matches your application URL
3. Common mistake: `http://localhost:8080` vs `http://localhost:8080/`
4. Add both versions if needed

### "Player Not Ready" Error

**Problem**: Songs won't play and you get a "player not ready" error.

**Solution**:
1. Wait 5-10 seconds after logging in before trying to play
2. Refresh the page and try again
3. Make sure you're using a supported browser (Chrome, Edge, Firefox)

### "Premium Required" Message

**Problem**: Playback fails with a message about Premium account.

**Solution**:
- Full playback requires Spotify Premium subscription
- Free accounts can:
  - Search and browse
  - Add songs to playlists
  - Play 30-second previews (if available)

### Songs Not Playing

**Problem**: Songs appear in search but won't play.

**Solution**:
1. Check that you have Spotify Premium
2. Make sure the Spotify Web Player SDK loaded correctly
3. Try refreshing the page
4. Check browser console for errors (F12 → Console tab)

### Authentication Expires

**Problem**: You have to log in again frequently.

**Solution**:
- Normal behavior - tokens expire after 1 hour
- App automatically refreshes tokens when possible
- If refresh fails, you'll need to log in again

## Security Best Practices

### For Development
- ✅ Using PKCE flow (no client secret needed)
- ✅ Tokens stored in localStorage
- ✅ Automatic token refresh

### For Production

**Important**: Before deploying to production, you should:

1. **Use Environment Variables**
   ```javascript
   const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
   ```

2. **Never Commit Credentials**
   - Add `spotify-config.js` to `.gitignore` if it contains real credentials
   - Use a separate config file for production

3. **Use HTTPS**
   - Always use HTTPS in production
   - Update redirect URIs to use `https://`

4. **Implement Backend Token Exchange**
   - For enhanced security, exchange tokens server-side
   - Store refresh tokens securely (not in browser)

## API Rate Limits

Spotify has rate limits on API requests:
- **Search**: Reasonable limits for normal use
- **Playback**: No specific limits mentioned
- If you hit limits: Wait a few seconds and retry

## Additional Resources

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api/)
- [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/)
- [Authorization Guide](https://developer.spotify.com/documentation/general/guides/authorization/)
- [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

## Support

If you encounter issues:

1. Check the browser console (F12 → Console) for error messages
2. Verify your Client ID is correct in `spotify-config.js`
3. Ensure redirect URIs match exactly
4. Try logging out and logging in again
5. Clear browser cache and localStorage

---

## Production Setup (Azure)

For production deployment, use Azure Key Vault to securely store your Spotify Client ID.

### Quick Overview

1. **Create Azure Key Vault**
2. **Store Spotify Client ID in Key Vault**
3. **Create API endpoint to retrieve Client ID**
4. **Configure application to use production config**

### Detailed Instructions

See **[AZURE_KEYVAULT_SETUP.md](./AZURE_KEYVAULT_SETUP.md)** for complete step-by-step instructions including:

- Creating and configuring Azure Key Vault
- Using Managed Identity for secure access
- Creating backend API endpoint
- Testing and troubleshooting
- Security best practices

### Key Differences from Local Setup

| Aspect | Local Development | Production (Azure) |
|--------|------------------|-------------------|
| **Config Storage** | `spotify-config.local.js` file | Azure Key Vault |
| **Access Method** | Direct file include | API endpoint (`/api/config/spotify`) |
| **Security** | File is gitignored | Managed Identity + Key Vault |
| **Setup Time** | 2 minutes | 15-30 minutes |
| **Cost** | Free | ~$0.03 per 10k operations |

### Production Checklist

- [ ] Azure Key Vault created
- [ ] Spotify Client ID stored in Key Vault as `SPOTIFY-CLIENT-ID`
- [ ] Managed Identity enabled on App Service
- [ ] Key Vault access policy configured
- [ ] API endpoint `/api/config/spotify` implemented
- [ ] Application tested in production environment
- [ ] HTTPS enabled on all endpoints
- [ ] Redirect URIs updated to production domain

---

## License

This integration uses Spotify's Web API and Web Playback SDK, subject to:
- [Spotify Developer Terms of Service](https://developer.spotify.com/terms)
- [Spotify Branding Guidelines](https://developer.spotify.com/documentation/general/design-and-branding/)
