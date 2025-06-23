
<?php
/**
 * Installation script for Flux SEO Scribe Craft Plugin
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Create necessary database tables
 */
function flux_seo_create_tables() {
    global $wpdb;
    
    $charset_collate = $wpdb->get_charset_collate();
    
    // Content generation history table
    $table_name = $wpdb->prefix . 'flux_seo_generation_history';
    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        topic varchar(255) NOT NULL,
        content longtext NOT NULL,
        language varchar(10) NOT NULL,
        word_count int NOT NULL,
        seo_score int NOT NULL,
        keywords text,
        meta_description text,
        generated_date datetime DEFAULT CURRENT_TIMESTAMP,
        status varchar(50) DEFAULT 'completed',
        PRIMARY KEY (id)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
    
    // Analytics data table
    $analytics_table = $wpdb->prefix . 'flux_seo_analytics';
    $sql_analytics = "CREATE TABLE $analytics_table (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        post_id bigint(20),
        analysis_data longtext,
        seo_score int,
        readability_score int,
        keyword_density varchar(10),
        analyzed_date datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    ) $charset_collate;";
    
    dbDelta($sql_analytics);
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
        'max_analysis_per_day' => 100,
        'cache_analysis_hours' => 24,
        'default_content_language' => 'en'
    );
    
    add_option('flux_seo_settings', $default_settings);
}

/**
 * Create necessary directories
 */
function flux_seo_create_directories() {
    $upload_dir = wp_upload_dir();
    $flux_seo_dir = $upload_dir['basedir'] . '/flux-seo-scribe-craft';
    
    if (!file_exists($flux_seo_dir)) {
        wp_mkdir_p($flux_seo_dir);
        wp_mkdir_p($flux_seo_dir . '/cache');
        wp_mkdir_p($flux_seo_dir . '/exports');
        wp_mkdir_p($flux_seo_dir . '/logs');
        
        // Create index.php to prevent directory browsing
        $index_content = "<?php\n// Silence is golden.\n";
        file_put_contents($flux_seo_dir . '/index.php', $index_content);
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
    }
}

// Execute installation functions
flux_seo_create_tables();
flux_seo_set_default_options();
flux_seo_create_directories();
flux_seo_add_capabilities();

// Set installation flag
update_option('flux_seo_installed', true);
update_option('flux_seo_installation_date', current_time('mysql'));
