<?php
/**
 * Installation script for Flux SEO Scribe Craft Plugin
 * 
 * This file is executed when the plugin is activated
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Create necessary database tables and options
 */
function flux_seo_create_tables() {
    global $wpdb;
    
    $charset_collate = $wpdb->get_charset_collate();
    
    // Table for storing SEO analysis results
    $table_name = $wpdb->prefix . 'flux_seo_analysis';
    
    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        post_id bigint(20) DEFAULT NULL,
        url varchar(255) DEFAULT '',
        content_hash varchar(64) NOT NULL,
        seo_score int(3) DEFAULT 0,
        readability_score int(3) DEFAULT 0,
        keyword_density varchar(10) DEFAULT '',
        analysis_data longtext,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY post_id (post_id),
        KEY content_hash (content_hash)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
    
    // Table for storing generated content
    $table_name = $wpdb->prefix . 'flux_seo_generated_content';
    
    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        user_id bigint(20) DEFAULT NULL,
        content_type varchar(50) DEFAULT 'article',
        topic varchar(255) NOT NULL,
        generated_title text,
        generated_content longtext,
        meta_description text,
        keywords text,
        status varchar(20) DEFAULT 'draft',
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY user_id (user_id),
        KEY content_type (content_type),
        KEY status (status)
    ) $charset_collate;";
    
    dbDelta($sql);
    
    // Table for storing plugin settings
    $table_name = $wpdb->prefix . 'flux_seo_settings';
    
    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        setting_name varchar(100) NOT NULL,
        setting_value longtext,
        autoload varchar(20) DEFAULT 'yes',
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY setting_name (setting_name)
    ) $charset_collate;";
    
    dbDelta($sql);
}

/**
 * Set default plugin options
 */
function flux_seo_set_default_options() {
    // Plugin version
    add_option('flux_seo_version', FLUX_SEO_PLUGIN_VERSION);
    
    // Default settings
    $default_settings = array(
        'enable_auto_analysis' => true,
        'enable_content_suggestions' => true,
        'enable_keyword_tracking' => true,
        'max_analysis_per_day' => 100,
        'cache_analysis_hours' => 24,
        'enable_image_generation' => true,
        'default_content_language' => 'en',
        'seo_score_threshold' => 70,
        'readability_threshold' => 60
    );
    
    add_option('flux_seo_settings', $default_settings);
    
    // API settings (empty by default, user needs to configure)
    $api_settings = array(
        'openai_api_key' => '',
        'google_analytics_id' => '',
        'search_console_property' => '',
        'flux_api_key' => ''
    );
    
    add_option('flux_seo_api_settings', $api_settings);
    
    // Usage tracking
    add_option('flux_seo_usage_stats', array(
        'analyses_performed' => 0,
        'content_generated' => 0,
        'images_generated' => 0,
        'first_activation' => current_time('mysql'),
        'last_activity' => current_time('mysql')
    ));
}

/**
 * Create necessary directories
 */
function flux_seo_create_directories() {
    $upload_dir = wp_upload_dir();
    $flux_seo_dir = $upload_dir['basedir'] . '/flux-seo-scribe-craft';
    
    if (!file_exists($flux_seo_dir)) {
        wp_mkdir_p($flux_seo_dir);
        
        // Create subdirectories
        wp_mkdir_p($flux_seo_dir . '/cache');
        wp_mkdir_p($flux_seo_dir . '/generated-images');
        wp_mkdir_p($flux_seo_dir . '/exports');
        wp_mkdir_p($flux_seo_dir . '/logs');
        
        // Create .htaccess to protect sensitive files
        $htaccess_content = "# Flux SEO Scribe Craft Protection\n";
        $htaccess_content .= "Options -Indexes\n";
        $htaccess_content .= "<Files \"*.log\">\n";
        $htaccess_content .= "    Order allow,deny\n";
        $htaccess_content .= "    Deny from all\n";
        $htaccess_content .= "</Files>\n";
        
        file_put_contents($flux_seo_dir . '/.htaccess', $htaccess_content);
        
        // Create index.php to prevent directory browsing
        $index_content = "<?php\n// Silence is golden.\n";
        file_put_contents($flux_seo_dir . '/index.php', $index_content);
        file_put_contents($flux_seo_dir . '/cache/index.php', $index_content);
        file_put_contents($flux_seo_dir . '/generated-images/index.php', $index_content);
        file_put_contents($flux_seo_dir . '/exports/index.php', $index_content);
        file_put_contents($flux_seo_dir . '/logs/index.php', $index_content);
    }
}

/**
 * Schedule cron jobs
 */
function flux_seo_schedule_cron_jobs() {
    // Schedule daily cleanup
    if (!wp_next_scheduled('flux_seo_daily_cleanup')) {
        wp_schedule_event(time(), 'daily', 'flux_seo_daily_cleanup');
    }
    
    // Schedule weekly analytics update
    if (!wp_next_scheduled('flux_seo_weekly_analytics')) {
        wp_schedule_event(time(), 'weekly', 'flux_seo_weekly_analytics');
    }
}

/**
 * Add custom capabilities
 */
function flux_seo_add_capabilities() {
    // Add capabilities to administrator role
    $admin_role = get_role('administrator');
    if ($admin_role) {
        $admin_role->add_cap('manage_flux_seo');
        $admin_role->add_cap('generate_seo_content');
        $admin_role->add_cap('view_seo_analytics');
    }
    
    // Add capabilities to editor role
    $editor_role = get_role('editor');
    if ($editor_role) {
        $editor_role->add_cap('generate_seo_content');
        $editor_role->add_cap('view_seo_analytics');
    }
    
    // Add capabilities to author role
    $author_role = get_role('author');
    if ($author_role) {
        $author_role->add_cap('generate_seo_content');
    }
}

/**
 * Log installation
 */
function flux_seo_log_installation() {
    $log_data = array(
        'timestamp' => current_time('mysql'),
        'wp_version' => get_bloginfo('version'),
        'php_version' => PHP_VERSION,
        'plugin_version' => FLUX_SEO_PLUGIN_VERSION,
        'site_url' => get_site_url(),
        'admin_email' => get_option('admin_email')
    );
    
    // Store installation log
    add_option('flux_seo_installation_log', $log_data);
    
    // Send installation notification (optional)
    $subject = 'Flux SEO Scribe Craft Plugin Activated';
    $message = "The Flux SEO Scribe Craft plugin has been successfully activated on your WordPress site.\n\n";
    $message .= "Site: " . get_site_url() . "\n";
    $message .= "Time: " . current_time('mysql') . "\n";
    $message .= "Plugin Version: " . FLUX_SEO_PLUGIN_VERSION . "\n\n";
    $message .= "You can access the plugin from your WordPress admin dashboard under 'SEO Scribe Craft'.\n";
    
    // Uncomment the line below if you want to send email notifications
    // wp_mail(get_option('admin_email'), $subject, $message);
}

// Execute installation functions
flux_seo_create_tables();
flux_seo_set_default_options();
flux_seo_create_directories();
flux_seo_schedule_cron_jobs();
flux_seo_add_capabilities();
flux_seo_log_installation();

// Set installation flag
update_option('flux_seo_installed', true);
update_option('flux_seo_installation_date', current_time('mysql'));

// Clear any existing caches
if (function_exists('wp_cache_flush')) {
    wp_cache_flush();
}

// Log successful installation
error_log('Flux SEO Scribe Craft Plugin: Installation completed successfully');