<?php
/**
 * Plugin Name: Flux SEO Scribe Craft
 * Plugin URI: https://github.com/khiwniti/flux-seo-scribe-craft
 * Description: Professional SEO optimization suite with integrated content generation and advanced analytics. Embed the complete SEO Scribe Craft application in your WordPress site.
 * Version: 1.0.0
 * Author: Flux SEO Team
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: flux-seo-scribe-craft
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('FLUX_SEO_PLUGIN_URL', plugin_dir_url(__FILE__));
define('FLUX_SEO_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('FLUX_SEO_PLUGIN_VERSION', '1.0.0');

class FluxSEOScribeCraft {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_shortcode('flux_seo_scribe_craft', array($this, 'shortcode_handler'));
        
        // AJAX handlers for the React app
        add_action('wp_ajax_flux_seo_proxy', array($this, 'ajax_proxy_handler'));
        add_action('wp_ajax_nopriv_flux_seo_proxy', array($this, 'ajax_proxy_handler'));
    }
    
    public function init() {
        // Plugin initialization
        load_plugin_textdomain('flux-seo-scribe-craft', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
    
    public function enqueue_scripts() {
        // Only enqueue on pages that use the shortcode or admin page
        if (is_admin() && isset($_GET['page']) && $_GET['page'] === 'flux-seo-scribe-craft') {
            $this->enqueue_app_assets();
        } elseif (!is_admin() && $this->has_shortcode()) {
            $this->enqueue_app_assets();
        }
    }
    
    private function enqueue_app_assets() {
        // Enqueue main CSS
        wp_enqueue_style(
            'flux-seo-scribe-craft-css',
            FLUX_SEO_PLUGIN_URL . 'flux-seo-scribe-craft.css',
            array(),
            FLUX_SEO_PLUGIN_VERSION
        );
        
        // Enqueue WordPress-specific overrides
        wp_enqueue_style(
            'flux-seo-wordpress-overrides',
            FLUX_SEO_PLUGIN_URL . 'wordpress-overrides.css',
            array('flux-seo-scribe-craft-css'),
            FLUX_SEO_PLUGIN_VERSION
        );
        
        // Enqueue WordPress-compatible React application
        wp_enqueue_script(
            'flux-seo-wordpress-app',
            FLUX_SEO_PLUGIN_URL . 'flux-seo-wordpress-app.js',
            array(),
            FLUX_SEO_PLUGIN_VERSION,
            true
        );
        
        // Enqueue WordPress integration script
        wp_enqueue_script(
            'flux-seo-wordpress-integration',
            FLUX_SEO_PLUGIN_URL . 'flux-seo-wordpress-integration.js',
            array('flux-seo-wordpress-app'),
            FLUX_SEO_PLUGIN_VERSION,
            true
        );
        
        // Localize script for AJAX
        wp_localize_script('flux-seo-wordpress-integration', 'fluxSeoAjax', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('flux_seo_nonce'),
            'pluginUrl' => FLUX_SEO_PLUGIN_URL,
            'adminUrl' => admin_url(),
            'siteUrl' => get_site_url(),
            'currentUser' => wp_get_current_user()->ID,
            'isAdmin' => current_user_can('manage_options')
        ));
    }
    
    private function has_shortcode() {
        global $post;
        if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'flux_seo_scribe_craft')) {
            return true;
        }
        return false;
    }
    
    public function add_admin_menu() {
        add_menu_page(
            'Flux SEO Scribe Craft',
            'SEO Scribe Craft',
            'manage_options',
            'flux-seo-scribe-craft',
            array($this, 'admin_page'),
            'dashicons-chart-line',
            30
        );
    }
    
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1>Flux SEO Scribe Craft</h1>
            <div id="flux-seo-admin-app">
                <?php echo $this->render_app(); ?>
            </div>
        </div>
        <?php
    }
    
    public function shortcode_handler($atts) {
        $atts = shortcode_atts(array(
            'height' => '800px',
            'width' => '100%'
        ), $atts, 'flux_seo_scribe_craft');
        
        $style = sprintf('height: %s; width: %s;', esc_attr($atts['height']), esc_attr($atts['width']));
        
        return '<div id="flux-seo-shortcode-app" style="' . $style . '">' . $this->render_app() . '</div>';
    }
    
    private function render_app() {
        ob_start();
        ?>
        <div id="flux-seo-root" class="flux-seo-container">
            <div id="root">
                <div class="flux-seo-loading">
                    <div class="loading-content">
                        <h3>🔄 Loading Flux SEO Scribe Craft...</h3>
                        <p>Initializing SEO optimization suite...</p>
                    </div>
                </div>
            </div>
        </div>
        
        <script type="text/javascript">
        // WordPress-specific React app initialization
        document.addEventListener('DOMContentLoaded', function() {
            // Disable service workers in WordPress environment
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for(let registration of registrations) {
                        registration.unregister();
                    }
                });
            }
            
            // Override console.error for messaging.ts warnings
            const originalError = console.error;
            console.error = function(...args) {
                const message = args[0];
                if (typeof message === 'string' && message.includes('Event handler of') && message.includes('event must be added')) {
                    // Suppress service worker event handler warnings
                    return;
                }
                originalError.apply(console, args);
            };
            
            // Initialize React app with error handling
            setTimeout(function() {
                try {
                    // The React app should mount automatically
                    const rootElement = document.getElementById('root');
                    if (rootElement && rootElement.children.length === 1 && rootElement.children[0].classList.contains('flux-seo-loading')) {
                        // If still showing loading, try to trigger React mount
                        console.log('Flux SEO Scribe Craft: Attempting to initialize React app...');
                        
                        // Create a custom event to trigger React initialization
                        const initEvent = new CustomEvent('fluxSeoInit', {
                            detail: { 
                                container: rootElement,
                                wordpress: true,
                                ajaxUrl: fluxSeoAjax.ajaxurl,
                                nonce: fluxSeoAjax.nonce
                            }
                        });
                        window.dispatchEvent(initEvent);
                    }
                } catch (error) {
                    console.log('Flux SEO Scribe Craft: React app initialization in progress...');
                }
            }, 1000);
            
            // Fallback error display after 10 seconds
            setTimeout(function() {
                const rootElement = document.getElementById('root');
                if (rootElement && rootElement.children.length === 1 && rootElement.children[0].classList.contains('flux-seo-loading')) {
                    rootElement.innerHTML = `
                        <div class="flux-seo-error">
                            <h3>⚠️ Loading Issue</h3>
                            <p>The SEO application is taking longer than expected to load.</p>
                            <p><strong>Troubleshooting:</strong></p>
                            <ul>
                                <li>Refresh the page</li>
                                <li>Check browser console for errors</li>
                                <li>Ensure JavaScript is enabled</li>
                                <li>Try a different browser</li>
                            </ul>
                            <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #0073aa; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                Refresh Page
                            </button>
                        </div>
                    `;
                }
            }, 10000);
        });
        </script>
        
        <style>
        .flux-seo-container {
            min-height: 600px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 8px;
            overflow: hidden;
        }
        
        .flux-seo-container #root {
            min-height: inherit;
        }
        
        /* Ensure proper styling within WordPress */
        .flux-seo-container * {
            box-sizing: border-box;
        }
        
        /* Override WordPress admin styles if needed */
        .flux-seo-container .button,
        .flux-seo-container button {
            font-family: inherit !important;
        }
        </style>
        <?php
        return ob_get_clean();
    }
    
    public function ajax_proxy_handler() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'flux_seo_nonce')) {
            wp_die('Security check failed');
        }
        
        // Handle AJAX requests from the React app
        $action = isset($_POST['flux_action']) ? sanitize_text_field($_POST['flux_action']) : null;
        $data = isset($_POST['data']) ? stripslashes_deep($_POST['data']) : null; // Data is expected to be JSON string

        error_log('[Flux SEO] AJAX Proxy Handler: Received action: ' . print_r($action, true));
        error_log('[Flux SEO] AJAX Proxy Handler: Received data: ' . print_r($data, true));
        
        switch ($action) {
            case 'analyze_content':
                $this->handle_content_analysis($data);
                break;
            case 'generate_content':
                $this->handle_content_generation($data);
                break;
            default:
                error_log('[Flux SEO] AJAX Proxy Handler: Invalid action: ' . print_r($action, true));
                wp_send_json_error('Invalid action: ' . $action);
        }
    }
    
    private function handle_content_analysis($data_json) {
        $data = json_decode($data_json, true);
        error_log('[Flux SEO] Handling content analysis for data: ' . print_r($data, true));

        // Mock content analysis - in a real implementation, this would connect to SEO APIs
        // Example of logging for an external API call:
        // $api_url = 'https://api.example.com/analyze';
        // $api_args = array('body' => $data, 'timeout' => 30);
        // error_log('[Flux SEO] External API Call: URL: ' . $api_url . ', Args: ' . print_r($api_args, true));
        // $response = wp_remote_post($api_url, $api_args);
        // if (is_wp_error($response)) {
        //     error_log('[Flux SEO] External API Error: ' . $response->get_error_message());
        //     wp_send_json_error('Failed to connect to analysis service: ' . $response->get_error_message());
        //     return;
        // }
        // $raw_response_body = wp_remote_retrieve_body($response);
        // error_log('[Flux SEO] External API Raw Response: ' . print_r($raw_response_body, true));
        // $analysis = json_decode($raw_response_body, true);

        $analysis = array(
            'seo_score' => rand(60, 95),
            'readability' => rand(70, 90),
            'keyword_density' => rand(2, 8) . '%',
            'suggestions' => array(
                'Add more internal links',
                'Optimize meta description',
                'Include more relevant keywords',
                'Improve heading structure'
            )
        );
        
        error_log('[Flux SEO] Sending success response for content_analysis: ' . print_r($analysis, true));
        wp_send_json_success($analysis);
    }
    
    private function handle_content_generation($data_json) {
        $data = json_decode($data_json, true);
        error_log('[Flux SEO] Handling content generation for data: ' . print_r($data, true));

        // Mock content generation - in a real implementation, this would connect to AI APIs
        // Example of logging for an external API call:
        // $api_url = 'https://api.example.com/generate';
        // $api_args = array('body' => $data, 'timeout' => 60);
        // error_log('[Flux SEO] External API Call: URL: ' . $api_url . ', Args: ' . print_r($api_args, true));
        // $response = wp_remote_post($api_url, $api_args);
        // if (is_wp_error($response)) {
        //     error_log('[Flux SEO] External API Error: ' . $response->get_error_message());
        //     wp_send_json_error('Failed to connect to generation service: ' . $response->get_error_message());
        //     return;
        // }
        // $raw_response_body = wp_remote_retrieve_body($response);
        // error_log('[Flux SEO] External API Raw Response: ' . print_r($raw_response_body, true));
        // $generated_content = json_decode($raw_response_body, true);

        $generated_content = array(
            'title' => 'SEO Optimized Article: ' . (isset($data['topic']) ? sanitize_text_field($data['topic']) : 'N/A'),
            'content' => 'This is a generated article about ' . (isset($data['topic']) ? sanitize_text_field($data['topic']) : 'N/A') . '. Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
            'meta_description' => 'Learn about ' . (isset($data['topic']) ? sanitize_text_field($data['topic']) : 'N/A') . ' with our comprehensive guide.',
            'keywords' => array('seo', 'optimization', (isset($data['topic']) ? sanitize_text_field($data['topic']) : 'N/A'))
        );
        
        error_log('[Flux SEO] Sending success response for content_generation: ' . print_r($generated_content, true));
        wp_send_json_success($generated_content);
    }
}

// Initialize the plugin
new FluxSEOScribeCraft();

// Activation hook
register_activation_hook(__FILE__, 'flux_seo_activate');
function flux_seo_activate() {
    // Create necessary database tables or options
    add_option('flux_seo_version', FLUX_SEO_PLUGIN_VERSION);
    
    // Include install.php if it exists
    if (file_exists(FLUX_SEO_PLUGIN_PATH . 'install.php')) {
        include_once FLUX_SEO_PLUGIN_PATH . 'install.php';
    }
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'flux_seo_deactivate');
function flux_seo_deactivate() {
    // Clean up temporary data
    delete_transient('flux_seo_cache');
}

// Uninstall hook
register_uninstall_hook(__FILE__, 'flux_seo_uninstall');
function flux_seo_uninstall() {
    // Include uninstall.php if it exists
    if (file_exists(FLUX_SEO_PLUGIN_PATH . 'uninstall.php')) {
        include_once FLUX_SEO_PLUGIN_PATH . 'uninstall.php';
    }
}