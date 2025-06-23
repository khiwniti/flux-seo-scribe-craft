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
    plugin_version = "1.0.0"
    zip_filename = f"{plugin_name}.zip"
    
    # Source directory (wordpress-plugin folder)
    source_dir = "wordpress-plugin"
    
    # Check if source directory exists
    if not os.path.exists(source_dir):
        print(f"❌ Error: {source_dir} directory not found!")
        return False
    
    # Required files list
    required_files = [
        "flux-seo-scribe-craft.php",
        "readme.txt",
        "assets/css/admin.css",
        "assets/js/admin.js"
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
        
        # Get file size
        file_size = os.path.getsize(zip_filename)
        file_size_kb = file_size / 1024
        
        print(f"\n🎉 SUCCESS! WordPress plugin ZIP created successfully!")
        print(f"📦 File: {zip_filename}")
        print(f"📏 Size: {file_size_kb:.2f} KB ({file_size:,} bytes)")
        print(f"🗂️ Plugin folder: {plugin_name}/")
        
        print(f"\n📋 Installation Instructions:")
        print(f"1. Go to WordPress Admin > Plugins > Add New > Upload Plugin")
        print(f"2. Choose {zip_filename} and click 'Install Now'")
        print(f"3. Click 'Activate Plugin'")
        print(f"4. Navigate to 'Flux SEO' in WordPress admin menu")
        
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