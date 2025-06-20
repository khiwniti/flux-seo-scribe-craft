# Flux SEO Scribe Craft - WordPress Plugin

A powerful WordPress plugin that integrates Google Gemini 2.0 Flash AI to provide intelligent SEO content creation and optimization tools. Supports both English and Thai languages with advanced AI-powered features.

## Features

### 🤖 AI-Powered Content Generation
- **Blog Post Generator**: Create comprehensive, SEO-optimized blog posts from just a topic
- **Content Improvement**: Enhance existing content for better SEO and readability
- **SEO Optimization**: Generate meta titles, descriptions, and keyword suggestions
- **Keyword Research**: AI-powered keyword generation and analysis

### 🌐 Multi-Language Support
- **English & Thai**: Full support for both languages with proper grammar and cultural context
- **No Translation**: Content is generated natively in the selected language
- **Cultural Awareness**: AI understands cultural nuances for each language

### 📊 Advanced SEO Features
- **SEO Score Analysis**: Real-time scoring and improvement suggestions
- **Meta Tag Generation**: Optimized titles and descriptions
- **Keyword Density Analysis**: Proper keyword distribution
- **Internal Link Suggestions**: AI-powered linking recommendations
- **Readability Analysis**: Content readability scoring and improvements

### 🎯 Content Types
- **Blog Posts**: Full-length articles with proper structure
- **SEO Content**: Optimized content for search engines
- **Content Outlines**: Structured content planning
- **Keyword Lists**: Comprehensive keyword research

## Installation

### Prerequisites
- WordPress 5.0 or higher
- PHP 7.4 or higher
- Node.js 16+ (for development)
- npm or yarn (for development)

### Quick Installation

1. **Download the Plugin**
   ```bash
   git clone https://github.com/your-repo/flux-seo-scribe-craft.git
   cd flux-seo-scribe-craft
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Plugin**
   ```bash
   npm run build
   ```

4. **Upload to WordPress**
   - Copy the entire plugin folder to `/wp-content/plugins/`
   - Or zip the folder and upload via WordPress admin

5. **Activate the Plugin**
   - Go to WordPress Admin → Plugins
   - Find "Flux SEO Scribe Craft" and click "Activate"

### Development Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/your-repo/flux-seo-scribe-craft.git
   cd flux-seo-scribe-craft
   npm install
   ```

2. **Development Mode**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Configuration

### Google Gemini API Setup

1. **Get API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key for Gemini 2.0 Flash

2. **Configure in WordPress**
   - Go to WordPress Admin → Flux SEO → Settings
   - Enter your Gemini API key
   - Save settings

### Plugin Settings

Navigate to **WordPress Admin → Flux SEO → Settings** to configure:

- **API Key**: Your Google Gemini API key
- **Default Language**: Choose between English (en) or Thai (th)
- **Content Length**: Default word count for generated content
- **Writing Tone**: Default tone for content generation
- **Auto-optimization**: Enable automatic SEO optimization
- **Analytics**: Enable performance tracking

## Usage

### 1. Blog Post Generation

1. **Access the Generator**
   - Go to WordPress Admin → Flux SEO → Dashboard
   - Click "Create New Content" or use shortcode `[flux_seo_app component="blog-generator"]`

2. **Configure Your Blog Post**
   - **Topic**: Enter your blog post topic
   - **Language**: Select English or Thai
   - **Word Count**: Choose desired length (500-3000 words)
   - **Tone**: Select writing style (professional, casual, friendly, etc.)
   - **Keywords**: Add focus keywords (comma-separated)
   - **Target Audience**: Specify your audience

3. **Generate Content**
   - Click "Generate Blog" button
   - Wait for AI to create your content
   - Review and edit the generated content
   - Save as WordPress post

### 2. SEO Content Optimization

1. **Use the Main Component**
   - Add shortcode `[flux_seo_app]` to any page/post
   - Or access via WordPress Admin → Flux SEO

2. **Optimize Existing Content**
   - Paste your content in the editor
   - Select language (English/Thai)
   - Click "Generate SEO" for optimization suggestions
   - Click "Improve Content" for content enhancement

3. **Review Results**
   - SEO-optimized title and meta description
   - Keyword suggestions and density analysis
   - Content improvement recommendations
   - Internal linking suggestions

### 3. Shortcode Usage

#### Basic Content Editor
```php
[flux_seo_app]
```

#### Blog Generator
```php
[flux_seo_app component="blog-generator"]
```

#### SEO Generator
```php
[flux_seo_app component="seo-generator"]
```

#### Content Editor
```php
[flux_seo_app component="content-editor" props='{"postId": 123}']
```

#### Analytics Dashboard
```php
[flux_seo_app component="analytics"]
```

### 4. Admin Interface

#### Dashboard
- **Quick Stats**: Overview of your SEO performance
- **Recent Activity**: Latest content generation activities
- **Quick Actions**: Fast access to common tasks
- **SEO Tools**: Access to all plugin features

