# Accessible Speech Board

This project is an accessible communication board designed to support users with disabilities. The application provides an intuitive interface for communication through speech synthesis, customizable word boards, and accessibility-focused features.

## Project Structure

```
accessible-speech-board
├── src
│   ├── index.html               # Main HTML document
│   ├── styles
│   │   └── style.css            # CSS styles for the application
│   ├── scripts
│   │   └── app.js               # JavaScript code for client-side functionality
├── .github
│   └── workflows
│       └── azure-static-web-apps.yml  # GitHub Actions workflow for Azure deployment
├── staticwebapp.config.json     # Azure Static Web Apps configuration
├── AZURE_DEPLOYMENT.md          # Azure deployment setup guide
├── package.json                 # npm configuration file with dependencies and scripts
└── README.md                    # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd accessible-speech-board
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. To run the application locally, open `src/index.html` in your web browser.

## Usage

The Accessible Speech Board provides:
- Customizable word buttons with speech synthesis
- Multiple themed categories (Core, Food, Feelings, Actions, Places, People, Alphabet & Numbers, Phrases)
- Configurable activation modes (hover or click)
- Multiple color schemes including high-contrast and colorblind-friendly options
- Voice selection for text-to-speech
- Edit mode for personalizing word boards

To customize:
- Modify the HTML in `src/index.html` to change the structure
- Update styles in `src/styles/style.css` to customize the appearance
- Add interactivity by editing `src/scripts/app.js`

## Deployment

This project is configured for automatic deployment to Azure Static Web Apps using GitHub Actions. When you push to the `master` or `main` branch, the application is automatically built and deployed to Azure.

### Azure Hosting Setup

For detailed instructions on setting up Azure hosting, including:
- Creating an Azure Static Web App (free tier)
- Configuring GitHub Actions
- Setting up Azure Key Vault for secrets management
- Managing API keys (e.g., Spotify integration)

Please refer to the [Azure Deployment Guide](AZURE_DEPLOYMENT.md).

### Quick Start

1. Create an Azure Static Web App in the [Azure Portal](https://portal.azure.com)
2. Connect it to this GitHub repository
3. Azure will automatically configure the deployment workflow
4. Push to `master` branch to trigger deployment

### Local Development

To run the application locally:
```bash
npm install
npm start
```

This will start a local development server and open the application in your browser.