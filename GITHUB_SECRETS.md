# GitHub Secrets Configuration Guide

This document explains how to configure GitHub repository secrets for Azure deployment and Key Vault integration.

## Required Secrets

### 1. AZURE_STATIC_WEB_APPS_API_TOKEN (Required)

This token is used by GitHub Actions to deploy your application to Azure Static Web Apps.

**How to obtain:**
1. Create your Azure Static Web App (see [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md))
2. In the Azure Portal, navigate to your Static Web App
3. Click on "Manage deployment token" in the Overview section
4. Copy the token value

**How to add to GitHub:**
1. Go to your GitHub repository
2. Click on "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
5. Value: Paste the deployment token from Azure
6. Click "Add secret"

---

### 2. AZURE_CREDENTIALS (Optional - for Key Vault access)

Required only if you want to retrieve secrets from Azure Key Vault during deployment.

**How to obtain:**

Use Azure CLI to create a service principal:

```bash
# First, get your subscription ID
az account show --query id -o tsv

# Create service principal with contributor role
az ad sp create-for-rbac \
  --name "my-speech-board-github-actions" \
  --role contributor \
  --scopes /subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP_NAME} \
  --sdk-auth
```

This will output JSON similar to:
```json
{
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

**How to add to GitHub:**
1. Copy the entire JSON output
2. Go to your GitHub repository
3. Click on "Settings" → "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Name: `AZURE_CREDENTIALS`
6. Value: Paste the complete JSON
7. Click "Add secret"

**Grant Key Vault permissions:**

After creating the service principal, grant it access to your Key Vault:

```bash
az keyvault set-policy \
  --name {YOUR_KEY_VAULT_NAME} \
  --spn {CLIENT_ID_FROM_JSON} \
  --secret-permissions get list
```

---

## Secrets for Application Use

When you add API keys or secrets that your application needs (e.g., Spotify API keys), you have two options:

### Option A: Store in Azure Key Vault (Recommended)

1. Add secrets to Azure Key Vault (see [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md))
2. Retrieve them in GitHub Actions using the Key Vault integration
3. Pass them to your application during build or deployment

**Advantages:**
- Centralized secret management
- Better security and audit trails
- Easy rotation of secrets
- Shared across multiple environments

### Option B: Store as GitHub Secrets

1. Go to Settings → Secrets and variables → Actions
2. Add each secret individually

**Example secrets you might add:**
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- Other API keys or credentials

**Note:** For client-side applications, be very careful about which secrets you expose. Client-side code should only contain public API keys or keys that are safe to expose to end users.

---

## Using Secrets in GitHub Actions

### Access GitHub Secrets directly:

```yaml
steps:
  - name: Use secret
    run: echo "Using secret"
    env:
      API_KEY: ${{ secrets.SPOTIFY_CLIENT_ID }}
```

### Access Azure Key Vault secrets:

```yaml
steps:
  - name: Azure Login
    uses: azure/login@v1
    with:
      creds: ${{ secrets.AZURE_CREDENTIALS }}

  - name: Get secrets from Key Vault
    uses: azure/get-keyvault-secrets@v1
    with:
      keyvault: "my-speech-board-kv"
      secrets: 'spotify-client-id, spotify-client-secret'
    id: keyvault

  - name: Use Key Vault secret
    run: echo "Using secret from Key Vault"
    env:
      API_KEY: ${{ steps.keyvault.outputs.spotify-client-id }}
```

---

## Security Best Practices

1. **Never commit secrets to the repository**
   - Always use GitHub Secrets or Azure Key Vault
   - Add `.env` files to `.gitignore`

2. **Use least privilege access**
   - Grant minimal permissions needed for each service principal
   - Regularly review and rotate credentials

3. **Separate environments**
   - Use different secrets for development, staging, and production
   - Consider using environment-specific Key Vaults

4. **Client-side considerations**
   - Only expose secrets that are safe for public access
   - For APIs requiring secret keys, create a backend proxy
   - Use Azure Functions for serverless backend if needed

5. **Audit and monitor**
   - Enable Azure Key Vault logging
   - Review access logs regularly
   - Set up alerts for unusual access patterns

---

## Troubleshooting

### "Secret not found" error in GitHub Actions

- Verify the secret name matches exactly (case-sensitive)
- Ensure the secret has been added to the correct repository
- Check if the secret was recently added (may take a few seconds to be available)

### "Unauthorized" error when accessing Key Vault

- Verify the service principal has the correct permissions
- Check that `AZURE_CREDENTIALS` secret contains valid JSON
- Ensure the Key Vault name is correct in the workflow

### Secrets not being used in the application

- Verify environment variables are being passed correctly
- Check that the application code is reading from the correct environment variable names
- For client-side apps, ensure secrets are exposed appropriately (with caution)

---

## Related Documentation

- [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md) - Complete Azure setup guide
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure Key Vault Documentation](https://docs.microsoft.com/en-us/azure/key-vault/)
