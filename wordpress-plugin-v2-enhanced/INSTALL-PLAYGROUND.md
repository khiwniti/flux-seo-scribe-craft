# WordPress Playground Installation Guide

## Quick Installation Steps

### Method 1: Direct File Upload

1. **Access WordPress Playground**
   - Go to [WordPress Playground](https://playground.wordpress.net/)
   - Wait for WordPress to load

2. **Upload Plugin Files**
   - In the playground, go to **Plugins → Add New → Upload Plugin**
   - Since we don't have a zip file, we'll use the manual method

3. **Manual Installation**
   - Open the file manager in WordPress Playground
   - Navigate to `/wp-content/plugins/`
   - Create a new folder called `flux-seo-scribe-craft`
   - Upload these files to the folder:
     - `flux-seo-scribe-craft.php`
     - `dist/` folder with all its contents
     - `README.md`

### Method 2: Code Copy-Paste

1. **Create Plugin File**
   - In WordPress Playground, go to **Plugins → Plugin Editor**
   - Create a new plugin file: `flux-seo-scribe-craft/flux-seo-scribe-craft.php`
   - Copy and paste the entire PHP code from `flux-seo-scribe-craft.php`

2. **Add Assets**
   - Create the `dist` folder structure
   - Copy the JavaScript and CSS files

### Method 3: GitHub Integration (Recommended)

1. **Use GitHub Repository**
   - Upload the plugin to a GitHub repository
   - Use WordPress Playground's GitHub integration
   - Import the repository directly

## Testing the Plugin

### 1. Activate the Plugin
- Go to **Plugins → Installed Plugins**
- Find "Flux SEO Scribe Craft"
- Click **Activate**

### 2. Configure API Key
- Go to **Flux SEO → Settings** in the admin menu
- Enter your Google Gemini API key: `AIzaSyDTITCw_UcgzUufrsCFuxp9HXri6Y0XrDo`
- Save settings

### 3. Test Features

#### Test Blog Generator
1. Go to **Flux SEO → Dashboard**
2. Click "Create New Content"
3. Enter a topic like "How to improve website SEO"
4. Select language (English or Thai)
5. Click "Generate Blog"
6. Review the generated content

#### Test SEO Optimizer
1. Create a new post or page
2. Add the shortcode: `[flux_seo_app]`
3. Enter some content
4. Click "Generate SEO"
5. Review SEO suggestions

#### Test Content Improvement
1. Use the main component
2. Paste existing content
3. Click "Improve Content"
4. See AI-enhanced version

### 4. Verify Functionality

Check these features work:
- ✅ Plugin activates without errors
- ✅ Admin menu appears
- ✅ Settings page loads
- ✅ Shortcodes render React components
- ✅ API calls to Gemini work
- ✅ Content generation functions
- ✅ SEO analysis works
- ✅ Multi-language support (EN/TH)

## Troubleshooting

### Common Issues

1. **Plugin doesn't activate**
   - Check PHP error logs
   - Ensure all files are uploaded correctly
   - Verify file permissions

2. **React components don't load**
   - Check browser console for JavaScript errors
   - Verify dist files are accessible
   - Check WordPress admin-ajax.php is working

3. **API calls fail**
   - Verify Gemini API key is correct
   - Check internet connectivity
   - Review API quotas and limits

4. **Styling issues**
   - Check if CSS files are loading
   - Verify no theme conflicts
   - Clear browser cache

### Debug Mode

Enable WordPress debug mode:
1. In WordPress Playground, edit `wp-config.php`
2. Add these lines:
   ```php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   define('WP_DEBUG_DISPLAY', false);
   ```
3. Check `/wp-content/debug.log` for errors

## Expected Results

After successful installation, you should see:

1. **Admin Menu**: "Flux SEO" in WordPress admin
2. **Dashboard**: Overview with stats and quick actions
3. **Settings Page**: API configuration options
4. **Content Tools**: Blog generator and SEO optimizer
5. **Shortcode Support**: `[flux_seo_app]` works on frontend

## Demo Content

Try these test scenarios:

### English Content
- Topic: "Best SEO practices for WordPress"
- Keywords: "SEO, WordPress, optimization"
- Tone: Professional

### Thai Content
- Topic: "วิธีการทำ SEO สำหรับเว็บไซต์"
- Keywords: "SEO, เว็บไซต์, การตลาดดิจิทัล"
- Tone: เป็นมิตร (Friendly)

## Performance Notes

- Initial load may take 10-15 seconds for AI generation
- Large content (2000+ words) may take longer
- API rate limits apply (check Gemini quotas)
- Cache responses when possible for better performance

## Support

If you encounter issues:
1. Check browser console for errors
2. Review WordPress error logs
3. Verify API key and quotas
4. Test with simple content first
5. Check network connectivity

The plugin is designed to work seamlessly in WordPress Playground with full AI functionality powered by Google Gemini 2.0 Flash.