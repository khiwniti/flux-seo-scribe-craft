
<?php
/**
 * Uninstall script for Flux SEO Scribe Craft Plugin
 */

// Prevent direct access
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

/**
 * Remove database tables
 */
function flux_seo_remove_tables() {
    global $wpdb;
    
    // List of tables to remove
    $tables = array(
        $wpdb->prefix . 'flux_seo_generation_history',
        $wpdb->prefix . 'flux_seo_analytics'
    );
    
    foreach ($tables as $table) {
        $wpdb->query("DROP TABLE IF EXISTS $table");
    }
}

/**
 * Remove plugin options
 */
function flux_seo_remove_options() {
    // List of options to remove
    $options = array(
        'flux_seo_version',
        'flux_seo_settings',
        'flux_seo_gemini_api_key',
        'flux_seo_installed',
        'flux_seo_installation_date'
    );
    
    foreach ($options as $option) {
        delete_option($option);
    }
}

/**
 * Remove uploaded files and directories
 */
function flux_seo_remove_files() {
    $upload_dir = wp_upload_dir();
    $flux_seo_dir = $upload_dir['basedir'] . '/flux-seo-scribe-craft';
    
    if (file_exists($flux_seo_dir)) {
        flux_seo_recursive_delete($flux_seo_dir);
    }
}

/**
 * Recursively delete directory and its contents
 */
function flux_seo_recursive_delete($dir) {
    if (!is_dir($dir)) {
        return false;
    }
    
    $files = array_diff(scandir($dir), array('.', '..'));
    
    foreach ($files as $file) {
        $path = $dir . DIRECTORY_SEPARATOR . $file;
        if (is_dir($path)) {
            flux_seo_recursive_delete($path);
        } else {
            unlink($path);
        }
    }
    
    return rmdir($dir);
}

// Execute uninstallation functions
flux_seo_remove_tables();
flux_seo_remove_options();
flux_seo_remove_files();
