# Flux SEO Optimizer WordPress Plugin

Integrates React-based SEO tools with Google's Gemini AI, using your WordPress backend to securely proxy API calls. This plugin allows you to leverage powerful AI content generation features directly within your WordPress environment.

**Version:** 0.1.0
**Author:** Jules @ AI Software Engineer

## Features (Current Focus)

*   **AI-Powered Blog Generator:** Generate blog posts and suggested image prompts based on your topics, keywords, and desired style. (Implemented via the `BlogGenerator.tsx` component).
*   Securely handles your Google Gemini API key via WordPress backend.
*   React-based frontend for a modern user experience.

## Requirements

*   WordPress (tested version, e.g., 6.0 or higher - *assuming a recent version*)
*   PHP (tested version, e.g., 7.4 or higher - *assuming a common modern version*)
*   A Google Gemini API Key.

## Installation

1.  **Download:** Download the `flux-seo-optimizer.zip` file (once packaged).
2.  **Upload to WordPress:**
    *   In your WordPress admin dashboard, navigate to `Plugins` > `Add New`.
    *   Click `Upload Plugin`.
    *   Choose the `flux-seo-optimizer.zip` file and click `Install Now`.
3.  **Activate:** After installation, click `Activate Plugin`.

## Configuration

1.  **Obtain a Google Gemini API Key:**
    *   If you don't have one, you can get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  **Save API Key in WordPress:**
    *   In your WordPress admin dashboard, navigate to `Settings` > `Flux SEO Optimizer`.
    *   Enter your Google Gemini API Key in the provided field.
    *   Click `Save Settings`.

    *Your API key is stored securely in your WordPress database and is only used by the server-side PHP proxy to communicate with the Gemini API. It is not exposed to the user's browser.*

## Usage

1.  **Add the Dashboard to a Page/Post:**
    *   Edit any page or post where you want to use the SEO tools.
    *   Add the following shortcode to the content:
        ```
        [flux_seo_optimizer_dashboard]
        ```
    *   Save or publish the page/post.
2.  **Using the Blog Generator:**
    *   Visit the page where you added the shortcode. The Flux SEO Optimizer dashboard should load.
    *   The "Generator" tab (or the `BlogGenerator` interface) will be available.
    *   Fill in the fields:
        *   **Blog Topic:** The main subject of your blog post.
        *   **Primary Keyword:** The main keyword to focus on.
        *   **Writing Tone:** Select from options like Professional, Casual, etc., or let AI suggest.
        *   **Word Count:** Desired length of the article.
        *   **Writing Style:** Choose a style like Informative, Storytelling, etc.
    *   Click `Generate Blog Post`.
    *   The AI-generated content will appear, followed by a suggested image prompt.
    *   You can then copy the content or export it as a Markdown file.

## For Developers: Building the React App

This plugin uses a React frontend. If you are modifying the React source code in the `src/` directory, you need to rebuild it:

1.  Ensure you have Node.js and npm installed.
2.  Navigate to the plugin's root directory (`wp-content/plugins/flux-seo-optimizer/`) in your terminal.
3.  Install dependencies: `npm install`
4.  Run the WordPress build script: `npm run build:wordpress`

This will compile the React application and place the necessary static assets into the `dist/flux-seo-plugin/` directory, which the PHP plugin then enqueues.

## Troubleshooting

*   **React App Not Loading / "Flux SEO Optimizer error: React app script not found..." admin notice:**
    *   This usually means the React app hasn't been built, or the built files are not in the expected `dist/flux-seo-plugin/` directory.
    *   Run the build process: `npm install` then `npm run build:wordpress` in the plugin's root directory.
*   **API Key Errors / "Missing API Key" messages in the tool:**
    *   Ensure you have correctly entered and saved your Gemini API Key in `Settings` > `Flux SEO Optimizer`.
    *   Verify your Gemini API key is active and has quota available.
    *   Check for any error messages from the Gemini API displayed in the tool, as they might provide more specific details.
*   **Other Issues:**
    *   Check your browser's developer console for JavaScript errors.
    *   Enable WordPress debugging (`WP_DEBUG` in `wp-config.php`) and check your server's PHP error logs for backend issues.

---

This basic documentation covers installation, configuration, usage of the implemented feature, and development/troubleshooting notes. It would be expanded as more features are added.
