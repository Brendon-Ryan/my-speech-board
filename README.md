# Accessible Speech Board

This project is an accessible communication board designed to support users with disabilities. The application provides an intuitive interface for communication through speech synthesis, customizable word boards, and accessibility-focused features.

## Project Structure

```
accessible-speech-board
├── src
│   ├── index.html        # Main HTML document
│   ├── styles
│   │   └── style.css     # CSS styles for the application
│   ├── scripts
│   │   └── app.js        # JavaScript code for client-side functionality
├── azure-pipelines.yml    # Azure Pipelines configuration for build and deployment
├── package.json           # npm configuration file with dependencies and scripts
└── README.md              # Project documentation
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

This project uses Azure Pipelines for continuous integration and deployment. Ensure that your Azure account is set up and linked to the repository for automated deployments. 

Refer to the `azure-pipelines.yml` file for the build and deployment configuration.