# Flux SEO Scribe Craft WordPress Plugin

A professional SEO optimization suite with integrated content generation and advanced analytics, embedded as a WordPress plugin.

## Description

Flux SEO Scribe Craft is a comprehensive SEO tool that provides:

- **Content Analysis**: Analyze your content for SEO optimization opportunities
- **Blog & Image Generator**: Generate SEO-optimized content and images
- **Advanced Analytics**: Track and monitor your SEO performance
- **Professional Advice**: Get actionable SEO recommendations

## Features

### Content Analyzer
- SEO score calculation
- Readability analysis
- Keyword density tracking
- Content suggestions and recommendations

### Integrated Content Generator
- AI-powered blog post generation
- SEO-optimized meta descriptions
- Keyword suggestions
- Image generation for content

### Advanced Analytics
- SEO performance tracking
- Content performance metrics
- Keyword ranking analysis
- Comprehensive reporting

## Installation

1. Upload the `flux-seo-scribe-craft` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Access the plugin from the WordPress admin menu under 'SEO Scribe Craft'

## Usage

### Admin Dashboard
After activation, you can access the full SEO suite from your WordPress admin dashboard:
1. Go to **SEO Scribe Craft** in the admin menu
2. Use the three main tabs:
   - **Content Analyzer**: Analyze existing content
   - **Blog & Image Generator**: Create new SEO content
   - **Advanced Analytics**: View performance metrics

### Shortcode Usage
You can embed the SEO tool on any page or post using the shortcode:

```
[flux_seo_scribe_craft]
```

#### Shortcode Parameters
- `height`: Set the height of the embedded tool (default: 800px)
- `width`: Set the width of the embedded tool (default: 100%)

Example:
```
[flux_seo_scribe_craft height="600px" width="90%"]
```

## File Structure

```
flux-seo-scribe-craft/
├── flux-seo-scribe-craft.php          # Main plugin file
├── flux-seo-scribe-craft.css          # Application styles
├── flux-seo-scribe-craft.js           # React application
├── flux-seo-wordpress-integration.js  # WordPress integration
├── install.php                        # Installation script
├── uninstall.php                      # Uninstallation script
├── favicon.ico                        # Plugin favicon
├── placeholder.svg                    # Placeholder image
└── README.md                          # This file
```

## Requirements

- WordPress 5.0 or higher
- PHP 7.4 or higher
- Modern web browser with JavaScript enabled

## Capabilities

The plugin adds the following capabilities:
- `manage_flux_seo`: Full plugin management (Administrators)
- `generate_seo_content`: Content generation access (Editors, Authors)
- `view_seo_analytics`: Analytics viewing (Editors)

## Database Tables

The plugin creates the following database tables:
- `wp_flux_seo_analysis`: Stores SEO analysis results
- `wp_flux_seo_generated_content`: Stores generated content
- `wp_flux_seo_settings`: Plugin configuration settings

## AJAX Integration

The plugin integrates with WordPress AJAX for:
- Content analysis requests
- Content generation
- Analytics data retrieval
- Settings management

## Security Features

- Nonce verification for all AJAX requests
- Capability checks for user permissions
- Sanitized input/output
- Protected file directories

## Hooks and Filters

### Actions
- `flux_seo_daily_cleanup`: Daily maintenance tasks
- `flux_seo_weekly_analytics`: Weekly analytics updates

### Filters
- `flux_seo_analysis_data`: Modify analysis results
- `flux_seo_generated_content`: Modify generated content
- `flux_seo_settings`: Modify plugin settings

## Customization

### CSS Customization
You can override the plugin styles by adding CSS to your theme:

```css
.flux-seo-container {
    /* Your custom styles */
}
```

### JavaScript Hooks
The plugin provides JavaScript hooks for customization:

```javascript
// Access the WordPress integration object
window.FluxSEOWordPress.init();

// Custom AJAX handling
window.FluxSEOWordPress.wordpressAjaxCall(url, options);
```

## Troubleshooting

### Common Issues

1. **Plugin not loading**: Ensure JavaScript is enabled and there are no console errors
2. **AJAX errors**: Check that WordPress AJAX is properly configured
3. **Styling issues**: Verify that CSS files are loading correctly

### Debug Mode
Enable WordPress debug mode to see detailed error messages:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

## Support

For support and bug reports, please visit the plugin repository or contact the development team.

## Features Tested

✅ React application renders correctly in WordPress environment  
✅ Thai language support working properly  
✅ Content analysis functionality operational  
✅ WordPress shortcode integration  
✅ Admin page integration  
✅ Responsive design  
✅ CDN-based React loading for reliability  
✅ No service worker conflicts  

## Technical Details

- Built with React 18.3.1
- Uses WordPress AJAX for backend communication
- WordPress-compatible build process using Vite
- IIFE format for WordPress compatibility
- External React dependencies loaded from CDN

## Changelog

### Version 1.0.0
- Initial release
- Complete SEO suite integration
- WordPress admin dashboard
- Shortcode support
- AJAX integration
- React 18.3.1 integration
- Thai language support
- WordPress-compatible build system

## License

This plugin is licensed under the GPL v2 or later.

## Credits

Based on the Flux SEO Scribe Craft application developed with React, TypeScript, and modern web technologies.