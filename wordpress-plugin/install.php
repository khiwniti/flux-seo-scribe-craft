
<?php
/**
 * Installation script for Flux SEO Scribe Craft
 * This file handles database setup and initial configuration
 */

if (!defined('ABSPATH')) {
    exit;
}

class FluxSEOInstaller {
    
    public static function install() {
        self::create_database_tables();
        self::set_default_options();
        self::create_capabilities();
        
        // Set version
        update_option('flux_seo_version', '2.0.0');
        update_option('flux_seo_install_date', current_time('mysql'));
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }
    
    public static function uninstall() {
        self::remove_database_tables();
        self::remove_options();
        self::remove_capabilities();
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }
    
    private static function create_database_tables() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        
        // Analytics table
        $analytics_table = $wpdb->prefix . 'flux_seo_analytics';
        $sql_analytics = "CREATE TABLE IF NOT EXISTS $analytics_table (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            post_id bigint(20) DEFAULT NULL,
            url varchar(255) DEFAULT NULL,
            seo_score int(3) DEFAULT 0,
            readability_score int(3) DEFAULT 0,
            keyword_density decimal(5,2) DEFAULT 0.00,
            word_count int(6) DEFAULT 0,
            char_count int(8) DEFAULT 0,
            paragraph_count int(4) DEFAULT 0,
            heading_count int(4) DEFAULT 0,
            target_keywords text DEFAULT NULL,
            suggestions longtext DEFAULT NULL,
            analysis_data longtext DEFAULT NULL,
            language varchar(10) DEFAULT 'en',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY post_id (post_id),
            KEY seo_score (seo_score),
            KEY created_at (created_at)
        ) $charset_collate;";
        
        // Generated content table
        $content_table = $wpdb->prefix . 'flux_seo_generated_content';
        $sql_content = "CREATE TABLE IF NOT EXISTS $content_table (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) NOT NULL,
            post_id bigint(20) DEFAULT NULL,
            title varchar(255) NOT NULL,
            content longtext NOT NULL,
            meta_description text DEFAULT NULL,
            keywords text DEFAULT NULL,
            content_type varchar(50) DEFAULT 'blog',
            tone varchar(50) DEFAULT 'professional',
            word_count int(6) DEFAULT 0,
            language varchar(10) DEFAULT 'en',
            generation_config longtext DEFAULT NULL,
            seo_data longtext DEFAULT NULL,
            status varchar(20) DEFAULT 'draft',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY user_id (user_id),
            KEY post_id (post_id),
            KEY status (status),
            KEY created_at (created_at)
        ) $charset_collate;";
        
        // Settings table
        $settings_table = $wpdb->prefix . 'flux_seo_settings';
        $sql_settings = "CREATE TABLE IF NOT EXISTS $settings_table (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            setting_name varchar(255) NOT NULL,
            setting_value longtext DEFAULT NULL,
            setting_type varchar(50) DEFAULT 'string',
            user_id bigint(20) DEFAULT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY setting_name (setting_name),
            KEY user_id (user_id)
        ) $charset_collate;";
        
        // Keywords table
        $keywords_table = $wpdb->prefix . 'flux_seo_keywords';
        $sql_keywords = "CREATE TABLE IF NOT EXISTS $keywords_table (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            keyword varchar(255) NOT NULL,
            search_volume int(10) DEFAULT 0,
            competition varchar(20) DEFAULT 'unknown',
            difficulty_score int(3) DEFAULT 0,
            related_keywords text DEFAULT NULL,
            language varchar(10) DEFAULT 'en',
            last_updated datetime DEFAULT CURRENT_TIMESTAMP,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY keyword_lang (keyword, language),
            KEY search_volume (search_volume),
            KEY difficulty_score (difficulty_score)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        
        dbDelta($sql_analytics);
        dbDelta($sql_content);
        dbDelta($sql_settings);
        dbDelta($sql_keywords);
    }
    
    private static function set_default_options() {
        // Default plugin options
        $default_options = array(
            'flux_seo_version' => '2.0.0',
            'flux_seo_gemini_api_key' => '',
            'flux_seo_default_language' => 'en',
            'flux_seo_enable_analytics' => true,
            'flux_seo_enable_content_generation' => true,
            'flux_seo_enable_keyword_research' => true,
            'flux_seo_max_content_length' => 5000,
            'flux_seo_default_content_type' => 'blog',
            'flux_seo_default_tone' => 'professional',
            'flux_seo_auto_save_generated_content' => false,
            'flux_seo_enable_seo_suggestions' => true,
            'flux_seo_min_seo_score' => 70,
            'flux_seo_enable_keyword_density_check' => true,
            'flux_seo_max_keyword_density' => 3.0,
            'flux_seo_enable_readability_check' => true,
            'flux_seo_min_readability_score' => 60
        );
        
        foreach ($default_options as $option_name => $option_value) {
            if (get_option($option_name) === false) {
                add_option($option_name, $option_value);
            }
        }
    }
    
    private static function create_capabilities() {
        // Get administrator role
        $admin_role = get_role('administrator');
        $editor_role = get_role('editor');
        $author_role = get_role('author');
        
        // Define capabilities
        $capabilities = array(
            'manage_flux_seo' => array('administrator'),
            'use_flux_seo_analyzer' => array('administrator', 'editor', 'author'),
            'use_flux_seo_generator' => array('administrator', 'editor', 'author'),
            'view_flux_seo_analytics' => array('administrator', 'editor'),
            'manage_flux_seo_keywords' => array('administrator', 'editor'),
            'manage_flux_seo_settings' => array('administrator')
        );
        
        // Add capabilities to roles
        foreach ($capabilities as $capability => $roles) {
            foreach ($roles as $role_name) {
                $role = get_role($role_name);
                if ($role) {
                    $role->add_cap($capability);
                }
            }
        }
    }
    
    private static function remove_database_tables() {
        global $wpdb;
        
        $tables = array(
            $wpdb->prefix . 'flux_seo_analytics',
            $wpdb->prefix . 'flux_seo_generated_content',
            $wpdb->prefix . 'flux_seo_settings',
            $wpdb->prefix . 'flux_seo_keywords'
        );
        
        foreach ($tables as $table) {
            $wpdb->query("DROP TABLE IF EXISTS $table");
        }
    }
    
    private static function remove_options() {
        $options_to_remove = array(
            'flux_seo_version',
            'flux_seo_gemini_api_key',
            'flux_seo_default_language',
            'flux_seo_enable_analytics',
            'flux_seo_enable_content_generation',
            'flux_seo_enable_keyword_research',
            'flux_seo_max_content_length',
            'flux_seo_default_content_type',
            'flux_seo_default_tone',
            'flux_seo_auto_save_generated_content',
            'flux_seo_enable_seo_suggestions',
            'flux_seo_min_seo_score',
            'flux_seo_enable_keyword_density_check',
            'flux_seo_max_keyword_density',
            'flux_seo_enable_readability_check',
            'flux_seo_min_readability_score',
            'flux_seo_install_date'
        );
        
        foreach ($options_to_remove as $option) {
            delete_option($option);
        }
    }
    
    private static function remove_capabilities() {
        $capabilities = array(
            'manage_flux_seo',
            'use_flux_seo_analyzer',
            'use_flux_seo_generator',
            'view_flux_seo_analytics',
            'manage_flux_seo_keywords',
            'manage_flux_seo_settings'
        );
        
        $roles = array('administrator', 'editor', 'author');
        
        foreach ($roles as $role_name) {
            $role = get_role($role_name);
            if ($role) {
                foreach ($capabilities as $capability) {
                    $role->remove_cap($capability);
                }
            }
        }
    }
}

// Run installation when plugin is activated
register_activation_hook(__FILE__, array('FluxSEOInstaller', 'install'));
register_deactivation_hook(__FILE__, array('FluxSEOInstaller', 'uninstall'));
?>
