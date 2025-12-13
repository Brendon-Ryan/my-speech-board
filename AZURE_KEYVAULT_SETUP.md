# Azure Key Vault Setup for Production

This guide explains how to set up Azure Key Vault to securely store your Spotify Client ID for production deployment.

## Prerequisites

- Azure subscription
- Azure CLI installed or access to Azure Portal
- Spotify Developer App Client ID

## Step 1: Create Azure Key Vault

### Using Azure Portal:

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **"Create a resource"**
3. Search for **"Key Vault"** and select it
4. Click **"Create"**
5. Fill in the details:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or select existing
   - **Key Vault Name**: `myspeechboard-keyvault` (must be globally unique)
   - **Region**: Select your preferred region
   - **Pricing Tier**: Standard
6. Click **"Review + Create"**, then **"Create"**

### Using Azure CLI:

```bash
# Login to Azure
az login

# Create resource group (if needed)
az group create --name myspeechboard-rg --location eastus

# Create Key Vault
az keyvault create \
  --name myspeechboard-keyvault \
  --resource-group myspeechboard-rg \
  --location eastus
```

## Step 2: Add Spotify Client ID to Key Vault

### Using Azure Portal:

1. Navigate to your Key Vault in Azure Portal
2. Click **"Secrets"** in the left menu
3. Click **"+ Generate/Import"**
4. Fill in:
   - **Upload options**: Manual
   - **Name**: `SPOTIFY-CLIENT-ID`
   - **Value**: Your Spotify Client ID (from developer dashboard)
   - **Content type**: (leave empty)
   - **Enabled**: Yes
5. Click **"Create"**

### Using Azure CLI:

```bash
# Set your Spotify Client ID
export SPOTIFY_CLIENT_ID="your_client_id_here"

# Add secret to Key Vault
az keyvault secret set \
  --vault-name myspeechboard-keyvault \
  --name SPOTIFY-CLIENT-ID \
  --value "$SPOTIFY_CLIENT_ID"
```

## Step 3: Configure Application Access

Your application needs permission to read from Key Vault.

### Option A: Using Managed Identity (Recommended for Azure App Service)

1. **Enable Managed Identity on your App Service:**

   ```bash
   # Enable system-assigned managed identity
   az webapp identity assign \
     --name your-app-name \
     --resource-group myspeechboard-rg
   ```

2. **Grant Key Vault access to the managed identity:**

   ```bash
   # Get the principal ID of the managed identity
   PRINCIPAL_ID=$(az webapp identity show \
     --name your-app-name \
     --resource-group myspeechboard-rg \
     --query principalId -o tsv)
   
   # Grant Key Vault access
   az keyvault set-policy \
     --name myspeechboard-keyvault \
     --object-id $PRINCIPAL_ID \
     --secret-permissions get list
   ```

### Option B: Using Service Principal

1. **Create Service Principal:**

   ```bash
   az ad sp create-for-rbac --name myspeechboard-sp
   # Save the output: appId, password, tenant
   ```

2. **Grant access to Key Vault:**

   ```bash
   az keyvault set-policy \
     --name myspeechboard-keyvault \
     --spn <appId-from-previous-step> \
     --secret-permissions get list
   ```

## Step 4: Create API Endpoint

Create a backend API endpoint to securely retrieve the Client ID from Key Vault.

### Example: Azure Function (Node.js)

**File: `api/config/spotify/index.js`**

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

module.exports = async function (context, req) {
    try {
        // Key Vault configuration
        const keyVaultName = process.env.AZURE_KEYVAULT_NAME || "myspeechboard-keyvault";
        const keyVaultUrl = `https://${keyVaultName}.vault.azure.net`;
        
        // Create client using managed identity
        const credential = new DefaultAzureCredential();
        const client = new SecretClient(keyVaultUrl, credential);
        
        // Retrieve Spotify Client ID
        const secret = await client.getSecret("SPOTIFY-CLIENT-ID");
        
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'private, max-age=3600' // Cache for 1 hour
            },
            body: {
                clientId: secret.value
            }
        };
    } catch (error) {
        context.log.error('Error retrieving Spotify config:', error);
        context.res = {
            status: 500,
            body: {
                error: 'Failed to retrieve configuration'
            }
        };
    }
};
```

**File: `api/config/spotify/function.json`**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get"],
      "route": "config/spotify"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

**Install dependencies:**

```bash
npm install @azure/identity @azure/keyvault-secrets
```

### Example: Express.js Backend

```javascript
const express = require('express');
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

const app = express();

