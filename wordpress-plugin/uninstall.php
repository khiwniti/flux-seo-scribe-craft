<?php
/**
 * Uninstall script for Flux SEO Scribe Craft Plugin
 * 
 * This file is executed when the plugin is uninstalled (deleted)
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
        $wpdb->prefix . 'flux_seo_analysis',
        $wpdb->prefix . 'flux_seo_generated_content',
        $wpdb->prefix . 'flux_seo_settings'
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
        'flux_seo_api_settings',
        'flux_seo_usage_stats',
        'flux_seo_installation_log',
        'flux_seo_installed',
        'flux_seo_installation_date'
    );
    
    foreach ($options as $option) {
        delete_option($option);
    }
    
    // Remove any options with flux_seo prefix
    $wpdb = $GLOBALS['wpdb'];
    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE 'flux_seo_%'");
}

/**
 * Remove transients and cached data
 */
function flux_seo_remove_transients() {
    global $wpdb;
    
    // Remove all transients related to the plugin
    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_flux_seo_%'");
    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_timeout_flux_seo_%'");
    
    // Remove site transients
    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_site_transient_flux_seo_%'");
    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_site_transient_timeout_flux_seo_%'");
}

/**
 * Remove user meta data
 */
function flux_seo_remove_user_meta() {
    global $wpdb;
    
    // Remove user meta data related to the plugin
    $wpdb->query("DELETE FROM {$wpdb->usermeta} WHERE meta_key LIKE 'flux_seo_%'");
}

/**
 * Remove post meta data
 */
function flux_seo_remove_post_meta() {
    global $wpdb;
    
    // Remove post meta data related to the plugin
    $wpdb->query("DELETE FROM {$wpdb->postmeta} WHERE meta_key LIKE 'flux_seo_%'");
}

/**
 * Remove custom capabilities
 */
function flux_seo_remove_capabilities() {
    // Remove capabilities from all roles
    $roles = array('administrator', 'editor', 'author');
    
    foreach ($roles as $role_name) {
        $role = get_role($role_name);
        if ($role) {
            $role->remove_cap('manage_flux_seo');
            $role->remove_cap('generate_seo_content');
            $role->remove_cap('view_seo_analytics');
        }
    }
}

/**
 * Remove scheduled cron jobs
 */
function flux_seo_remove_cron_jobs() {
    // Remove scheduled events
    wp_clear_scheduled_hook('flux_seo_daily_cleanup');
    wp_clear_scheduled_hook('flux_seo_weekly_analytics');
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

/**
 * Clean up WordPress cache
 */
function flux_seo_cleanup_cache() {
    // Clear WordPress object cache
    if (function_exists('wp_cache_flush')) {
        wp_cache_flush();
    }
    
    // Clear any third-party caches if available
    if (function_exists('w3tc_flush_all')) {
        w3tc_flush_all();
    }
    
    if (function_exists('wp_rocket_clean_domain')) {
        wp_rocket_clean_domain();
    }
    
    if (function_exists('sg_cachepress_purge_cache')) {
        sg_cachepress_purge_cache();
    }
}

/**
 * Log uninstallation
 */
function flux_seo_log_uninstallation() {
    $log_data = array(
        'timestamp' => current_time('mysql'),
        'wp_version' => get_bloginfo('version'),
        'php_version' => PHP_VERSION,
        'site_url' => get_site_url(),
        'admin_email' => get_option('admin_email')
    );
    
    // Log to WordPress error log
    error_log('Flux SEO Scribe Craft Plugin: Uninstallation started - ' . json_encode($log_data));
    
    // Send uninstallation notification (optional)
    $subject = 'Flux SEO Scribe Craft Plugin Uninstalled';
    $message = "The Flux SEO Scribe Craft plugin has been uninstalled from your WordPress site.\n\n";
    $message .= "Site: " . get_site_url() . "\n";
    $message .= "Time: " . current_time('mysql') . "\n\n";
    $message .= "All plugin data, including database tables, options, and uploaded files, have been removed.\n";
    $message .= "Thank you for using Flux SEO Scribe Craft!\n";
    
    // Uncomment the line below if you want to send email notifications
    // wp_mail(get_option('admin_email'), $subject, $message);
}

// Check if this is a multisite installation
if (is_multisite()) {
    // Handle multisite uninstallation
    $blog_ids = get_sites(array('fields' => 'ids'));
    
    foreach ($blog_ids as $blog_id) {
        switch_to_blog($blog_id);
        
        // Execute uninstallation for each site
        flux_seo_log_uninstallation();
        flux_seo_remove_cron_jobs();
        flux_seo_remove_capabilities();
        flux_seo_remove_post_meta();
        flux_seo_remove_user_meta();
        flux_seo_remove_transients();
        flux_seo_remove_options();
        flux_seo_remove_tables();
        flux_seo_remove_files();
        
        restore_current_blog();
    }
} else {
    // Single site uninstallation
    flux_seo_log_uninstallation();
    flux_seo_remove_cron_jobs();
    flux_seo_remove_capabilities();
    flux_seo_remove_post_meta();
    flux_seo_remove_user_meta();
    flux_seo_remove_transients();
    flux_seo_remove_options();
    flux_seo_remove_tables();
    flux_seo_remove_files();
}

// Final cleanup
flux_seo_cleanup_cache();

// Log successful uninstallation
error_log('Flux SEO Scribe Craft Plugin: Uninstallation completed successfully');

// Optional: Redirect to feedback page
// wp_redirect('https://your-feedback-url.com?plugin=flux-seo-scribe-craft&action=uninstall');
// exit;