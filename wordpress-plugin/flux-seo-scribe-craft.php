
<?php
/**
 * Plugin Name: Flux SEO Scribe Craft - Complete Edition
 * Plugin URI: https://github.com/khiwniti/flux-seo-scribe-craft
 * Description: Complete AI-powered SEO optimization suite with content generation, analytics, and manual intelligence features. Professional WordPress integration with multi-language support.
 * Version: 4.0.0
 * Author: Flux SEO Team
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: flux-seo-scribe-craft
 * Requires at least: 5.0
 * Tested up to: 6.4
 * Requires PHP: 7.4
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('FLUX_SEO_PLUGIN_URL', plugin_dir_url(__FILE__));
define('FLUX_SEO_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('FLUX_SEO_PLUGIN_VERSION', '4.0.0');

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
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_menu', array($this, 'add_settings_page'));

        // Add admin body class for our plugin page
        add_filter('admin_body_class', array($this, 'add_admin_body_class'));
        
        // Create database tables
        register_activation_hook(__FILE__, array($this, 'create_database_tables'));
    }
    
    public function init() {
        load_plugin_textdomain('flux-seo-scribe-craft', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
    
    public function create_database_tables() {
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
        // Load React components first
        wp_enqueue_script(
            'flux-seo-components',
            FLUX_SEO_PLUGIN_URL . 'assets/components/LanguageContext.js',
            array(),
            FLUX_SEO_PLUGIN_VERSION,
            true
        );
        
        wp_enqueue_script(
            'flux-seo-content-form',
            FLUX_SEO_PLUGIN_URL . 'assets/components/ContentGenerationForm.js',
            array('flux-seo-components'),
            FLUX_SEO_PLUGIN_VERSION,
            true
        );
        
        wp_enqueue_script(
            'flux-seo-analyzer',
            FLUX_SEO_PLUGIN_URL . 'assets/components/ContentAnalyzer.js',
            array('flux-seo-components'),
            FLUX_SEO_PLUGIN_VERSION,
            true
        );
        
        wp_enqueue_script(
            'flux-seo-analytics',
            FLUX_SEO_PLUGIN_URL . 'assets/components/AnalyticsOverview.js',
            array('flux-seo-components'),
            FLUX_SEO_PLUGIN_VERSION,
            true
        );
        
        // Main application
        wp_enqueue_script(
            'flux-seo-complete-app',
            FLUX_SEO_PLUGIN_URL . 'assets/flux-seo-complete-app.js',
            array('flux-seo-content-form', 'flux-seo-analyzer', 'flux-seo-analytics'),
            FLUX_SEO_PLUGIN_VERSION,
            true
        );
        
        // Enhanced styles
        wp_enqueue_style(
            'flux-seo-enhanced-styles',
            FLUX_SEO_PLUGIN_URL . 'assets/flux-seo-styles.css',
            array(),
            FLUX_SEO_PLUGIN_VERSION
        );
        
        // WordPress admin specific styles
        if (is_admin()) {
            wp_enqueue_style(
                'flux-seo-admin-styles',
                FLUX_SEO_PLUGIN_URL . 'wordpress-overrides.css',
                array('flux-seo-enhanced-styles'),
                FLUX_SEO_PLUGIN_VERSION
            );
        }
        
        // Localize script with data
        wp_localize_script('flux-seo-complete-app', 'fluxSeoData', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('flux_seo_nonce'),
            'pluginUrl' => FLUX_SEO_PLUGIN_URL,
            'isAdmin' => is_admin(),
            'currentUser' => wp_get_current_user()->display_name,
            'language' => get_locale() === 'th_TH' ? 'th' : 'en',
            'geminiApiKey' => get_option('flux_seo_gemini_api_key', ''),
            'capabilities' => array(
                'manage_options' => current_user_can('manage_options'),
                'edit_posts' => current_user_can('edit_posts'),
                'publish_posts' => current_user_can('publish_posts')
            )
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
                    <p>Initializing complete SEO optimization suite...</p>
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
        $content = isset($data['content']) ? $data['content'] : '';
        $language = isset($data['language']) ? $data['language'] : 'en';
        
        // Enhanced analysis
        $word_count = str_word_count($content);
        $sentence_count = preg_match_all('/[.!?]+/', $content);
        $avg_sentence_length = $sentence_count > 0 ? $word_count / $sentence_count : 0;
        
        // Calculate scores
        $seo_score = min(100, max(0, 60 + ($word_count > 300 ? 15 : 0) + ($word_count > 1000 ? 15 : 0)));
        $readability = max(0, min(100, 100 - ($avg_sentence_length * 2)));
        
        $analysis = array(
            'seo_score' => $seo_score,
            'readability' => round($readability),
            'keyword_density' => '2.5%',
            'word_count' => $word_count,
            'suggestions' => array(
                $language === 'th' ? 'เพิ่มหัวข้อย่อยเพื่อโครงสร้างที่ดีขึ้น' : 'Add subheadings for better structure',
                $language === 'th' ? 'เพิ่มลิงก์ภายในไปยังเนื้อหาที่เกี่ยวข้อง' : 'Add internal links to related content',
                $language === 'th' ? 'ปรับปรุง meta description' : 'Optimize meta description',
                $language === 'th' ? 'เพิ่มคีย์เวิร์ดที่เกี่ยวข้อง' : 'Include more relevant keywords'
            )
        );
        
        wp_send_json_success($analysis);
    }
    
    private function handle_content_generation($data_json) {
        $data = json_decode($data_json, true);
        $api_key = get_option('flux_seo_gemini_api_key', '');
        
        if (empty($api_key)) {
            wp_send_json_error('Gemini API key not configured. Please set it in WordPress admin.');
            return;
        }
        
        $topic = isset($data['topic']) ? sanitize_text_field($data['topic']) : '';
        $language = isset($data['language']) ? sanitize_text_field($data['language']) : 'en';
        $keywords = isset($data['keywords']) ? sanitize_text_field($data['keywords']) : '';
        $tone = isset($data['tone']) ? sanitize_text_field($data['tone']) : 'professional';
        $word_count = isset($data['wordCount']) ? sanitize_text_field($data['wordCount']) : 'medium';
        
        $generated_content = $this->call_gemini_ai($topic, $language, $keywords, $tone, $word_count);
        
        if ($generated_content) {
            // Save to history
            $this->save_generation_history($topic, $generated_content, $language, $keywords);
            
            wp_send_json_success(array(
                'title' => 'AI Generated: ' . $topic,
                'content' => $generated_content,
                'meta_description' => 'AI-generated content about ' . $topic . ' with professional insights and actionable tips.',
                'keywords' => array_filter(explode(',', $keywords))
            ));
        } else {
            wp_send_json_error('Failed to generate content. Please check your API key and try again.');
        }
    }
    
    private function call_gemini_ai($topic, $language, $keywords, $tone, $word_count) {
        $api_key = get_option('flux_seo_gemini_api_key', '');
        $api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
        
        $word_count_map = array(
            'short' => '500-800',
            'medium' => '1000-1500',
            'long' => '2000-3000'
        );
        
        $target_words = $word_count_map[$word_count] ?? '1000-1500';
        
        $language_instruction = $language === 'th' 
            ? 'สร้างเนื้อหาเป็นภาษาไทยด้วยไวยากรณ์ที่ถูกต้อง'
            : 'Create content in native English with proper grammar';
        
        $keyword_instruction = !empty($keywords) ? "Target keywords: $keywords" : '';
        
        $prompt = "$language_instruction

Create comprehensive content about \"$topic\" with these specifications:

- Language: " . ($language === 'th' ? 'Thai' : 'English') . "
- Word count: $target_words words
- Tone: $tone
- $keyword_instruction

Structure:
1. Engaging introduction
2. Main content with H2/H3 headings
3. Actionable insights
4. Strong conclusion

Make it SEO-optimized and valuable for readers.";

        $body = array(
            'contents' => array(
                array(
                    'parts' => array(
                        array('text' => $prompt)
                    )
                )
            ),
            'generationConfig' => array(
                'maxOutputTokens' => 4096,
                'temperature' => 0.8
            )
        );
        
        $response = wp_remote_post($api_url . '?key=' . $api_key, array(
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
            'body' => json_encode($body),
            'timeout' => 90
        ));
        
        if (is_wp_error($response)) {
            error_log('Gemini AI API Error: ' . $response->get_error_message());
            return false;
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
            return $data['candidates'][0]['content']['parts'][0]['text'];
        }
        
        return false;
    }
    
    private function save_generation_history($topic, $content, $language, $keywords) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'flux_seo_generation_history';
        $word_count = str_word_count($content);
        
        $wpdb->insert(
            $table_name,
            array(
                'topic' => $topic,
                'content' => $content,
                'language' => $language,
                'word_count' => $word_count,
                'seo_score' => 85, // Default score
                'keywords' => $keywords,
                'meta_description' => substr($content, 0, 160),
                'generated_date' => current_time('mysql')
            )
        );
    }

    public function register_settings() {
        register_setting('flux_seo_settings', 'flux_seo_gemini_api_key');
    }

    public function add_settings_page() {
        add_options_page(
            'Flux SEO Settings',
            'Flux SEO API',
            'manage_options',
            'flux-seo-settings',
            array($this, 'render_settings_page')
        );
    }

    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1>Flux SEO Scribe Craft Settings</h1>
            <form method="post" action="options.php">
                <?php
                settings_fields('flux_seo_settings');
                do_settings_sections('flux_seo_settings');
                ?>
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row"><label for="flux_seo_gemini_api_key">Gemini AI API Key</label></th>
                        <td>
                            <input type="password"
                                   id="flux_seo_gemini_api_key"
                                   name="flux_seo_gemini_api_key"
                                   value="<?php echo esc_attr(get_option('flux_seo_gemini_api_key')); ?>"
                                   class="regular-text"
                                   placeholder="Enter your Gemini API Key"/>
                            <p class="description">
                                Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a>.
                            </p>
                        </td>
                    </tr>
                </table>
                <?php submit_button('Save Settings'); ?>
            </form>
        </div>
        <?php
    }
}

// Initialize the plugin
new FluxSEOScribeCraft();

// Activation hook
register_activation_hook(__FILE__, 'flux_seo_activate');
function flux_seo_activate() {
    add_option('flux_seo_version', FLUX_SEO_PLUGIN_VERSION);
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'flux_seo_deactivate');
function flux_seo_deactivate() {
    delete_transient('flux_seo_cache');
}
