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

        // Settings page hooks
        add_action('admin_init', array($this, 'flux_seo_register_settings'));
        add_action('admin_menu', array($this, 'flux_seo_add_settings_page'));
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
        // Enqueue enhanced CSS
        // Note: WordPress handles 'wp-element' (React/ReactDOM) loading automatically when set as a dependency.
        // It's typically loaded in the footer by default when enqueued as a dependency for a footer script.
        wp_enqueue_style(
            'flux-seo-scribe-craft-css', // Changed handle
            FLUX_SEO_ENHANCED_URL . 'flux-seo-scribe-craft.css', // Changed filename
            array(),
            FLUX_SEO_ENHANCED_VERSION
        );
        
        // Enqueue enhanced JavaScript (React app)
        wp_enqueue_script(
            'flux-seo-wordpress-app-js', // Changed handle
            FLUX_SEO_ENHANCED_URL . 'flux-seo-wordpress-app.js', // Changed filename
            array('wp-element', 'jquery'), // Changed dependencies to use WordPress's React
            FLUX_SEO_ENHANCED_VERSION,
            true // Load in footer
        );
        
        // Removed enqueue for 'flux-seo-auto-blog-js' as the file is missing.
        
        // Localize script with enhanced data
        wp_localize_script('flux-seo-wordpress-app-js', 'fluxSeoEnhanced', array( // Changed handle
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('flux_seo_enhanced_nonce'),
            'pluginUrl' => FLUX_SEO_ENHANCED_URL,
            'isAdmin' => current_user_can('manage_options'),
            'geminiEnabled' => true, // Assuming this is still relevant
            'strings' => $this->get_localized_strings()
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
        <div id="root" class="flux-seo-container">
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
            console.log('🎯 Flux SEO Admin Page: DOM loaded, React loader will handle initialization...');
            
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
            
            // Show loading message
            const rootElement = document.getElementById('root');
            if (rootElement) {
                rootElement.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; min-height: 400px; text-align: center;">
                        <div>
                            <div style="font-size: 24px; margin-bottom: 10px;">🚀</div>
                            <h3 style="color: #0073aa; margin-bottom: 10px;">Loading Flux SEO Scribe Craft</h3>
                            <p style="color: #666;">Initializing React application...</p>
                            <div style="margin-top: 20px;">
                                <div style="display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #0073aa; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                            </div>
                        </div>
                    </div>
                    <style>
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    </style>
                `;
            }
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
        
        .flux-seo-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            text-align: center;
        }
        
        .loading-content h3 {
            color: #0073aa;
            margin-bottom: 10px;
        }
        
        .flux-seo-error {
            padding: 20px;
            border: 2px solid #dc3545;
            border-radius: 8px;
            background: #f8d7da;
            color: #721c24;
            margin: 20px;
        }
        
        .flux-seo-error ul {
            text-align: left;
            margin: 10px 0;
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

    public function flux_seo_register_settings() {
        register_setting(
            'flux_seo_api_settings_group', // Option group
            'flux_seo_gemini_api_key',     // Option name
            array(
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
                'default' => ''
            )
        );
    }

    public function flux_seo_add_settings_page() {
        add_options_page(
            'Flux SEO API Key',          // Page title
            'Flux SEO API Key',          // Menu title
            'manage_options',            // Capability
            'flux-seo-api-key-settings', // Menu slug
            array($this, 'flux_seo_render_settings_page') // Function to display page content
        );
    }

    public function flux_seo_render_settings_page() {
        ?>
        <div class="wrap">
            <h1>Flux SEO Gemini API Key Configuration</h1>
            <form method="post" action="options.php">
                <?php
                settings_fields('flux_seo_api_settings_group'); // Output settings fields for the registered group
                do_settings_sections('flux_seo_api_settings_group'); // Output settings sections (if any)
                ?>
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row"><label for="flux_seo_gemini_api_key_field">Gemini API Key</label></th>
                        <td>
                            <input type="text"
                                   id="flux_seo_gemini_api_key_field"
                                   name="flux_seo_gemini_api_key"
                                   value="<?php echo esc_attr(get_option('flux_seo_gemini_api_key')); ?>"
                                   class="regular-text"
                                   placeholder="Enter your Gemini API Key"/>
                            <p class="description">
                                You can obtain your API key from Google AI Studio.
                            </p>
                        </td>
                    </tr>
                </table>
                <?php submit_button('Save API Key'); ?>
            </form>
        </div>
        <?php
    }

    private function call_gemini_api($prompt, $language = 'en') {
        $api_key = get_option('flux_seo_gemini_api_key');

        if (empty($api_key)) {
            error_log('[Flux SEO] Gemini API Key is not set. Please configure it in Settings.');
            return false; // Or handle this error appropriately, e.g., throw an exception
        }

        // Assuming $this->gemini_endpoint is still a class property or defined appropriately.
        // If $this->gemini_endpoint also needs to be configurable, it should be fetched similarly.
        if (empty($this->gemini_endpoint)) { // Added check for endpoint for robustness
            error_log('[Flux SEO] Gemini API endpoint not configured.');
            return false;
        }

        $url = $this->gemini_endpoint . '?key=' . $api_key;

        // System prompt setup (example)
        $system_prompt_text = "You are a helpful AI assistant. Please respond in " . $language . ".";

        $data = array(
            'contents' => array(
                array(
                    'role' => 'user',
                    'parts' => array(
                        array('text' => $prompt)
                    )
                ),
                // System prompt can be part of the initial message or a separate instruction
                // For simplicity here, adding it as a model pre-fill which might not be standard for all Gemini models
                // A more common approach for system instructions is via `systemInstruction` field at the top level for some models.
                // Given the example, we are following a multi-turn like structure.
                array(
                    'role' => 'model',
                    'parts' => array(
                        // Assuming the system prompt is to guide the model's persona
                        array('text' => $system_prompt_text)
                    )
                )
            ),
            'generationConfig' => array(
                'temperature' => 0.7, // Example value
                'topK' => 1,         // Example value
                'topP' => 1,         // Example value
                'maxOutputTokens' => 2048, // Changed from 4096 to 2048
                'stopSequences' => []  // Example value
            ),
            'safetySettings' => array( // Preserved safety settings
                array(
                    'category' => 'HARM_CATEGORY_HARASSMENT',
                    'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                ),
                array(
                    'category' => 'HARM_CATEGORY_HATE_SPEECH',
                    'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                ),
                array(
                    'category' => 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                    'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                ),
                array(
                    'category' => 'HARM_CATEGORY_DANGEROUS_CONTENT',
                    'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                )
            )
        );

        $start_time = microtime(true); // Added before wp_remote_post

        $response = wp_remote_post($url, array(
            'method' => 'POST',
            'headers' => array(
                'Content-Type' => 'application/json'
            ),
            'body' => json_encode($data),
            'timeout' => 60 // Changed from 30 to 60
        ));

        $end_time = microtime(true); // Added after wp_remote_post
        $duration = $end_time - $start_time;
        // Added detailed error log with URL, duration and prompt length
        error_log('[Flux SEO] Gemini API call to ' . esc_url_raw($url) . ' duration: ' . round($duration, 3) . ' seconds. Prompt length: ' . strlen($prompt) . ' chars.');

        if (is_wp_error($response)) {
            // Modified error log for WP_Error
            error_log('[Flux SEO] Gemini API WP_Error: ' . $response->get_error_message());
            return false;
        }

        $http_code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);

        // Added check for HTTP error codes
        if ($http_code >= 400) {
            error_log('[Flux SEO] Gemini API HTTP Error: Code ' . $http_code . ' - Body: ' . $body);
            return false;
        }

        $result = json_decode($body, true);

        // Check if $result is null or not an array, which indicates a JSON decode error
        if (null === $result && json_last_error() !== JSON_ERROR_NONE) {
            error_log('[Flux SEO] Gemini API JSON Decode Error: ' . json_last_error_msg() . '. HTTP Code: ' . $http_code . '. Body: ' . $body);
            return false;
        }

        // Example of how one might extract text, structure depends on actual API response
        // This part should be robust to API response variations.
        if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
            return $result['candidates'][0]['content']['parts'][0]['text'];
        } else {
            // Modified final error log for unexpected structure or empty text
            error_log('[Flux SEO] Gemini API Response Error - Unexpected structure or empty text. HTTP Code: ' . $http_code . '. Body: ' . $body);
            return false;
        }
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