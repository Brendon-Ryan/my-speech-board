# Configuration Quick Reference

## Local Development (Testing)

### Setup (2 minutes)
```bash
# 1. Copy example file
cd src/scripts
cp spotify-config.local.js.example spotify-config.local.js

# 2. Get Spotify Client ID
# Visit: https://developer.spotify.com/dashboard
# Create app → Copy Client ID

# 3. Edit spotify-config.local.js
# Replace 'YOUR_CLIENT_ID_HERE' with your actual ID

# 4. Done! Reload the app
```

### File Location
```
src/scripts/spotify-config.local.js  ← Add your Client ID here
```

### What Gets Committed
- ✅ `spotify-config.local.js.example` (template)
- ❌ `spotify-config.local.js` (your actual ID - gitignored)

---

## Production (Azure Key Vault)

### Setup (15 minutes)
```bash
# 1. Create Key Vault
az keyvault create \
  --name myspeechboard-kv \
  --resource-group myspeechboard-rg

# 2. Store Client ID
az keyvault secret set \
  --vault-name myspeechboard-kv \
  --name SPOTIFY-CLIENT-ID \
  --value "your_client_id_here"

# 3. Enable Managed Identity on App Service
az webapp identity assign \
  --name your-app-name \
  --resource-group myspeechboard-rg

# 4. Grant access
az keyvault set-policy \
  --name myspeechboard-kv \
  --object-id <managed-identity-principal-id> \
  --secret-permissions get list
```

### API Endpoint Required
Create `/api/config/spotify` that returns:
```json
{
  "clientId": "your_client_id_from_keyvault"
}
```

### Environment Variables
```
AZURE_KEYVAULT_NAME=myspeechboard-kv
```

---

## How It Works

### Environment Detection
```
localhost or 127.0.0.1  → Uses spotify-config.local.js
Any other domain         → Fetches from /api/config/spotify
```

### Config Flow

**Local:**
1. Load `spotify-config.local.js` (sets `window.SPOTIFY_LOCAL_CONFIG`)
2. Main config reads from this variable
3. App uses Client ID immediately

**Production:**
1. Detect non-localhost
2. Fetch from `/api/config/spotify`
3. API retrieves from Key Vault using Managed Identity
4. App uses returned Client ID

---

## Files Reference

```
Project Structure:
├── src/scripts/
│   ├── spotify-config.js                    # Main config (no secrets)
│   ├── spotify-config.local.js.example      # Template (committed)
│   ├── spotify-config.local.js              # Your config (gitignored)
│   └── spotify-api.js                       # API wrapper
├── SPOTIFY_SETUP.md                         # Complete setup guide
├── AZURE_KEYVAULT_SETUP.md                  # Azure guide
└── .gitignore                               # Excludes local config
```

---

## Quick Checks

### Is my config working?

**Open browser console:**
```javascript
// Check if config is loaded
isSpotifyConfigured()  // Should return true

// Check environment
window.location.hostname  // localhost = local, else = production

// Check loaded config (local only)
window.SPOTIFY_LOCAL_CONFIG?.clientId  // Should show your ID (local)
```

### Common Issues

**Local: "Spotify API Not Configured"**
- File `spotify-config.local.js` doesn't exist
- File has wrong Client ID format
- File isn't loading (check browser console)

**Production: "Could not load from Key Vault"**
- API endpoint `/api/config/spotify` not implemented
- Managed Identity not configured
- Key Vault permissions missing
- Secret name mismatch

---

## Security Notes

### ✅ Safe Practices
- Local config file is gitignored
- Production uses Managed Identity
- No credentials in code
- Key Vault for centralized storage

### ⚠️ Important
- **Never** commit `spotify-config.local.js`
- **Never** put Client ID directly in `spotify-config.js`
- **Always** use HTTPS in production
- **Always** use Key Vault for production

---

## Support

- **Local Setup**: [SPOTIFY_SETUP.md](./SPOTIFY_SETUP.md)
- **Production Setup**: [AZURE_KEYVAULT_SETUP.md](./AZURE_KEYVAULT_SETUP.md)
- **Spotify Dashboard**: https://developer.spotify.com/dashboard
- **Azure Portal**: https://portal.azure.com
