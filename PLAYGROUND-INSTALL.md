# WordPress Playground Installation Guide for Flux SEO Scribe Craft

## Quick Installation Steps

### Method 1: Using Plugin Editor

1. **Access WordPress Playground**
   - Go to [WordPress Playground](https://playground.wordpress.net/)
   - Wait for WordPress to load

2. **Create Plugin File**
   - In WordPress Playground, go to **Plugins → Plugin Editor**
   - Click "Select plugin to edit" and choose "Create New"
   - Name your plugin "Flux SEO Scribe Craft"

3. **Add Main Plugin File**
   - Copy the entire content of `flux-seo-scribe-craft.php` from this repository
   - Paste it into the plugin editor
   - Click "Update File"

4. **Activate the Plugin**
   - Go to **Plugins → Installed Plugins**
   - Find "Flux SEO Scribe Craft"
   - Click "Activate"

### Method 2: Using Minimal Version (Recommended for Playground)

For better compatibility with WordPress Playground's limitations:

1. **Create a Minimal Plugin File**
   - In WordPress Playground, go to **Plugins → Plugin Editor**
   - Click "Select plugin to edit" and choose "Create New"
   - Name your plugin "Flux SEO Minimal"
   - Copy the content of `flux-seo-minimal.php` into the editor
   - Click "Update File"

2. **Add CSS File**
   - Create a new file named `flux-seo-style.css`
   - Copy the content from the provided CSS file
   - Click "Update File"

3. **Activate the Plugin**
   - Go to **Plugins → Installed Plugins**
   - Find "Flux SEO Minimal"
   - Click "Activate"

## Testing the Plugin

### 1. Access the Dashboard
- Go to **Flux SEO** in the WordPress admin menu
- You should see the main dashboard with the Content Analyzer, Blog Generator, and Analytics tabs

### 2. Test Content Analyzer
- Go to the Content Analyzer tab
- Paste some content into the text area
- Click "Analyze Content"
- You should see SEO analysis results

### 3. Test Blog Generator
- Go to the Blog Generator tab
- Enter a topic in the input field
- Click "Generate Content"
- You should see AI-generated content

### 4. Test Shortcode
- Create a new page or post
- Add the shortcode: `[flux_seo_scribe_craft]` or `[flux_seo]` (for minimal version)
- Preview the page to see the SEO tools embedded

## Troubleshooting

### Common Issues in WordPress Playground

1. **Script Loading Issues**
   - WordPress Playground has limited resources
   - Some scripts may take longer to load
   - Try refreshing the page if the app doesn't load

2. **API Key Limitations**
   - Gemini API calls may not work in the Playground environment
   - The plugin will fall back to mock data for demonstrations

3. **Storage Limitations**
   - WordPress Playground has limited storage
   - Large plugins may encounter issues

### Using the Minimal Version

If you encounter issues with the full plugin, the minimal version (`flux-seo-minimal.php`) is specifically designed for WordPress Playground:
- Smaller file size
- Fewer dependencies
- Simpler functionality
- No external API calls
- Optimized for Playground's limitations

## Expected Results

After successful installation, you should see:

1. **Admin Menu**: "Flux SEO" in WordPress admin
2. **Dashboard**: Overview with tabs for different tools
3. **Content Analyzer**: Tool for analyzing content SEO
4. **Blog Generator**: Tool for generating SEO-optimized content
5. **Analytics**: SEO performance metrics

The plugin is designed to work in the limited WordPress Playground environment, with fallbacks for features that may not be fully supported.