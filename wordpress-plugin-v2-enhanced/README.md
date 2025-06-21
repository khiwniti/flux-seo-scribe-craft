# Flux SEO Scribe Craft v2.0 Enhanced

**Description:**
Flux SEO Scribe Craft v2.0 Enhanced is a professional SEO optimization suite for WordPress. It features a modern React-based user interface, AI-powered content generation using Google's Gemini API, advanced content analysis, an AI chatbot for SEO queries, an AI image prompt generator, and more. This plugin helps you streamline your SEO workflow and create high-quality, optimized content.

**Plugin Version:** 2.0.1 (Corresponds to `flux-seo-scribe-craft-v2.php` version)
**WordPress Version Required:** 5.0 or higher
**PHP Version Required:** 7.4 or higher

## Features:

*   **SEO Dashboard:** Centralized interface for accessing all SEO tools and insights (React-based).
*   **AI Content Generation:** Create various types of content (blog posts, articles) with AI assistance, powered by Google Gemini.
*   **SEO Content Analyzer:** Analyze your existing or new content for SEO effectiveness, receiving scores and actionable suggestions via Gemini.
*   **AI Chatbot:** Get quick answers to your SEO-related questions from an AI assistant.
*   **AI Image Prompt Generator:** Generate detailed text prompts for text-to-image models based on your input text.
*   **Content Generation History:** View a list of recently generated content items.
*   **Gemini API Key Configuration:** Securely save and manage your Google Gemini API key.
*   **Shortcode Integration:** Embed the Flux SEO Scribe Craft application on your website's frontend pages or posts using the `[flux_seo_scribe_craft]` shortcode.

## Requirements:

*   WordPress version 5.0 or higher.
*   PHP version 7.4 or higher.
*   A valid Google Gemini API Key. You can obtain one from [Google AI Studio](https://aistudio.google.com/app).

## Installation:

1.  **Download:** Obtain the plugin ZIP file (e.g., `flux-seo-scribe-craft-v2-enhanced.zip`).
2.  **Upload to WordPress:**
    *   In your WordPress admin panel, navigate to **Plugins > Add New**.
    *   Click the **Upload Plugin** button at the top of the page.
    *   Choose the downloaded ZIP file and click **Install Now**.
3.  **Activate:** Once installed, click **Activate Plugin**.

## Configuration:

1.  After activation, navigate to the **SEO Scribe Craft** menu item in your WordPress admin sidebar.
2.  Go to the **Settings** tab (or submenu, depending on final UI structure).
3.  Enter your **Google Gemini API Key** in the provided field.
4.  Click **Save API Key**. The key is stored securely on your server.

## Usage:

### Admin Interface:
Access all features (Dashboard, Content Generator, Content Analyzer, Chatbot, Image Prompt Generator, Settings, History) from the "SEO Scribe Craft" menu in the WordPress admin area.

### Shortcode:
To embed the application on a frontend page or post, use the shortcode:
`[flux_seo_scribe_craft]`

You can customize its appearance using attributes:
`[flux_seo_scribe_craft height="1000px" width="100%"]`

The `mode` attribute can also be used if different views are supported via the shortcode (e.g., `mode="content-generator"`).

## Troubleshooting:

*   **API Key Issues:**
    *   "Ensure your Gemini API key is correctly entered in the Settings tab and is valid."
    *   "If AI features are not working, check if the API key has sufficient quota or correct permissions from Google AI Studio."
    *   Error messages like "API Key is invalid or missing" indicate an issue with the key setup.
*   **Content Generation Errors:**
    *   "If content generation fails, try a different topic or ensure your API key is active and has not exceeded its usage limits."
    *   Check error notifications for more details from the API.
*   **Plugin Not Loading or UI Issues:**
    *   "Ensure the plugin is activated."
    *   "Check for conflicts with other plugins or your theme. Try deactivating other plugins temporarily to identify conflicts."
    *   "Open your browser's developer console (usually F12) and check for JavaScript errors."
    *   "Ensure your WordPress and PHP versions meet the plugin requirements."

## Developer Notes:

*   **Main Plugin File:** `wordpress-plugin-v2-enhanced/flux-seo-scribe-craft-v2.php`
*   **Compiled Assets:** Frontend assets (JS/CSS) are located in `wordpress-plugin-v2-enhanced/dist/`.
*   **Source Code (React App):** The React application source code is in the `src/` directory at the root of the project.
*   **Build Process:** To modify or rebuild the frontend assets for this WordPress plugin version:
    1.  Navigate to the root project directory (containing `package.json`, `vite.config.wordpress.ts`).
    2.  Run `npm install` (if you haven't already or dependencies changed).
    3.  Run `npm run build:wordpress`. This will compile the React app using `vite.config.wordpress.ts` and place the output in `wordpress-plugin-v2-enhanced/dist/`.
*   **Key Configuration File for Build:** `vite.config.wordpress.ts`

This README provides a comprehensive guide for users and developers of Flux SEO Scribe Craft v2.0 Enhanced.
