<?php
/**
 * Plugin Name: Flux SEO Scribe Craft
 * Plugin URI: https://github.com/khiwniti/flux-seo-scribe-craft
 * Description: Professional SEO optimization suite with integrated content generation and advanced analytics.
 * Version: 1.0.0
 * Author: Flux SEO Team
 * Author URI: https://example.com
 * License: GPL v2 or later
 * Text Domain: flux-seo-scribe-craft
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('FLUX_SEO_VERSION', '1.0.0');
define('FLUX_SEO_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('FLUX_SEO_PLUGIN_URL', plugin_dir_url(__FILE__));

class FluxSEOScribeCraft {
    
    public function __construct() {
        // Initialize hooks
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        add_shortcode('flux_seo_scribe_craft', array($this, 'render_shortcode'));
    }
    
    /**
     * Add admin menu items
     */
    public function add_admin_menu() {
        add_menu_page(
            'Flux SEO Scribe Craft',
            'Flux SEO',
            'manage_options',
            'flux-seo-dashboard',
            array($this, 'render_dashboard_page'),
            'dashicons-chart-area',
            30
        );
        
        add_submenu_page(
            'flux-seo-dashboard',
            'Settings',
            'Settings',
            'manage_options',
            'flux-seo-settings',
            array($this, 'render_settings_page')
        );
    }
    
    /**
     * Enqueue admin scripts and styles
     */
    public function enqueue_admin_scripts($hook) {
        // Only load on our plugin pages
        if (strpos($hook, 'flux-seo') === false) {
            return;
        }
        
        wp_enqueue_style(
            'flux-seo-admin-style',
            FLUX_SEO_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            FLUX_SEO_VERSION
        );
        
        wp_enqueue_script(
            'flux-seo-admin-script',
            FLUX_SEO_PLUGIN_URL . 'assets/js/admin.js',
            array('jquery'),
            FLUX_SEO_VERSION,
            true
        );
    }
    
    /**
     * Render the main dashboard page
     */
    public function render_dashboard_page() {
        ?>
        <div class="wrap">
            <h1>Flux SEO Dashboard</h1>
            <div class="flux-seo-dashboard">
                <div class="flux-seo-card">
                    <h2>Content Analyzer</h2>
                    <p>Analyze your content for SEO optimization opportunities.</p>
                    <textarea class="flux-seo-textarea" placeholder="Paste your content here for analysis..."></textarea>
                    <button class="button button-primary">Analyze Content</button>
                </div>
                
                <div class="flux-seo-card">
                    <h2>Blog Generator</h2>
                    <p>Generate SEO-optimized blog posts with AI assistance.</p>
                    <input type="text" class="regular-text" placeholder="Enter your topic...">
                    <button class="button button-primary">Generate Blog</button>
                </div>
            </div>
        </div>
        <?php
    }
    
    /**
     * Render the settings page
     */
    public function render_settings_page() {
        // Save settings if form is submitted
        if (isset($_POST['flux_seo_save_settings']) && check_admin_referer('flux_seo_settings_nonce')) {
            update_option('flux_seo_api_key', sanitize_text_field($_POST['flux_seo_api_key']));
            echo '<div class="notice notice-success"><p>Settings saved successfully!</p></div>';
        }
        
        // Get current settings
        $api_key = get_option('flux_seo_api_key', '');
        
        ?>
        <div class="wrap">
            <h1>Flux SEO Settings</h1>
            
            <form method="post" action="">
                <?php wp_nonce_field('flux_seo_settings_nonce'); ?>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="flux_seo_api_key">API Key</label>
                        </th>
                        <td>
                            <input type="text" id="flux_seo_api_key" name="flux_seo_api_key" 
                                   value="<?php echo esc_attr($api_key); ?>" class="regular-text">
                            <p class="description">
                                Enter your API key for AI-powered features.
                                <a href="https://aistudio.google.com/app/apikey" target="_blank">Get an API key</a>
                            </p>
                        </td>
                    </tr>
                </table>
                
                <p class="submit">
                    <input type="submit" name="flux_seo_save_settings" class="button button-primary" 
                           value="Save Settings">
                </p>
            </form>
        </div>
        <?php
    }
    
    /**
     * Render the shortcode
     */
    public function render_shortcode($atts) {
        $atts = shortcode_atts(array(
            'height' => '500px',
            'width' => '100%'
        ), $atts);
        
        ob_start();
        ?>
        <div class="flux-seo-container" style="height: <?php echo esc_attr($atts['height']); ?>; width: <?php echo esc_attr($atts['width']); ?>;">
            <div class="flux-seo-tabs">
                <div class="flux-seo-tab active" data-tab="analyzer">Content Analyzer</div>
                <div class="flux-seo-tab" data-tab="generator">Blog Generator</div>
                <div class="flux-seo-tab" data-tab="analytics">Analytics</div>
            </div>
            
            <div class="flux-seo-content">
                <div class="flux-seo-tab-content active" data-tab="analyzer">
                    <h2>Content Analyzer</h2>
                    <textarea class="flux-seo-textarea" placeholder="Paste your content here for analysis..."></textarea>
                    <button class="flux-seo-button">Analyze Content</button>
                </div>
                
                <div class="flux-seo-tab-content" data-tab="generator">
                    <h2>Blog Generator</h2>
                    <input type="text" placeholder="Enter your topic...">
                    <button class="flux-seo-button">Generate Blog</button>
                </div>
                
                <div class="flux-seo-tab-content" data-tab="analytics">
                    <h2>Analytics</h2>
                    <p>SEO performance analytics will appear here.</p>
                </div>
            </div>
        </div>
        
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                // Simple tab functionality
                const tabs = document.querySelectorAll('.flux-seo-tab');
                tabs.forEach(tab => {
                    tab.addEventListener('click', function() {
                        // Remove active class from all tabs
                        tabs.forEach(t => t.classList.remove('active'));
                        
                        // Add active class to clicked tab
                        this.classList.add('active');
                        
                        // Hide all tab content
                        const tabContents = document.querySelectorAll('.flux-seo-tab-content');
                        tabContents.forEach(content => content.classList.remove('active'));
                        
                        // Show corresponding tab content
                        const tabName = this.getAttribute('data-tab');
                        document.querySelector(`.flux-seo-tab-content[data-tab="${tabName}"]`).classList.add('active');
                    });
                });
            });
        </script>
        
        <style>
            .flux-seo-container {
                font-family: Arial, sans-serif;
                border: 1px solid #ddd;
                border-radius: 5px;
                overflow: hidden;
            }
            
            .flux-seo-tabs {
                display: flex;
                background: #f5f5f5;
                border-bottom: 1px solid #ddd;
            }
            
            .flux-seo-tab {
                padding: 10px 15px;
                cursor: pointer;
            }
            
            .flux-seo-tab.active {
                background: white;
                border-bottom: 2px solid #0073aa;
            }
            
            .flux-seo-content {
                padding: 20px;
                background: white;
            }
            
            .flux-seo-tab-content {
                display: none;
            }
            
            .flux-seo-tab-content.active {
                display: block;
            }
            
            .flux-seo-textarea {
                width: 100%;
                min-height: 200px;
                margin-bottom: 15px;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            
            .flux-seo-button {
                background: #0073aa;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 4px;
                cursor: pointer;
            }
            
            .flux-seo-button:hover {
                background: #005177;
            }
        </style>
        <?php
        
        return ob_get_clean();
    }
}

// Initialize the plugin
$flux_seo_plugin = new FluxSEOScribeCraft();

// Activation hook
register_activation_hook(__FILE__, 'flux_seo_activate');
function flux_seo_activate() {
    // Create necessary database tables or options
    add_option('flux_seo_version', FLUX_SEO_VERSION);
    add_option('flux_seo_installation_date', current_time('mysql'));
    
    // Create assets directory if it doesn't exist
    $upload_dir = wp_upload_dir();
    $flux_seo_dir = $upload_dir['basedir'] . '/flux-seo';
    
    if (!file_exists($flux_seo_dir)) {
        wp_mkdir_p($flux_seo_dir);
    }
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'flux_seo_deactivate');
function flux_seo_deactivate() {
    // Cleanup temporary files if needed
}