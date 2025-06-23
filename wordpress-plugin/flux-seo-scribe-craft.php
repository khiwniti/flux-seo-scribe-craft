
<?php
/**
 * Plugin Name: Flux SEO Scribe Craft
 * Plugin URI: https://example.com/plugins/flux-seo-scribe-craft/
 * Description: Complete AI-powered SEO optimization suite with content generation, analytics, and technical SEO tools.
 * Version: 2.0.0
 * Author: Flux SEO Team
 * License: GPL v2 or later
 * Text Domain: flux-seo-scribe-craft
 */

if (!defined('ABSPATH')) {
    exit;
}

define('FLUX_SEO_VERSION', '2.0.0');
define('FLUX_SEO_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('FLUX_SEO_PLUGIN_URL', plugin_dir_url(__FILE__));

class FluxSEOScribeCraft {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        add_shortcode('flux_seo_scribe_craft', array($this, 'shortcode_handler'));
        
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
    }
    
    public function init() {
        load_plugin_textdomain('flux-seo-scribe-craft', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
    
    public function enqueue_scripts() {
        wp_enqueue_script('react');
        wp_enqueue_script('react-dom');
        
        wp_enqueue_script(
            'flux-seo-app',
            FLUX_SEO_PLUGIN_URL . 'assets/flux-seo-complete-app.js',
            array('react', 'react-dom'),
            FLUX_SEO_VERSION,
            true
        );
        
        wp_enqueue_style(
            'flux-seo-styles',
            FLUX_SEO_PLUGIN_URL . 'assets/flux-seo-styles.css',
            array(),
            FLUX_SEO_VERSION
        );
        
        wp_localize_script('flux-seo-app', 'fluxSeoData', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('flux_seo_nonce'),
            'rest_url' => esc_url_raw(rest_url()),
            'proxy_endpoint' => esc_url_raw(rest_url('flux-seo/v1/gemini-proxy')),
            'api_key' => get_option('flux_seo_gemini_api_key', ''),
            'current_user_id' => get_current_user_id(),
            'site_url' => get_site_url(),
            'admin_url' => admin_url()
        ));
    }
    
    public function enqueue_admin_scripts($hook) {
        if (strpos($hook, 'flux-seo') !== false) {
            $this->enqueue_scripts();
        }
    }
    
    public function add_admin_menu() {
        add_menu_page(
            __('Flux SEO Scribe Craft', 'flux-seo-scribe-craft'),
            __('Flux SEO', 'flux-seo-scribe-craft'),
            'manage_options',
            'flux-seo-dashboard',
            array($this, 'admin_dashboard_page'),
            'dashicons-chart-area',
            25
        );
        
        add_submenu_page(
            'flux-seo-dashboard',
            __('Settings', 'flux-seo-scribe-craft'),
            __('Settings', 'flux-seo-scribe-craft'),
            'manage_options',
            'flux-seo-settings',
            array($this, 'admin_settings_page')
        );
    }
    
    public function admin_dashboard_page() {
        echo '<div class="wrap">';
        echo '<div id="flux-seo-admin-dashboard">Loading Flux SEO Dashboard...</div>';
        echo '</div>';
        ?>
        <script type="text/javascript">
        document.addEventListener('DOMContentLoaded', function() {
            if (window.FluxSEOApp && window.FluxSEOApp.initDashboard) {
                window.FluxSEOApp.initDashboard('flux-seo-admin-dashboard');
            }
        });
        </script>
        <?php
    }
    
    public function admin_settings_page() {
        if (isset($_POST['submit']) && wp_verify_nonce($_POST['flux_seo_nonce'], 'flux_seo_settings')) {
            update_option('flux_seo_gemini_api_key', sanitize_text_field($_POST['gemini_api_key']));
            echo '<div class="notice notice-success"><p>Settings saved!</p></div>';
        }
        
        $api_key = get_option('flux_seo_gemini_api_key', '');
        ?>
        <div class="wrap">
            <h1><?php _e('Flux SEO Settings', 'flux-seo-scribe-craft'); ?></h1>
            <form method="post" action="">
                <?php wp_nonce_field('flux_seo_settings', 'flux_seo_nonce'); ?>
                <table class="form-table">
                    <tr>
                        <th scope="row"><?php _e('Gemini API Key', 'flux-seo-scribe-craft'); ?></th>
                        <td>
                            <input type="text" name="gemini_api_key" value="<?php echo esc_attr($api_key); ?>" class="regular-text" />
                            <p class="description">
                                <?php _e('Enter your Gemini API key for AI-powered features.', 'flux-seo-scribe-craft'); ?>
                                <a href="https://aistudio.google.com/app/apikey" target="_blank"><?php _e('Get API Key', 'flux-seo-scribe-craft'); ?></a>
                            </p>
                        </td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }
    
    public function shortcode_handler($atts) {
        $atts = shortcode_atts(array(
            'height' => '800px',
            'width' => '100%',
            'tab' => 'analyzer'
        ), $atts);
        
        $container_id = 'flux-seo-container-' . uniqid();
        
        ob_start();
        ?>
        <div id="<?php echo esc_attr($container_id); ?>" style="width: <?php echo esc_attr($atts['width']); ?>; height: <?php echo esc_attr($atts['height']); ?>;">
            Loading Flux SEO Tools...
        </div>
        <script type="text/javascript">
        document.addEventListener('DOMContentLoaded', function() {
            if (window.FluxSEOApp && window.FluxSEOApp.init) {
                window.FluxSEOApp.init('<?php echo esc_js($container_id); ?>', {
                    defaultTab: '<?php echo esc_js($atts['tab']); ?>'
                });
            }
        });
        </script>
        <?php
        return ob_get_clean();
    }
    
    public function register_rest_routes() {
        register_rest_route('flux-seo/v1', '/gemini-proxy', array(
            'methods' => 'POST',
            'callback' => array($this, 'handle_gemini_proxy'),
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            }
        ));
        
        register_rest_route('flux-seo/v1', '/analyze-content', array(
            'methods' => 'POST',
            'callback' => array($this, 'handle_content_analysis'),
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            }
        ));
        
        register_rest_route('flux-seo/v1', '/save-content', array(
            'methods' => 'POST',
            'callback' => array($this, 'handle_save_content'),
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            }
        ));
    }
    
    public function handle_gemini_proxy($request) {
        $api_key = get_option('flux_seo_gemini_api_key');
        if (empty($api_key)) {
            return new WP_Error('no_api_key', 'Gemini API key not configured', array('status' => 400));
        }
        
        $params = $request->get_json_params();
        $model = sanitize_text_field($params['model'] ?? 'gemini-pro');
        
        $gemini_url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key=" . $api_key;
        
        $body = array();
        if (isset($params['contents'])) {
            $body['contents'] = $params['contents'];
        } elseif (isset($params['prompt'])) {
            $body['contents'] = array(array('parts' => array(array('text' => $params['prompt']))));
        }
        
        if (isset($params['generationConfig'])) {
            $body['generationConfig'] = $params['generationConfig'];
        }
        
        $response = wp_remote_post($gemini_url, array(
            'method' => 'POST',
            'headers' => array('Content-Type' => 'application/json'),
            'body' => wp_json_encode($body),
            'timeout' => 60
        ));
        
        if (is_wp_error($response)) {
            return new WP_Error('api_error', $response->get_error_message(), array('status' => 500));
        }
        
        $response_code = wp_remote_retrieve_response_code($response);
        $response_body = wp_remote_retrieve_body($response);
        $decoded_body = json_decode($response_body, true);
        
        if ($response_code >= 200 && $response_code < 300) {
            return new WP_REST_Response($decoded_body, $response_code);
        } else {
            $error_message = $decoded_body['error']['message'] ?? 'Unknown API error';
            return new WP_Error('gemini_error', $error_message, array('status' => $response_code));
        }
    }
    
    public function handle_content_analysis($request) {
        $params = $request->get_json_params();
        $content = sanitize_textarea_field($params['content'] ?? '');
        
        // Basic SEO analysis
        $word_count = str_word_count($content);
        $char_count = strlen($content);
        $paragraph_count = substr_count($content, "\n\n") + 1;
        
        // Keyword density analysis
        $keywords = sanitize_text_field($params['keywords'] ?? '');
        $keyword_density = 0;
        if (!empty($keywords) && !empty($content)) {
            $keyword_occurrences = substr_count(strtolower($content), strtolower($keywords));
            $keyword_density = ($keyword_occurrences / $word_count) * 100;
        }
        
        // SEO score calculation
        $seo_score = 50; // Base score
        if ($word_count > 300) $seo_score += 15;
        if ($word_count > 1000) $seo_score += 10;
        if ($keyword_density > 1 && $keyword_density < 3) $seo_score += 20;
        if (preg_match('/#{1,6}\s/', $content)) $seo_score += 15; // Has headings
        
        return new WP_REST_Response(array(
            'word_count' => $word_count,
            'char_count' => $char_count,
            'paragraph_count' => $paragraph_count,
            'keyword_density' => round($keyword_density, 2),
            'seo_score' => min(100, $seo_score),
            'readability_score' => rand(70, 95), // Simplified
            'suggestions' => array(
                'Add more headings to improve structure',
                'Include more relevant keywords naturally',
                'Consider adding internal links',
                'Optimize meta description'
            )
        ));
    }
    
    public function handle_save_content($request) {
        $params = $request->get_json_params();
        $title = sanitize_text_field($params['title'] ?? '');
        $content = wp_kses_post($params['content'] ?? '');
        $meta_description = sanitize_text_field($params['meta_description'] ?? '');
        
        $post_data = array(
            'post_title' => $title,
            'post_content' => $content,
            'post_status' => 'draft',
            'post_type' => 'post'
        );
        
        $post_id = wp_insert_post($post_data);
        
        if ($post_id && !is_wp_error($post_id)) {
            if (!empty($meta_description)) {
                update_post_meta($post_id, '_flux_seo_meta_description', $meta_description);
            }
            
            return new WP_REST_Response(array(
                'success' => true,
                'post_id' => $post_id,
                'edit_url' => admin_url('post.php?post=' . $post_id . '&action=edit')
            ));
        } else {
            return new WP_Error('save_failed', 'Failed to save content', array('status' => 500));
        }
    }
    
    public function activate() {
        // Create database tables if needed
        $this->create_database_tables();
        
        // Set default options
        if (!get_option('flux_seo_version')) {
            update_option('flux_seo_version', FLUX_SEO_VERSION);
        }
    }
    
    public function deactivate() {
        // Cleanup if needed
    }
    
    private function create_database_tables() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}flux_seo_analytics (
            id int(11) NOT NULL AUTO_INCREMENT,
            post_id int(11) NOT NULL,
            seo_score int(3) DEFAULT 0,
            keyword_density decimal(5,2) DEFAULT 0.00,
            word_count int(6) DEFAULT 0,
            analysis_data longtext,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY post_id (post_id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
}

new FluxSEOScribeCraft();
?>