// Cache the client ID for performance
let cachedClientId = null;
let cacheExpiry = null;

app.get('/api/config/spotify', async (req, res) => {
    try {
        // Check cache (1 hour)
        if (cachedClientId && cacheExpiry && Date.now() < cacheExpiry) {
            return res.json({ clientId: cachedClientId });
        }
        
        // Key Vault configuration
        const keyVaultName = process.env.AZURE_KEYVAULT_NAME || "myspeechboard-keyvault";
        const keyVaultUrl = `https://${keyVaultName}.vault.azure.net`;
        
        // Create client using managed identity
        const credential = new DefaultAzureCredential();
        const client = new SecretClient(keyVaultUrl, credential);
        
        // Retrieve Spotify Client ID
        const secret = await client.getSecret("SPOTIFY-CLIENT-ID");
        
        // Update cache
        cachedClientId = secret.value;
        cacheExpiry = Date.now() + (3600 * 1000); // 1 hour
        
        res.json({ clientId: secret.value });
    } catch (error) {
        console.error('Error retrieving Spotify config:', error);
        res.status(500).json({ error: 'Failed to retrieve configuration' });
    }
});

app.listen(3000);
```

## Step 5: Configure Environment Variables

Set the Key Vault name in your application settings:

### Azure App Service:

```bash
az webapp config appsettings set \
  --name your-app-name \
  --resource-group myspeechboard-rg \
  --settings AZURE_KEYVAULT_NAME=myspeechboard-keyvault
```

### Azure Portal:

1. Go to your App Service
2. Click **"Configuration"** in the left menu
3. Click **"+ New application setting"**
4. Add:
   - **Name**: `AZURE_KEYVAULT_NAME`
   - **Value**: `myspeechboard-keyvault`
5. Click **"OK"**, then **"Save"**

## Step 6: Test the Setup

### Test Key Vault Access:

```bash
# Using Azure CLI
az keyvault secret show \
  --vault-name myspeechboard-keyvault \
  --name SPOTIFY-CLIENT-ID \
  --query value -o tsv
```

### Test API Endpoint:

```bash
# Test locally (if running local API)
curl http://localhost:3000/api/config/spotify

# Test production
curl https://your-app.azurewebsites.net/api/config/spotify
```

Expected response:
```json
{
  "clientId": "your_spotify_client_id_here"
}
```

## Security Best Practices

1. **Use Managed Identity**: Avoids storing credentials in code or config
2. **Network Isolation**: Configure Key Vault firewall to only allow your app
3. **Access Policies**: Grant minimum required permissions (get, list secrets only)
4. **Audit Logging**: Enable diagnostic logs for Key Vault access
5. **Secret Rotation**: Regularly update your Spotify Client ID if needed
6. **HTTPS Only**: Ensure all endpoints use HTTPS

## Troubleshooting

### "Access Denied" Error

**Problem**: Application can't access Key Vault

**Solutions**:
1. Verify managed identity is enabled on your App Service
2. Check Key Vault access policies include your app's identity
3. Ensure the secret name matches exactly: `SPOTIFY-CLIENT-ID`

### "Key Vault Not Found" Error

**Problem**: Can't connect to Key Vault

**Solutions**:
1. Verify `AZURE_KEYVAULT_NAME` environment variable is set correctly
2. Check Key Vault name is correct (no typos)
3. Ensure Key Vault and app are in the same Azure subscription

### API Returns 500 Error

**Problem**: Backend can't retrieve secret

**Solutions**:
1. Check application logs for detailed error messages
2. Test Key Vault access using Azure CLI
3. Verify network connectivity between app and Key Vault
4. Check that required npm packages are installed

## Alternative: Azure App Configuration

For more complex configuration management, consider using Azure App Configuration with Key Vault references:

1. Create Azure App Configuration service
2. Add Key Vault reference: `@Microsoft.KeyVault(SecretUri=https://myspeechboard-keyvault.vault.azure.net/secrets/SPOTIFY-CLIENT-ID)`
3. Update app to read from App Configuration

## Cost Considerations

- **Key Vault**: ~$0.03 per 10,000 operations
- **Storage**: Minimal for a few secrets
- **Recommended**: Standard tier for production
- **Free Tier**: Available for App Service integration

## Resources

- [Azure Key Vault Documentation](https://docs.microsoft.com/azure/key-vault/)
- [Managed Identity Documentation](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/)
- [Azure SDK for JavaScript](https://github.com/Azure/azure-sdk-for-js)
- [Best Practices for Key Vault](https://docs.microsoft.com/azure/key-vault/general/best-practices)
