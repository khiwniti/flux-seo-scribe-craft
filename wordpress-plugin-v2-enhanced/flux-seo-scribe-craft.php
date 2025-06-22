
<?php
/**
 * Plugin Name: Flux SEO Scribe Craft
 * Plugin URI: https://github.com/khiwniti/flux-seo-scribe-craft
 * Description: Advanced AI-powered SEO content creation and optimization suite with multi-language support.
 * Version: 3.0.0
 * Author: Flux SEO Team
 * License: GPL v2 or later
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
define('FLUX_SEO_PLUGIN_VERSION', '3.0.0');

class FluxSeoScribeCraft {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        add_shortcode('flux_seo_app', array($this, 'render_app_shortcode'));
        add_action('wp_ajax_flux_seo_api', array($this, 'handle_ajax_request'));
        add_action('wp_ajax_nopriv_flux_seo_api', array($this, 'handle_ajax_request'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        
        // Hook for settings
        add_action('admin_init', array($this, 'register_settings'));
    }
    
    public function init() {
        load_plugin_textdomain('flux-seo-scribe-craft', false, dirname(plugin_basename(__FILE__)) . '/languages');
        
        // Create database tables on init if they don't exist
        $this->create_tables();
    }
    
    public function register_settings() {
        register_setting('flux_seo_settings', 'flux_seo_gemini_api_key');
        register_setting('flux_seo_settings', 'flux_seo_default_language');
        register_setting('flux_seo_settings', 'flux_seo_auto_generation_enabled');
    }
    
    public function create_tables() {
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
        
        // Settings table
        $settings_table = $wpdb->prefix . 'flux_seo_settings';
        $sql_settings = "CREATE TABLE $settings_table (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            setting_key varchar(100) NOT NULL,
            setting_value longtext,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY setting_key (setting_key)
        ) $charset_collate;";
        
        dbDelta($sql_settings);
    }
    
    public function register_rest_routes() {
        register_rest_route('flux-seo/v1', '/generate-content', array(
            'methods' => 'POST',
            'callback' => array($this, 'rest_generate_content'),
            'permission_callback' => array($this, 'check_permissions'),
        ));
        
        register_rest_route('flux-seo/v1', '/analyze-content', array(
            'methods' => 'POST',
            'callback' => array($this, 'rest_analyze_content'),
            'permission_callback' => array($this, 'check_permissions'),
        ));
        
        register_rest_route('flux-seo/v1', '/save-content', array(
            'methods' => 'POST',
            'callback' => array($this, 'rest_save_content'),
            'permission_callback' => array($this, 'check_permissions'),
        ));
        
        register_rest_route('flux-seo/v1', '/generation-history', array(
            'methods' => 'GET',
            'callback' => array($this, 'rest_get_history'),
            'permission_callback' => array($this, 'check_permissions'),
        ));
    }
    
    public function check_permissions() {
        return current_user_can('edit_posts');
    }
    
    public function enqueue_scripts() {
        wp_enqueue_script(
            'flux-seo-app',
            FLUX_SEO_PLUGIN_URL . 'assets/flux-seo-app.js',
            array('wp-element', 'wp-api-fetch'),
            FLUX_SEO_PLUGIN_VERSION,
            true
        );
        
        wp_enqueue_style(
            'flux-seo-app-style',
            FLUX_SEO_PLUGIN_URL . 'assets/flux-seo-app.css',
            array(),
            FLUX_SEO_PLUGIN_VERSION
        );
        
        wp_localize_script('flux-seo-app', 'fluxSeoData', array(
            'apiUrl' => rest_url('flux-seo/v1/'),
            'nonce' => wp_create_nonce('wp_rest'),
            'pluginUrl' => FLUX_SEO_PLUGIN_URL,
            'language' => get_locale() === 'th' ? 'th' : 'en',
            'geminiApiKey' => get_option('flux_seo_gemini_api_key', ''),
        ));
    }
    
    public function enqueue_admin_scripts($hook) {
        if (strpos($hook, 'flux-seo') === false) {
            return;
        }
        
        $this->enqueue_scripts();
    }
    
    public function render_app_shortcode($atts) {
        $atts = shortcode_atts(array(
            'height' => '800px',
            'width' => '100%',
            'component' => 'dashboard',
        ), $atts);
        
        $container_id = 'flux-seo-app-' . uniqid();
        
        ob_start();
        ?>
        <div id="<?php echo esc_attr($container_id); ?>" 
             class="flux-seo-app-container" 
             style="height: <?php echo esc_attr($atts['height']); ?>; width: <?php echo esc_attr($atts['width']); ?>;"
             data-component="<?php echo esc_attr($atts['component']); ?>">
            <div class="flux-seo-loading">
                <div class="flux-seo-spinner"></div>
                <p>Loading Flux SEO Scribe Craft...</p>
            </div>
        </div>
        <script type="text/javascript">
            document.addEventListener('DOMContentLoaded', function() {
                if (window.FluxSEOApp && typeof window.FluxSEOApp.init === 'function') {
                    window.FluxSEOApp.init('<?php echo esc_js($container_id); ?>');
                }
            });
        </script>
        <?php
        return ob_get_clean();
    }
    
    // REST API Endpoints
    public function rest_generate_content($request) {
        $params = $request->get_json_params();
        
        $topic = sanitize_text_field($params['topic'] ?? '');
        $language = sanitize_text_field($params['language'] ?? 'en');
        $keywords = sanitize_text_field($params['keywords'] ?? '');
        $tone = sanitize_text_field($params['tone'] ?? 'professional');
        $word_count = sanitize_text_field($params['wordCount'] ?? 'medium');
        $content_type = sanitize_text_field($params['contentType'] ?? 'blog');
        $target_audience = sanitize_text_field($params['targetAudience'] ?? 'general');
        
        if (empty($topic)) {
            return new WP_Error('missing_topic', 'Topic is required', array('status' => 400));
        }
        
        $generated_content = $this->call_gemini_ai_content_generation($topic, $language, $keywords, $tone, $word_count, $content_type, $target_audience);
        
        if ($generated_content) {
            // Save to history
            $this->save_generation_history($topic, $generated_content, $language, $keywords);
            
            return rest_ensure_response(array(
                'success' => true,
                'content' => $generated_content,
                'timestamp' => current_time('mysql')
            ));
        }
        
        return new WP_Error('generation_failed', 'Failed to generate content', array('status' => 500));
    }
    
    public function rest_analyze_content($request) {
        $params = $request->get_json_params();
        
        $content = wp_kses_post($params['content'] ?? '');
        $language = sanitize_text_field($params['language'] ?? 'en');
        $keywords = sanitize_text_field($params['keywords'] ?? '');
        
        if (empty($content)) {
            return new WP_Error('missing_content', 'Content is required for analysis', array('status' => 400));
        }
        
        $analysis = $this->analyze_content_quality($content, $language, $keywords);
        
        return rest_ensure_response(array(
            'success' => true,
            'analysis' => $analysis
        ));
    }
    
    public function rest_save_content($request) {
        $params = $request->get_json_params();
        
        $title = sanitize_text_field($params['title'] ?? '');
        $content = wp_kses_post($params['content'] ?? '');
        $meta_description = sanitize_text_field($params['metaDescription'] ?? '');
        $keywords = isset($params['keywords']) ? array_map('sanitize_text_field', (array)$params['keywords']) : array();
        $language = sanitize_text_field($params['language'] ?? 'en');
        
        $post_data = array(
            'post_title' => $title,
            'post_content' => $content,
            'post_status' => 'draft',
            'post_type' => 'post',
            'post_author' => get_current_user_id(),
            'meta_input' => array(
                '_flux_seo_meta_description' => $meta_description,
                '_flux_seo_keywords' => $keywords,
                '_flux_seo_language' => $language,
                '_flux_seo_generated' => true,
            )
        );
        
        $post_id = wp_insert_post($post_data);
        
        if ($post_id && !is_wp_error($post_id)) {
            return rest_ensure_response(array(
                'success' => true,
                'post_id' => $post_id,
                'edit_url' => admin_url('post.php?post=' . $post_id . '&action=edit')
            ));
        }
        
        return new WP_Error('save_failed', 'Failed to save content', array('status' => 500));
    }
    
    public function rest_get_history($request) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'flux_seo_generation_history';
        $limit = intval($request->get_param('limit') ?? 10);
        $offset = intval($request->get_param('offset') ?? 0);
        
        $results = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table_name ORDER BY generated_date DESC LIMIT %d OFFSET %d",
            $limit,
            $offset
        ));
        
        return rest_ensure_response(array(
            'success' => true,
            'history' => $results
        ));
    }
    
    private function call_gemini_ai_content_generation($topic, $language, $keywords, $tone, $word_count, $content_type, $target_audience) {
        $api_key = get_option('flux_seo_gemini_api_key', '');
        if (empty($api_key)) {
            return false;
        }
        
        $api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
        
        $word_count_map = array(
            'short' => '500-800',
            'medium' => '1000-1500',
            'long' => '2000-3000'
        );
        
        $target_words = $word_count_map[$word_count] ?? '1000-1500';
        
        $language_instruction = $language === 'th' 
            ? 'สร้างเนื้อหาเป็นภาษาไทยด้วยไวยากรณ์ที่ถูกต้อง บริบททางวัฒนธรรมที่เหมาะสม และการใช้คำที่เป็นธรรมชาติ'
            : 'Create content in native English with proper grammar, cultural context, and natural language flow';
        
        $keyword_instruction = !empty($keywords) ? "Target keywords: $keywords" : '';
        
        $prompt = "$language_instruction

Create a comprehensive $content_type about \"$topic\" with the following specifications:

**Requirements:**
- Language: " . ($language === 'th' ? 'Thai' : 'English') . "
- Word count: $target_words words
- Tone: $tone
- Target audience: $target_audience
- Content type: $content_type
- $keyword_instruction

**Structure:**
1. SEO-optimized title
2. Meta description (150-160 characters)
3. Engaging introduction
4. Well-structured main content with H2/H3 headings
5. Actionable insights and practical examples
6. Strong conclusion with call-to-action

**Quality Standards:**
- Professional, native language writing
- Industry-appropriate terminology
- Data-driven insights where applicable
- SEO-optimized without keyword stuffing
- Engaging and valuable for readers

Please format the response as a complete article ready for publication.";

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
                'temperature' => 0.8,
                'topP' => 0.8,
                'topK' => 40
            ),
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
    
    private function analyze_content_quality($content, $language, $keywords) {
        $word_count = str_word_count($content);
        $sentence_count = preg_match_all('/[.!?]+/', $content);
        $avg_sentence_length = $sentence_count > 0 ? $word_count / $sentence_count : 0;
        
        // Calculate keyword density
        $keyword_density = 0;
        if (!empty($keywords)) {
            $keyword_count = substr_count(strtolower($content), strtolower($keywords));
            $keyword_density = ($keyword_count / $word_count) * 100;
        }
        
        // Calculate readability score (simplified)
        $readability_score = max(0, min(100, 100 - ($avg_sentence_length * 2)));
        
        // Calculate SEO score
        $seo_score = 60; // Base score
        if ($word_count > 300) $seo_score += 10;
        if ($word_count > 1000) $seo_score += 10;
        if ($keyword_density > 0.5 && $keyword_density < 3) $seo_score += 15;
        if (preg_match('/<h[1-6]>/', $content)) $seo_score += 10;
        
        return array(
            'wordCount' => $word_count,
            'readabilityScore' => round($readability_score),
            'seoScore' => min(100, $seo_score),
            'keywordDensity' => round($keyword_density, 2),
            'suggestions' => $this->generate_content_suggestions($content, $language)
        );
    }
    
    private function generate_content_suggestions($content, $language) {
        $suggestions = array();
        
        if ($language === 'th') {
            if (strlen($content) < 1000) {
                $suggestions[] = 'เพิ่มความยาวของเนื้อหาเพื่อ SEO ที่ดีขึ้น';
            }
            if (!preg_match('/<h[1-6]>/', $content)) {
                $suggestions[] = 'เพิ่มหัวข้อย่อย (H2, H3) เพื่อโครงสร้างที่ดีขึ้น';
            }
            $suggestions[] = 'เพิ่มลิงก์ภายในไปยังเนื้อหาที่เกี่ยวข้อง';
        } else {
            if (strlen($content) < 1000) {
                $suggestions[] = 'Increase content length for better SEO performance';
            }
            if (!preg_match('/<h[1-6]>/', $content)) {
                $suggestions[] = 'Add subheadings (H2, H3) for better structure';
            }
            $suggestions[] = 'Add internal links to related content';
        }
        
        return $suggestions;
    }
    
    private function save_generation_history($topic, $content, $language, $keywords) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'flux_seo_generation_history';
        $word_count = str_word_count($content);
        $analysis = $this->analyze_content_quality($content, $language, $keywords);
        
        $wpdb->insert(
            $table_name,
            array(
                'topic' => $topic,
                'content' => $content,
                'language' => $language,
                'word_count' => $word_count,
                'seo_score' => $analysis['seoScore'],
                'keywords' => $keywords,
                'generated_date' => current_time('mysql')
            )
        );
    }
    
    public function add_admin_menu() {
        add_menu_page(
            'Flux SEO Scribe Craft',
            'Flux SEO',
            'edit_posts',
            'flux-seo-main',
            array($this, 'admin_page'),
            'dashicons-edit-page',
            30
        );
        
        add_submenu_page(
            'flux-seo-main',
            'Content Generator',
            'Generator',
            'edit_posts',
            'flux-seo-generator',
            array($this, 'generator_page')
        );
        
        add_submenu_page(
            'flux-seo-main',
            'Analytics',
            'Analytics',
            'edit_posts',
            'flux-seo-analytics',
            array($this, 'analytics_page')
        );
        
        add_submenu_page(
            'flux-seo-main',
            'Settings',
            'Settings',
            'manage_options',
            'flux-seo-settings',
            array($this, 'settings_page')
        );
    }
    
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1>Flux SEO Scribe Craft</h1>
            <div id="flux-seo-admin-dashboard" class="flux-seo-admin-container">
                <div class="flux-seo-loading">
                    <div class="flux-seo-spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        </div>
        <?php
    }
    
    public function generator_page() {
        ?>
        <div class="wrap">
            <h1>Content Generator</h1>
            <div id="flux-seo-admin-generator" class="flux-seo-admin-container">
                <div class="flux-seo-loading">Loading generator...</div>
            </div>
        </div>
        <?php
    }
    
    public function analytics_page() {
        ?>
        <div class="wrap">
            <h1>SEO Analytics</h1>
            <div id="flux-seo-admin-analytics" class="flux-seo-admin-container">
                <div class="flux-seo-loading">Loading analytics...</div>
            </div>
        </div>
        <?php
    }
    
    public function settings_page() {
        if (isset($_POST['submit'])) {
            update_option('flux_seo_gemini_api_key', sanitize_text_field($_POST['gemini_api_key']));
            update_option('flux_seo_default_language', sanitize_text_field($_POST['default_language']));
            echo '<div class="notice notice-success"><p>Settings saved!</p></div>';
        }
        
        $api_key = get_option('flux_seo_gemini_api_key', '');
        $default_language = get_option('flux_seo_default_language', 'en');
        ?>
        <div class="wrap">
            <h1>Flux SEO Settings</h1>
            <form method="post" action="">
                <table class="form-table">
                    <tr>
                        <th scope="row">Gemini AI API Key</th>
                        <td>
                            <input type="password" name="gemini_api_key" value="<?php echo esc_attr($api_key); ?>" class="regular-text" />
                            <p class="description">Enter your Google Gemini AI API key for content generation.</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Default Language</th>
                        <td>
                            <select name="default_language">
                                <option value="en" <?php selected($default_language, 'en'); ?>>English</option>
                                <option value="th" <?php selected($default_language, 'th'); ?>>Thai</option>
                            </select>
                        </td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
            
            <div id="flux-seo-admin-settings" class="flux-seo-admin-container">
                <h2>Advanced Settings</h2>
                <div class="flux-seo-loading">Loading advanced settings...</div>
            </div>
        </div>
        <?php
    }
    
    // Legacy AJAX handler for backward compatibility
    public function handle_ajax_request() {
        if (!wp_verify_nonce($_POST['nonce'], 'flux_seo_nonce')) {
            wp_die('Security check failed');
        }
        
        $action = sanitize_text_field($_POST['flux_action']);
        
        switch ($action) {
            case 'generate_content':
                $this->ajax_generate_content();
                break;
            case 'analyze_content':
                $this->ajax_analyze_content();
                break;
            default:
                wp_send_json_error('Invalid action');
        }
    }
    
    private function ajax_generate_content() {
        $topic = sanitize_text_field($_POST['topic'] ?? '');
        $language = sanitize_text_field($_POST['language'] ?? 'en');
        
        if (empty($topic)) {
            wp_send_json_error('Topic is required');
            return;
        }
        
        $content = $this->call_gemini_ai_content_generation($topic, $language, '', 'professional', 'medium', 'blog', 'general');
        
        if ($content) {
            wp_send_json_success(array('content' => $content));
        } else {
            wp_send_json_error('Failed to generate content');
        }
    }
    
    private function ajax_analyze_content() {
        $content = wp_kses_post($_POST['content'] ?? '');
        $language = sanitize_text_field($_POST['language'] ?? 'en');
        
        if (empty($content)) {
            wp_send_json_error('Content is required');
            return;
        }
        
        $analysis = $this->analyze_content_quality($content, $language, '');
        wp_send_json_success($analysis);
    }
}

// Initialize the plugin
new FluxSeoScribeCraft();

// Activation hook
register_activation_hook(__FILE__, 'flux_seo_activate');
function flux_seo_activate() {
    $plugin = new FluxSeoScribeCraft();
    $plugin->create_tables();
    
    // Set default options
    if (!get_option('flux_seo_default_language')) {
        update_option('flux_seo_default_language', 'en');
    }
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'flux_seo_deactivate');
function flux_seo_deactivate() {
    // Clean up scheduled events if any
    wp_clear_scheduled_hook('flux_seo_auto_generation');
}

// Uninstall hook
register_uninstall_hook(__FILE__, 'flux_seo_uninstall');
function flux_seo_uninstall() {
    global $wpdb;
    
    // Drop custom tables
    $wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}flux_seo_generation_history");
    $wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}flux_seo_settings");
    
    // Delete options
    delete_option('flux_seo_gemini_api_key');
    delete_option('flux_seo_default_language');
    delete_option('flux_seo_auto_generation_enabled');
}
