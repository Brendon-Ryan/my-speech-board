# Spotify API Integration - Quick Reference

## What Changed

This update replaces the mock Spotify implementation with **real Spotify Web API integration**.

### Before (Mock Implementation)
- ❌ Simulated login
- ❌ Fake search results
- ❌ No actual music playback
- ❌ Mock data only

### After (Real API Integration)
- ✅ Real OAuth 2.0 authentication
- ✅ Real Spotify search results
- ✅ Actual music playback (Premium)
- ✅ Full Web Playback SDK integration

## Quick Setup (5 Minutes)

### 1. Create Spotify Developer App
```
1. Go to: https://developer.spotify.com/dashboard
2. Click "Create app"
3. Fill in:
   - Name: Accessible Speech Board
   - Description: Music integration
   - Redirect URI: http://localhost:8080
   - APIs: Web API + Web Playback SDK
4. Click "Save"
5. Click "Settings"
6. Copy your "Client ID"
```

### 2. Configure Application
```
1. Open: src/scripts/spotify-config.js
2. Find: const SPOTIFY_CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
3. Replace 'YOUR_CLIENT_ID_HERE' with your actual Client ID
4. Save the file
```

### 3. Start Using
```
1. Reload the application
2. Click Music button (🎵)
3. Click "Login to Spotify"
4. Authorize the app
5. Start searching and playing music!
```

## File Structure

```
src/
├── scripts/
│   ├── spotify-config.js   ← ADD YOUR CLIENT ID HERE
│   ├── spotify-api.js      ← API wrapper (no changes needed)
│   └── app.js              ← Updated to use real API
└── index.html              ← Updated to load new scripts

SPOTIFY_SETUP.md            ← Detailed setup guide
```

## Configuration Error

If you see this warning when clicking the Music button:

```
⚠️ Spotify API Not Configured

To use the Spotify integration, you need to set up API credentials:

1. Go to Spotify Developer Dashboard
2. Create a new app and copy your Client ID
3. Add redirect URI: http://localhost:8080
4. Edit src/scripts/spotify-config.js and paste your Client ID
5. Reload this page

See spotify-config.js for detailed instructions.
```

**Solution**: Follow the "Quick Setup" steps above.

## What You Need

### Required
- ✅ Spotify account (free or premium)
- ✅ Spotify Developer App (free to create)
- ✅ Client ID (from Spotify Developer Dashboard)

### Optional (for full features)
- ⭐ Spotify Premium subscription (for full playback)
- 🆓 Free accounts: search + 30-second previews only

## Features by Account Type

### Spotify Premium 🎵
| Feature | Available |
|---------|-----------|
| Search Music | ✅ Yes |
| View Details | ✅ Yes |
| Full Playback | ✅ Yes |
| Play/Pause | ✅ Yes |
| Next/Previous | ✅ Yes |
| Playlists | ✅ Yes |
| Queue | ✅ Yes |

### Spotify Free 🎶
| Feature | Available |
|---------|-----------|
| Search Music | ✅ Yes |
| View Details | ✅ Yes |
| Full Playback | ❌ No |
| 30s Previews | ⚠️ Limited |
| Play/Pause | ⚠️ Limited |
| Next/Previous | ❌ No |
| Playlists | ✅ Yes (UI only) |
| Queue | ✅ Yes (UI only) |

## API Calls Used

The integration uses these Spotify endpoints:

1. **Authentication**
   - `accounts.spotify.com/authorize` - OAuth login
   - `accounts.spotify.com/api/token` - Token exchange

2. **Search**
   - `api.spotify.com/v1/search` - Search tracks

3. **Playback**
   - `api.spotify.com/v1/me/player/play` - Play track
   - Web Playback SDK - Audio streaming

## Security Notes

### ✅ What's Secure
- Uses OAuth 2.0 PKCE flow
- No client secret required
- Tokens auto-refresh
- Secure authorization flow

### ⚠️ For Production
- Use environment variables for Client ID
- Implement server-side token exchange
- Use HTTPS only
- Add rate limiting

## Troubleshooting

### "Redirect URI mismatch"
**Fix**: Add your exact URL to Spotify app settings
```
Example: http://localhost:8080
Not: http://localhost:8080/
```

### "Player not ready"
**Fix**: Wait 5-10 seconds after login before playing

### "Premium required"
**Expected**: Full playback needs Premium subscription
**Workaround**: Free users can search and manage playlists

### Search returns no results
**Fix**: 
1. Check you're logged in
2. Try different search terms
3. Check internet connection

## Support Links

- 📚 [Full Setup Guide](SPOTIFY_SETUP.md)
- 🔧 [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- 📖 [Spotify Web API Docs](https://developer.spotify.com/documentation/web-api/)
- 🎮 [Web Playback SDK Docs](https://developer.spotify.com/documentation/web-playback-sdk/)

## Example Configuration

**Before:**
```javascript
const SPOTIFY_CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
```

**After:**
```javascript
const SPOTIFY_CLIENT_ID = 'abc123def456ghi789jkl';
```

That's it! Just one line to change. 🎉
