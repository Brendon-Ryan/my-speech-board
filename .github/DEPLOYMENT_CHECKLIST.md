# Azure Deployment Checklist

Use this checklist to deploy the Accessible Speech Board to Azure.

## Prerequisites
- [ ] Azure account created (free tier: https://azure.microsoft.com/free/)
- [ ] GitHub repository admin access
- [ ] This PR merged to master/main branch

## Step 1: Create Azure Static Web App (5 minutes)

### Option A: Azure Portal (Recommended)
1. - [ ] Log into [Azure Portal](https://portal.azure.com)
2. - [ ] Click "Create a resource"
3. - [ ] Search for "Static Web App"
4. - [ ] Fill in:
   - Subscription: Your Azure subscription
   - Resource Group: Create new `my-speech-board-rg`
   - Name: `my-speech-board` (or your preferred name)
   - Plan type: **Free**
   - Region: Select closest to your users
5. - [ ] Click "Sign in with GitHub"
6. - [ ] Select:
   - Organization: Your GitHub username/org
   - Repository: `my-speech-board`
   - Branch: `master` or `main`
7. - [ ] Build Details:
   - Framework preset: Leave as "Custom"
   - App location: `/src`
   - Output location: Leave empty
8. - [ ] Click "Review + create" → "Create"
9. - [ ] Wait for deployment (2-3 minutes)

### Option B: Azure CLI
```bash
# Login to Azure
az login

# Create resource group
az group create --name my-speech-board-rg --location eastus

# Create Static Web App (will prompt for GitHub auth)
az staticwebapp create \
  --name my-speech-board \
  --resource-group my-speech-board-rg \
  --source https://github.com/YOUR_USERNAME/my-speech-board \
  --location eastus \
  --branch main \
  --app-location "/src" \
  --login-with-github
```

## Step 2: Verify GitHub Secret (1 minute)

1. - [ ] Go to GitHub repository
2. - [ ] Navigate to Settings → Secrets and variables → Actions
3. - [ ] Verify `AZURE_STATIC_WEB_APPS_API_TOKEN` exists
4. - [ ] If missing:
   - Go to Azure Portal → Your Static Web App
   - Click "Manage deployment token"
   - Copy token
   - Add as GitHub Secret

## Step 3: Deploy (Automatic)

1. - [ ] Push to master/main branch (or merge this PR)
2. - [ ] Go to GitHub → Actions tab
3. - [ ] Watch "Azure Static Web Apps CI/CD" workflow
4. - [ ] Wait for green checkmark (2-3 minutes)

## Step 4: Get Your URL

1. - [ ] Azure Portal → Your Static Web App → Overview
2. - [ ] Copy the URL (e.g., `https://my-speech-board-xyz.azurestaticapps.net`)
3. - [ ] Open in browser to verify deployment
4. - [ ] Test the speech board functionality

## Optional: Set Up Azure Key Vault (10 minutes)

Only needed if you have API keys (e.g., Spotify integration).

### Create Key Vault
1. - [ ] Azure Portal → "Create a resource"
2. - [ ] Search for "Key Vault"
3. - [ ] Fill in:
   - Resource Group: `my-speech-board-rg` (same as above)
   - Name: `my-speech-board-kv`
   - Region: Same as Static Web App
   - Pricing tier: Standard
4. - [ ] Click "Review + create" → "Create"

### Add Secrets
1. - [ ] Go to your Key Vault → Secrets
2. - [ ] Click "+ Generate/Import"
3. - [ ] Add each secret:
   - Name: `spotify-client-id`
   - Value: Your Spotify client ID
   - Click "Create"
4. - [ ] Repeat for `spotify-client-secret`

### Configure Access
```bash
# Create service principal
az ad sp create-for-rbac \
  --name "my-speech-board-github" \
  --role contributor \
  --scopes /subscriptions/{SUBSCRIPTION_ID}/resourceGroups/my-speech-board-rg \
  --sdk-auth
```

1. - [ ] Copy the entire JSON output
2. - [ ] GitHub → Settings → Secrets → New secret
3. - [ ] Name: `AZURE_CREDENTIALS`
4. - [ ] Value: Paste JSON
5. - [ ] Save

### Grant Key Vault Access
```bash
az keyvault set-policy \
  --name my-speech-board-kv \
  --spn {CLIENT_ID_FROM_JSON} \
  --secret-permissions get list
```

### Update Workflow
1. - [ ] Rename `.github/workflows/azure-with-keyvault-example.yml.example`
   to `azure-with-keyvault.yml`
2. - [ ] Uncomment the Key Vault sections
3. - [ ] Update Key Vault name
4. - [ ] Commit and push

## Troubleshooting

### Deployment fails
- [ ] Check Actions tab for error logs
- [ ] Verify `AZURE_STATIC_WEB_APPS_API_TOKEN` exists
- [ ] Ensure `app_location` is `/src` in workflow

### Site not loading
- [ ] Check Azure Portal → Static Web App → Browse
- [ ] Verify files in correct directory structure
- [ ] Check browser console for errors

### Key Vault access fails
- [ ] Verify `AZURE_CREDENTIALS` is valid JSON
- [ ] Check service principal permissions
- [ ] Ensure Key Vault name is correct

## Cost Summary

| Service | Tier | Cost |
|---------|------|------|
| Azure Static Web Apps | Free | $0/month |
| Azure Key Vault (optional) | Standard | < $1/month |
| **Total** | | **~$0-1/month** |

## Next Steps

- [ ] Set up custom domain (optional)
- [ ] Configure staging environment (optional)
- [ ] Set up monitoring (optional)
- [ ] Add more API integrations as needed

## Additional Resources

- 📖 [AZURE_DEPLOYMENT.md](../AZURE_DEPLOYMENT.md) - Detailed setup guide
- 🔐 [GITHUB_SECRETS.md](../GITHUB_SECRETS.md) - Secrets management
- ⚡ [QUICK_REFERENCE.md](../QUICK_REFERENCE.md) - Quick reference
- 📋 [IMPLEMENTATION_SUMMARY.md](../IMPLEMENTATION_SUMMARY.md) - Full implementation details

## Support

If you encounter issues:
1. Check troubleshooting section above
2. Review detailed documentation in links above
3. Check GitHub Actions logs
4. Review Azure Portal logs

---

**Congratulations!** 🎉 Once complete, your Accessible Speech Board will be live on Azure with automatic deployments.