#### Content Manager
- **Post Overview**: List all posts with SEO scores
- **Bulk Optimization**: Optimize multiple posts at once
- **Performance Tracking**: Monitor SEO improvements
- **Filter Options**: Sort by SEO status and scores

#### Analytics
- **Performance Metrics**: Track SEO improvements over time
- **Keyword Performance**: Monitor keyword rankings
- **Content Insights**: Analyze content effectiveness
- **Recommendations**: AI-powered improvement suggestions

## API Integration

### Google Gemini 2.0 Flash Features

The plugin leverages Google's most advanced AI model:

- **Advanced Language Understanding**: Better context comprehension
- **Multimodal Capabilities**: Text and image processing
- **Improved Reasoning**: Better content structure and flow
- **Cultural Awareness**: Proper localization for Thai content
- **Safety Features**: Built-in content safety filters

### API Endpoints

The plugin creates several WordPress AJAX endpoints:

- `wp_ajax_flux_seo_api` - Main API endpoint
- Actions: `generate_seo`, `generate_blog_post`, `improve_content`, `generate_keywords`

## Customization

### Extending Components

1. **Add New Components**
   ```jsx
   // src/components/YourComponent.jsx
   import React from 'react'
   import { useWordPress } from '../utils/wordpress-context'
   
   const YourComponent = () => {
     const { apiCall } = useWordPress()
     // Your component logic
     return <div>Your Component</div>
   }
   
   export default YourComponent
   ```

2. **Register in App.jsx**
   ```jsx
   import YourComponent from './YourComponent'
   
   // Add to renderComponent switch
   case 'your-component':
     return <YourComponent {...props} />
   ```

### Custom Styling

1. **Override CSS**
   ```css
   .flux-seo-app .your-custom-class {
     /* Your styles */
   }
   ```

2. **Add to Theme**
   ```php
   // In your theme's functions.php
   function custom_flux_seo_styles() {
     wp_enqueue_style('custom-flux-seo', get_template_directory_uri() . '/css/flux-seo-custom.css');
   }
   add_action('wp_enqueue_scripts', 'custom_flux_seo_styles');
   ```

### Custom AI Prompts

Modify the Gemini AI service to customize prompts:

```javascript
// src/services/gemini-ai.js
// Customize prompts in the generateBlogPost method
const customPrompt = `Your custom prompt here...`
```

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify your Gemini API key is correct
   - Check API quotas and billing
   - Ensure the key has proper permissions

2. **Content Not Generating**
   - Check browser console for errors
   - Verify WordPress AJAX is working
   - Check server error logs

3. **Styling Issues**
   - Clear browser cache
   - Check for CSS conflicts
   - Verify plugin assets are loading

4. **Language Issues**
   - Ensure proper language selection
   - Check character encoding (UTF-8)
   - Verify font support for Thai characters

### Debug Mode

Enable debug mode in WordPress:

```php
// wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

Check logs in `/wp-content/debug.log`

## Performance

### Optimization Tips

1. **Caching**
   - Use WordPress caching plugins
   - Cache API responses when possible
   - Optimize database queries

2. **API Usage**
   - Monitor Gemini API usage
   - Implement rate limiting
   - Use appropriate token limits

3. **Frontend Performance**
   - Lazy load components
   - Minimize bundle size
   - Use CDN for assets

## Security

### Best Practices

1. **API Key Security**
   - Store API keys securely
   - Use environment variables
   - Rotate keys regularly

2. **Content Validation**
   - Sanitize all inputs
   - Validate AI-generated content
   - Use WordPress security functions

3. **User Permissions**
   - Restrict access to appropriate user roles
   - Implement capability checks
   - Audit user actions

## Contributing

### Development Workflow

1. **Fork the Repository**
2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature
   ```
3. **Make Changes**
4. **Test Thoroughly**
5. **Submit Pull Request**

### Code Standards

- Follow WordPress coding standards
- Use ESLint for JavaScript
- Write comprehensive tests
- Document all functions

## License

This plugin is licensed under the GPL v2 or later.

## Support

### Documentation
- [Plugin Documentation](https://your-docs-site.com)
- [WordPress Codex](https://codex.wordpress.org/)
- [Google Gemini API Docs](https://ai.google.dev/docs)

### Community
- [GitHub Issues](https://github.com/your-repo/flux-seo-scribe-craft/issues)
- [WordPress Support Forum](https://wordpress.org/support/)
- [Discord Community](https://discord.gg/your-discord)

### Professional Support
For professional support and custom development, contact: support@your-domain.com

## Changelog

### Version 2.0.0
- Initial release with Gemini 2.0 Flash integration
- Multi-language support (English/Thai)
- Advanced SEO optimization features
- Blog post generation
- Content improvement tools
- Comprehensive admin interface

---

**Made with ❤️ for the WordPress community**