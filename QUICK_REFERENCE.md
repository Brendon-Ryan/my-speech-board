# Azure Deployment - Quick Reference

This document provides a quick reference for the Azure deployment setup.

## 📁 Files Created

### GitHub Actions Workflows
- **`.github/workflows/azure-static-web-apps.yml`** - Main deployment workflow
- **`.github/workflows/azure-with-keyvault-example.yml.example`** - Example workflow with Key Vault integration

### Configuration Files
- **`staticwebapp.config.json`** - Azure Static Web Apps configuration (routing, MIME types, headers)

### Documentation
- **`AZURE_DEPLOYMENT.md`** - Comprehensive Azure setup guide
- **`GITHUB_SECRETS.md`** - GitHub secrets configuration guide
- **`README.md`** - Updated with Azure deployment information

## 🚀 Quick Start

1. **Create Azure Static Web App**
   - Go to [Azure Portal](https://portal.azure.com)
   - Create a new Static Web App (Free tier)
   - Connect to this GitHub repository
   - Azure will automatically add the deployment token

2. **Verify GitHub Secret**
   - Go to GitHub Repository Settings → Secrets and variables → Actions
   - Ensure `AZURE_STATIC_WEB_APPS_API_TOKEN` exists
   - If not, get it from Azure Portal → Your Static Web App → Manage deployment token

3. **Deploy**
   - Push to `master` or `main` branch
   - GitHub Actions will automatically deploy your site

## 🔐 Key Vault Setup (Optional)

Only needed if you have API keys or secrets (e.g., Spotify integration):

1. **Create Azure Key Vault**
   - Follow instructions in `AZURE_DEPLOYMENT.md`
   - Use Standard tier

2. **Add Secrets**
   - Add secrets like `spotify-client-id`, `spotify-client-secret`

3. **Configure Access**
   - Create service principal with `az ad sp create-for-rbac`
   - Add `AZURE_CREDENTIALS` to GitHub Secrets
   - Grant Key Vault permissions

4. **Use in Workflow**
   - Uncomment Key Vault sections in example workflow
   - Copy to main workflow or create separate workflow

## 📊 Workflow Triggers

The deployment workflow triggers on:
- **Push to `master` or `main` branch** - Deploys to production
- **Pull request events** - Creates preview deployments
- **PR closed** - Cleans up preview deployments

## 💰 Cost Estimate

- **Azure Static Web Apps**: FREE (100 GB bandwidth/month)
- **Azure Key Vault**: ~$0.03 per 10,000 operations (< $1/month for typical use)

## 📝 Key Features

✅ Automatic deployment on push to master/main  
✅ Preview deployments for pull requests  
✅ Free SSL certificates  
✅ Custom domain support  
✅ Global CDN distribution  
✅ Key Vault integration for secrets management  
✅ No server management required  

## 🔗 Useful Links

- [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md) - Full setup instructions
- [GITHUB_SECRETS.md](GITHUB_SECRETS.md) - Secrets management guide
- [Azure Static Web Apps Docs](https://docs.microsoft.com/azure/static-web-apps/)

## 🐛 Troubleshooting

**Deployment fails?**
- Check GitHub Actions logs in the "Actions" tab
- Verify `AZURE_STATIC_WEB_APPS_API_TOKEN` secret exists
- Ensure `app_location` points to `/src`

**Key Vault access fails?**
- Verify `AZURE_CREDENTIALS` is valid JSON
- Check service principal permissions
- Ensure Key Vault name is correct

**Site not loading correctly?**
- Check `staticwebapp.config.json` routing rules
- Verify files are in the correct directory structure
- Check browser console for errors

## 📞 Need Help?

Refer to the comprehensive guides:
- **Setup**: See `AZURE_DEPLOYMENT.md`
- **Secrets**: See `GITHUB_SECRETS.md`
- **Example**: See `.github/workflows/azure-with-keyvault-example.yml.example`
