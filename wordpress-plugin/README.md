
# Flux SEO Scribe Craft WordPress Plugin

## Complete AI-Powered SEO Optimization Suite

A comprehensive WordPress plugin that brings the full power of Flux SEO Scribe Craft directly to your WordPress dashboard. This plugin includes all features from the original React application, fully integrated with WordPress.

## 🚀 Features

### Content Analysis & Generation
- **AI Content Analyzer** - Real-time SEO analysis with scoring
- **Smart Content Generator** - AI-powered content creation with Gemini AI
- **Multi-language Support** - Full English and Thai language support
- **Content Quality Metrics** - Readability, keyword density, and SEO scoring

### SEO Tools Suite
- **Analytics Dashboard** - Comprehensive SEO performance tracking
- **Keyword Research** - Advanced keyword analysis and suggestions
- **Meta Tags Manager** - Automated meta tag optimization
- **Schema Markup Generator** - Structured data generation
- **Technical SEO Audit** - Complete technical SEO analysis
- **AI SEO Chatbot** - Interactive SEO assistant

### WordPress Integration
- **Admin Dashboard** - Full-featured admin interface
- **Shortcode Support** - Embed tools anywhere with `[flux_seo_scribe_craft]`
- **Content Saving** - Direct integration with WordPress posts
- **REST API Endpoints** - Full API integration
- **Database Integration** - Analytics and content storage

## 📦 Installation

### Method 1: Upload ZIP File
1. Download the plugin ZIP file
2. Go to WordPress Admin → Plugins → Add New → Upload Plugin
3. Choose the ZIP file and click "Install Now"
4. Activate the plugin

### Method 2: Manual Installation
1. Extract the plugin files
2. Upload the `flux-seo-scribe-craft` folder to `/wp-content/plugins/`
3. Activate the plugin through the WordPress admin

## ⚙️ Configuration

### API Key Setup
1. Go to WordPress Admin → Flux SEO → Settings
2. Enter your Gemini API key
3. Get your API key from: https://aistudio.google.com/app/apikey
4. Save settings

### Usage

#### Admin Dashboard
Access the full SEO suite:
```
WordPress Admin →  Flux SEO
```

#### Shortcode Usage
Embed anywhere on your site:
```html
[flux_seo_scribe_craft]
[flux_seo_scribe_craft height="600px" width="100%" tab="generator"]
```

**Shortcode Parameters:**
- `height` - Container height (default: 800px)
- `width` - Container width (default: 100%)
- `tab` - Default tab to show (analyzer, generator, analytics, etc.)

## 🎯 Available Tabs

1. **Content Analyzer** - Analyze existing content for SEO optimization
2. **Content Generator** - Generate AI-powered content with customizable parameters
3. **Analytics** - View SEO performance metrics and insights
4. **Keywords** - Research and manage target keywords
5. **Meta Tags** - Optimize meta descriptions and titles
6. **Schema** - Generate structured data markup
7. **Technical** - Perform technical SEO audits
8. **Chatbot** - Interactive AI SEO assistant

## 🔧 Technical Details

### System Requirements
- WordPress 5.0+
- PHP 7.4+
- Modern browser with JavaScript enabled
- Gemini API key for AI features

### File Structure
```
flux-seo-scribe-craft/
├── flux-seo-scribe-craft.php    # Main plugin file
├── assets/
│   ├── flux-seo-complete-app.js # Complete React application
│   └── flux-seo-styles.css      # All styling
├── README.md                     # This documentation
└── languages/                    # Translation files
```

### REST API Endpoints
- `POST /wp-json/flux-seo/v1/gemini-proxy` - Gemini AI proxy
- `POST /wp-json/flux-seo/v1/analyze-content` - Content analysis
- `POST /wp-json/flux-seo/v1/save-content` - Save generated content

### Database Tables
- `wp_flux_seo_analytics` - SEO analysis results and metrics

## 🌍 Language Support

The plugin supports both English and Thai languages with a built-in language switcher. All UI elements, messages, and content are fully translated.

## 🎨 Customization

### Styling
The plugin includes comprehensive CSS that works with any WordPress theme. Styles are responsive and optimized for both frontend and admin use.

### WordPress Admin Integration
- Custom admin menu with full dashboard
- Settings page for API configuration
- Native WordPress styling compatibility
- Responsive design for mobile admin

## 🔒 Security Features

- WordPress nonce verification
- Capability checks for user permissions
- Input sanitization and validation
- Secure API key storage
- CSRF protection on all forms

## 📊 Analytics & Reporting

Track your SEO performance with:
- Content analysis history
- SEO score tracking
- Keyword performance metrics
- Content generation analytics
- Usage statistics

## 🚀 Performance

- Optimized React application (766KB minified)
- Lazy loading for better performance
- CDN fallback for React libraries
- Efficient database queries
- Caching-friendly architecture

## 🆘 Support & Troubleshooting

### Common Issues

1. **API Key Errors**
   - Ensure you have a valid Gemini API key
   - Check the key is correctly entered in settings
   - Verify API key has appropriate permissions

2. **Loading Issues**
   - Check browser console for JavaScript errors
   - Ensure React libraries are loading correctly
   - Verify WordPress jQuery is available

3. **Content Not Saving**
   - Check user permissions for post creation
   - Verify database connections
   - Check for plugin conflicts

### Debug Mode
Enable WordPress debug mode for detailed error information:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

## 📄 License

This plugin is licensed under GPL v2 or later.

## 🔄 Updates

The plugin includes automatic update notifications. Always backup your site before updating.

## 🤝 Contributing

For bug reports, feature requests, or contributions, please contact the development team.

---

**Version:** 2.0.0  
**Tested up to:** WordPress 6.4  
**Requires PHP:** 7.4+  
**License:** GPL v2 or later  

Transform your WordPress SEO workflow with AI-powered content generation and comprehensive optimization tools!
