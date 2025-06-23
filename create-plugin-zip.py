#!/usr/bin/env python3
"""
Flux SEO Scribe Craft WordPress Plugin ZIP Creator
Creates a complete WordPress plugin ZIP file ready for installation
"""

import os
import zipfile
import shutil
from datetime import datetime

def create_plugin_zip():
    """Create a complete WordPress plugin ZIP file"""
    
    # Plugin information
    plugin_name = "flux-seo-scribe-craft"
    plugin_version = "2.0.0"
    zip_filename = f"{plugin_name}-wordpress-plugin.zip"
    
    # Source directory (wordpress-plugin folder)
    source_dir = "wordpress-plugin"
    
    # Check if source directory exists
    if not os.path.exists(source_dir):
        print(f"❌ Error: {source_dir} directory not found!")
        return False
    
    # Required files list
    required_files = [
        "flux-seo-scribe-craft.php",
        "flux-seo-scribe-craft.css", 
        "flux-seo-wordpress-app.js",
        "wordpress-overrides.css",
        "README.md"
    ]
    
    # Check for required files
    missing_files = []
    for file in required_files:
        if not os.path.exists(os.path.join(source_dir, file)):
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ Error: Missing required files: {', '.join(missing_files)}")
        return False
    
    print(f"🚀 Creating WordPress plugin ZIP: {zip_filename}")
    print(f"📁 Source directory: {source_dir}")
    
    try:
        # Create ZIP file
        with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
            
            # Add all files from wordpress-plugin directory
            for root, dirs, files in os.walk(source_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    # Create archive name (remove wordpress-plugin prefix, add plugin folder)
                    archive_name = os.path.join(plugin_name, os.path.relpath(file_path, source_dir))
                    zipf.write(file_path, archive_name)
                    print(f"✅ Added: {archive_name}")
            
            # Add plugin info file
            plugin_info = f"""=== Flux SEO Scribe Craft ===
Contributors: fluxseo
Tags: seo, content, ai, optimization, analytics
Requires at least: 5.0
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: {plugin_version}
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Professional SEO optimization suite with integrated content generation and advanced analytics.

== Description ==

Flux SEO Scribe Craft is a comprehensive WordPress plugin that embeds a powerful React-based SEO optimization suite directly into your WordPress dashboard. 

Features:
* Content Analyzer with real-time SEO scoring
* AI-powered blog and content generator
* Advanced analytics and performance tracking
* WordPress admin integration
* Shortcode support for frontend embedding
* Responsive design for all devices

== Installation ==

1. Upload the plugin files to `/wp-content/plugins/flux-seo-scribe-craft/`
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Navigate to 'SEO Scribe Craft' in your WordPress admin menu
4. Use [flux_seo_scribe_craft] shortcode to embed on pages/posts

== Frequently Asked Questions ==

= Does this plugin work with all themes? =
Yes, the plugin is designed to work with any WordPress theme.

= Is the plugin mobile-friendly? =
Yes, the interface is fully responsive and optimized for mobile devices.

== Screenshots ==

1. Main dashboard with SEO analysis tools
2. Content analyzer interface
3. Blog generator with AI-powered content creation
4. Advanced analytics dashboard

== Changelog ==

= {plugin_version} =
* Initial release
* Content analyzer functionality
* Blog and image generator
* Advanced analytics dashboard
* WordPress admin integration
* Shortcode support

== Upgrade Notice ==

= {plugin_version} =
Initial release of Flux SEO Scribe Craft plugin.

Created on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""
            
            zipf.writestr(f"{plugin_name}/readme.txt", plugin_info)
            print(f"✅ Added: {plugin_name}/readme.txt")
        
        # Get file size
        file_size = os.path.getsize(zip_filename)
        file_size_mb = file_size / (1024 * 1024)
        
        print(f"\n🎉 SUCCESS! WordPress plugin ZIP created successfully!")
        print(f"📦 File: {zip_filename}")
        print(f"📏 Size: {file_size_mb:.2f} MB ({file_size:,} bytes)")
        print(f"🗂️  Plugin folder: {plugin_name}/")
        
        print(f"\n📋 Installation Instructions:")
        print(f"1. Go to WordPress Admin > Plugins > Add New > Upload Plugin")
        print(f"2. Choose {zip_filename} and click 'Install Now'")
        print(f"3. Click 'Activate Plugin'")
        print(f"4. Navigate to 'SEO Scribe Craft' in WordPress admin menu")
        print(f"5. Use [flux_seo_scribe_craft] shortcode on pages/posts")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating ZIP file: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Flux SEO Scribe Craft - WordPress Plugin ZIP Creator")
    print("=" * 60)
    
    success = create_plugin_zip()
    
    if success:
        print("\n✅ Plugin ZIP creation completed successfully!")
        print("🎯 Ready for WordPress installation!")
    else:
        print("\n❌ Plugin ZIP creation failed!")
        exit(1)