# Azure Deployment Setup Guide

This guide will help you set up Azure hosting for the Accessible Speech Board application.

## Prerequisites

- An Azure account (free tier available at https://azure.microsoft.com/free/)
- GitHub repository access with admin permissions
- Azure CLI (optional, for command-line setup)

## Step 1: Create Azure Static Web App

### Option A: Using Azure Portal (Recommended for beginners)

1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Static Web App" and select it
4. Click "Create"
5. Configure the following:
   - **Subscription**: Select your Azure subscription
   - **Resource Group**: Create new or select existing
   - **Name**: Choose a unique name (e.g., `my-speech-board`)
   - **Plan type**: Select "Free" for cost-free hosting
   - **Region**: Choose the closest region to your users
   - **Deployment details**:
     - Source: GitHub
     - Organization: Your GitHub username/organization
     - Repository: `my-speech-board`
     - Branch: `master` or `main`
6. Click "Review + create" then "Create"
7. Azure will automatically create a GitHub Actions workflow and add the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret to your repository

### Option B: Using Azure CLI

```bash
# Login to Azure
az login

# Create a resource group
az group create --name my-speech-board-rg --location eastus

# Create Static Web App (this will prompt for GitHub authentication)
az staticwebapp create \
  --name my-speech-board \
  --resource-group my-speech-board-rg \
  --source https://github.com/YOUR_USERNAME/my-speech-board \
  --location eastus \
  --branch master \
  --app-location "/src" \
  --login-with-github
```

## Step 2: Configure GitHub Secrets

The GitHub Actions workflow requires the following secret:

### AZURE_STATIC_WEB_APPS_API_TOKEN

If you created the Static Web App via Azure Portal, this secret is automatically added. If not:

1. Go to your Azure Static Web App in the Azure Portal
2. Click "Manage deployment token"
3. Copy the deployment token
4. Go to your GitHub repository
5. Navigate to Settings → Secrets and variables → Actions
6. Click "New repository secret"
7. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
8. Value: Paste the deployment token
9. Click "Add secret"

## Step 3: Set Up Azure Key Vault for Secrets

Azure Key Vault is recommended for storing sensitive information like API keys (e.g., Spotify integration keys).

### Create Key Vault

1. In Azure Portal, click "Create a resource"
2. Search for "Key Vault" and select it
3. Click "Create"
4. Configure:
   - **Subscription**: Your Azure subscription
   - **Resource Group**: Same as your Static Web App
   - **Key vault name**: Choose unique name (e.g., `my-speech-board-kv`)
   - **Region**: Same as your Static Web App
   - **Pricing tier**: Standard
5. Click "Review + create" then "Create"

### Add Secrets to Key Vault

1. Navigate to your Key Vault in Azure Portal
2. Go to "Secrets" in the left menu
3. Click "+ Generate/Import"
4. For each secret (e.g., Spotify API credentials):
   - **Name**: `spotify-client-id` (use kebab-case)
   - **Value**: Your actual API key
   - Click "Create"

### Configure Access for GitHub Actions

To access Key Vault secrets from GitHub Actions:

1. Create a Service Principal:
```bash
az ad sp create-for-rbac \
  --name "my-speech-board-github" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} \
  --sdk-auth
```

2. Copy the entire JSON output

3. In GitHub repository:
   - Go to Settings → Secrets and variables → Actions
   - Create new secret: `AZURE_CREDENTIALS`
   - Paste the JSON output

4. Grant Key Vault access to the Service Principal:
```bash
az keyvault set-policy \
  --name my-speech-board-kv \
  --spn {clientId from JSON} \
  --secret-permissions get list
```

### Using Key Vault Secrets in GitHub Actions

Add this step to your workflow before the deploy step:

```yaml
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

- name: Set environment variables
  run: |
    echo "SPOTIFY_CLIENT_ID=${{ steps.keyvault.outputs.spotify-client-id }}" >> $GITHUB_ENV
    echo "SPOTIFY_CLIENT_SECRET=${{ steps.keyvault.outputs.spotify-client-secret }}" >> $GITHUB_ENV
```

## Step 4: Verify Deployment

1. Push changes to the `master` or `main` branch
2. Go to the "Actions" tab in your GitHub repository
3. Watch the workflow run
4. Once complete, your site will be available at the Azure Static Web App URL
5. Find the URL in:
   - Azure Portal → Your Static Web App → Overview → URL
   - Or in the GitHub Actions workflow output

## Cost Estimation

- **Azure Static Web Apps (Free tier)**:
  - 100 GB bandwidth per subscription per month
  - Free custom domains and SSL
  - Perfect for this application
  
- **Azure Key Vault (Standard tier)**:
  - $0.03 per 10,000 transactions
  - Minimal cost for this use case (< $1/month)

## Troubleshooting

### Deployment fails with "App location not found"
- Ensure the `app_location` in the workflow is set to `/src`
- Verify your index.html is in the `src` directory

### Cannot access secrets in Key Vault
- Verify the Service Principal has the correct permissions
- Check that the Key Vault name is correct in the workflow
- Ensure `AZURE_CREDENTIALS` secret is properly formatted

### Site loads but paths don't work
- Check the `staticwebapp.config.json` file is in the root directory
- Verify route configuration matches your application structure

## Additional Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure Key Vault Documentation](https://docs.microsoft.com/azure/key-vault/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
