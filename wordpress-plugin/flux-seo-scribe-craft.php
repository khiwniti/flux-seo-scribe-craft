
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
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_scripts'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_shortcode('flux_seo_scribe_craft', array($this, 'shortcode_handler'));
        
        // AJAX handlers for the React app
        add_action('wp_ajax_flux_seo_proxy', array($this, 'ajax_proxy_handler'));
        add_action('wp_ajax_nopriv_flux_seo_proxy', array($this, 'ajax_proxy_handler'));

        // Settings page hooks
        add_action('admin_init', array($this, 'flux_seo_register_settings'));
        add_action('admin_menu', array($this, 'flux_seo_add_settings_page'));

        // Add admin body class for our plugin page
        add_filter('admin_body_class', array($this, 'add_admin_body_class'));
    }
    
    public function init() {
        // Plugin initialization
        load_plugin_textdomain('flux-seo-scribe-craft', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
    
    public function enqueue_admin_scripts($hook) {
        // Only enqueue on our plugin's admin page
        if ($hook !== 'toplevel_page_flux-seo-scribe-craft') {
            return;
        }
        
        $this->enqueue_app_assets();
    }
    
    public function enqueue_frontend_scripts() {
        // Only enqueue on pages that use the shortcode
        if (!is_admin() && $this->has_shortcode()) {
            $this->enqueue_app_assets();
        }
    }
    
    private function enqueue_app_assets() {
        // Enqueue CSS
        wp_enqueue_style(
            'flux-seo-scribe-craft-css',
            FLUX_SEO_PLUGIN_URL . 'flux-seo-scribe-craft.css',
            array(),
            FLUX_SEO_PLUGIN_VERSION
        );
        
        // Enqueue WordPress admin specific styles
        if (is_admin()) {
            wp_enqueue_style(
                'flux-seo-admin-styles',
                FLUX_SEO_PLUGIN_URL . 'wordpress-overrides.css',
                array('flux-seo-scribe-craft-css'),
                FLUX_SEO_PLUGIN_VERSION
            );
        }
        
        // Enqueue JavaScript
        wp_enqueue_script(
            'flux-seo-wordpress-app-js',
            FLUX_SEO_PLUGIN_URL . 'flux-seo-wordpress-app.js',
            array('wp-element', 'jquery'),
            FLUX_SEO_PLUGIN_VERSION,
            true
        );
        
        // Localize script with data
        wp_localize_script('flux-seo-wordpress-app-js', 'fluxSeoData', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('flux_seo_nonce'),
            'pluginUrl' => FLUX_SEO_PLUGIN_URL,
            'isAdmin' => is_admin(),
            'currentUser' => wp_get_current_user()->display_name,
            'capabilities' => array(
                'manage_options' => current_user_can('manage_options'),
                'edit_posts' => current_user_can('edit_posts'),
                'publish_posts' => current_user_can('publish_posts')
            ),
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
    
    public function add_admin_body_class($classes) {
        $screen = get_current_screen();
        if ($screen && $screen->id === 'toplevel_page_flux-seo-scribe-craft') {
            $classes .= ' flux-seo-admin-page';
        }
        return $classes;
    }
    
    public function admin_page() {
        ?>
        <div class="flux-seo-admin-wrapper">
            <div id="flux-seo-admin-app" class="flux-seo-full-page">
                <?php echo $this->render_app('admin'); ?>
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
        
        return '<div id="flux-seo-shortcode-app" style="' . $style . '">' . $this->render_app('frontend') . '</div>';
    }
    
    private function render_app($context = 'frontend') {
        $container_id = $context === 'admin' ? 'flux-seo-admin-root' : 'flux-seo-frontend-root';
        
        ob_start();
        ?>
        <div id="<?php echo esc_attr($container_id); ?>" class="flux-seo-app-container <?php echo esc_attr($context); ?>">
            <div class="flux-seo-loading-screen">
                <div class="flux-seo-loading-content">
                    <div class="flux-seo-loading-spinner"></div>
                    <h3>🚀 Loading Flux SEO Scribe Craft</h3>
                    <p>Initializing professional SEO optimization suite...</p>
                </div>
            </div>
        </div>
        
        <script type="text/javascript">
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🎯 Flux SEO: DOM loaded for <?php echo esc_js($context); ?> context');
            
            // Initialize the React app
            if (typeof window.FluxSEOApp !== 'undefined') {
                window.FluxSEOApp.init('<?php echo esc_js($container_id); ?>');
            } else {
                console.log('⏳ Waiting for FluxSEOApp to load...');
                
                // Wait for the app to be available
                let attempts = 0;
                const maxAttempts = 50;
                const checkInterval = setInterval(() => {
                    attempts++;
                    if (typeof window.FluxSEOApp !== 'undefined') {
                        console.log('✅ FluxSEOApp loaded successfully');
                        clearInterval(checkInterval);
                        window.FluxSEOApp.init('<?php echo esc_js($container_id); ?>');
                    } else if (attempts >= maxAttempts) {
                        console.error('❌ FluxSEOApp failed to load after maximum attempts');
                        clearInterval(checkInterval);
                        document.getElementById('<?php echo esc_js($container_id); ?>').innerHTML = 
                            '<div class="flux-seo-error">Failed to load the application. Please refresh the page.</div>';
                    }
                }, 200);
            }
        });
        </script>
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
        $data = isset($_POST['data']) ? stripslashes_deep($_POST['data']) : null;

        error_log('[Flux SEO] AJAX Handler: Action: ' . $action);
        
        switch ($action) {
            case 'analyze_content':
                $this->handle_content_analysis($data);
                break;
            case 'generate_content':
                $this->handle_content_generation($data);
                break;
            default:
                wp_send_json_error('Invalid action: ' . $action);
        }
    }
    
    private function handle_content_analysis($data_json) {
        $data = json_decode($data_json, true);
        
        // Mock content analysis
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
        
        wp_send_json_success($analysis);
    }
    
    private function handle_content_generation($data_json) {
        $data = json_decode($data_json, true);
        
        // Mock content generation
        $generated_content = array(
            'title' => 'SEO Optimized Article: ' . (isset($data['topic']) ? sanitize_text_field($data['topic']) : 'N/A'),
            'content' => 'This is a generated article about ' . (isset($data['topic']) ? sanitize_text_field($data['topic']) : 'N/A') . '. Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
            'meta_description' => 'Learn about ' . (isset($data['topic']) ? sanitize_text_field($data['topic']) : 'N/A') . ' with our comprehensive guide.',
            'keywords' => array('seo', 'optimization', (isset($data['topic']) ? sanitize_text_field($data['topic']) : 'N/A'))
        );
        
        wp_send_json_success($generated_content);
    }

    public function flux_seo_register_settings() {
        register_setting(
            'flux_seo_api_settings_group',
            'flux_seo_gemini_api_key',
            array(
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
                'default' => ''
            )
        );
    }

    public function flux_seo_add_settings_page() {
        add_options_page(
            'Flux SEO API Key',
            'Flux SEO API Key',
            'manage_options',
            'flux-seo-api-key-settings',
            array($this, 'flux_seo_render_settings_page')
        );
    }

    public function flux_seo_render_settings_page() {
        ?>
        <div class="wrap">
            <h1>Flux SEO Gemini API Key Configuration</h1>
            <form method="post" action="options.php">
                <?php
                settings_fields('flux_seo_api_settings_group');
                do_settings_sections('flux_seo_api_settings_group');
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

    private function get_localized_strings() {
        return array(
            'loading' => __('Loading...', 'flux-seo-scribe-craft'),
            'error' => __('Error occurred', 'flux-seo-scribe-craft'),
            'success' => __('Success!', 'flux-seo-scribe-craft'),
        );
    }
}

// Initialize the plugin
new FluxSEOScribeCraft();

// Activation hook
register_activation_hook(__FILE__, 'flux_seo_activate');
function flux_seo_activate() {
    add_option('flux_seo_version', FLUX_SEO_PLUGIN_VERSION);
    
    if (file_exists(FLUX_SEO_PLUGIN_PATH . 'install.php')) {
        include_once FLUX_SEO_PLUGIN_PATH . 'install.php';
    }
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'flux_seo_deactivate');
function flux_seo_deactivate() {
    delete_transient('flux_seo_cache');
}

// Uninstall hook
register_uninstall_hook(__FILE__, 'flux_seo_uninstall');
function flux_seo_uninstall() {
    if (file_exists(FLUX_SEO_PLUGIN_PATH . 'uninstall.php')) {
        include_once FLUX_SEO_PLUGIN_PATH . 'uninstall.php';
    }
}
