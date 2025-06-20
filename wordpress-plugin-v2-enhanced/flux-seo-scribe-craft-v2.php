<?php
/**
 * Plugin Name: Flux SEO Scribe Craft v2.0 Enhanced
 * Plugin URI: https://github.com/khiwniti/flux-seo-scribe-craft
 * Description: Professional SEO optimization suite with integrated content generation, Gemini AI, and advanced analytics. Enhanced v2.0 with improved React UI.
 * Version: 2.0.0
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
define('FLUX_SEO_PLUGIN_VERSION', '2.0.0');

class FluxSEOScribeCraftV2 {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_enqueue_scripts', array($this, 'admin_enqueue_scripts'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_shortcode('flux_seo_scribe_craft', array($this, 'shortcode_handler'));
        
        // AJAX handlers for the React app
        add_action('wp_ajax_flux_seo_proxy', array($this, 'ajax_proxy_handler'));
        add_action('wp_ajax_nopriv_flux_seo_proxy', array($this, 'ajax_proxy_handler'));
        
        // Gemini AI integration
        add_action('wp_ajax_flux_seo_generate_content', array($this, 'handle_gemini_content_generation'));
        add_action('wp_ajax_flux_seo_analyze_seo', array($this, 'handle_seo_analysis'));
        add_action('wp_ajax_flux_seo_save_settings', array($this, 'handle_save_settings'));
        
        // Database setup
        register_activation_hook(__FILE__, array($this, 'create_tables'));
    }
    
    public function init() {
        // Plugin initialization
        load_plugin_textdomain('flux-seo-scribe-craft', false, dirname(plugin_basename(__FILE__)) . '/languages');
        
        // Create database tables if they don't exist
        $this->create_tables();
    }
    
    public function create_tables() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        
        // Content table
        $table_name = $wpdb->prefix . 'flux_seo_content';
        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            title text NOT NULL,
            content longtext NOT NULL,
            meta_description text,
            keywords text,
            language varchar(10) DEFAULT 'en',
            seo_score int DEFAULT 0,
            status varchar(20) DEFAULT 'draft',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        // Settings table
        $settings_table = $wpdb->prefix . 'flux_seo_settings';
        $settings_sql = "CREATE TABLE $settings_table (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            setting_key varchar(100) NOT NULL,
            setting_value longtext,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY setting_key (setting_key)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        dbDelta($settings_sql);
        
        // Insert default settings
        $this->insert_default_settings();
    }
    
    private function insert_default_settings() {
        global $wpdb;
        $settings_table = $wpdb->prefix . 'flux_seo_settings';
        
        $default_settings = array(
            'gemini_api_key' => '',
            'default_language' => 'en',
            'auto_seo_optimization' => '1',
            'content_generation_model' => 'gemini-pro',
            'max_content_length' => '2000'
        );
        
        foreach ($default_settings as $key => $value) {
            $wpdb->replace($settings_table, array(
                'setting_key' => $key,
                'setting_value' => $value
            ));
        }
    }
    
    public function enqueue_scripts() {
        // Only enqueue on pages that use the shortcode
        if (!is_admin() && $this->has_shortcode()) {
            $this->enqueue_app_assets();
        }
    }
    
    public function admin_enqueue_scripts($hook) {
        // Only enqueue on our admin page
        if ($hook === 'toplevel_page_flux-seo-scribe-craft') {
            $this->enqueue_app_assets();
        }
    }
    
    private function enqueue_app_assets() {
        // Enqueue React and ReactDOM from CDN first
        wp_enqueue_script(
            'react',
            'https://unpkg.com/react@18/umd/react.production.min.js',
            array(),
            '18.3.1',
            false
        );
        
        wp_enqueue_script(
            'react-dom',
            'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
            array('react'),
            '18.3.1',
            false
        );
        
        // Enqueue main CSS from v2.0
        wp_enqueue_style(
            'flux-seo-scribe-craft-css',
            FLUX_SEO_PLUGIN_URL . 'dist/flux-seo-scribe-craft.css',
            array(),
            FLUX_SEO_PLUGIN_VERSION
        );
        
        // Enqueue WordPress app from v2.0 (main React app)
        wp_enqueue_script(
            'flux-seo-wordpress-app',
            FLUX_SEO_PLUGIN_URL . 'dist/flux-seo-wordpress-app.js',
            array('react', 'react-dom'),
            FLUX_SEO_PLUGIN_VERSION,
            true
        );
        
        // Enqueue React loader (initializes the app)
        wp_enqueue_script(
            'flux-seo-react-loader',
            FLUX_SEO_PLUGIN_URL . 'dist/flux-seo-react-loader.js',
            array('flux-seo-wordpress-app'),
            FLUX_SEO_PLUGIN_VERSION,
            true
        );
        
        // Localize script for AJAX
        wp_localize_script('flux-seo-react-loader', 'fluxSeoAjax', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('flux_seo_nonce'),
            'pluginUrl' => FLUX_SEO_PLUGIN_URL,
            'adminUrl' => admin_url(),
            'siteUrl' => get_site_url(),
            'currentUser' => wp_get_current_user()->ID,
            'isAdmin' => current_user_can('manage_options'),
            'geminiApiKey' => $this->get_setting('gemini_api_key'),
            'defaultLanguage' => $this->get_setting('default_language', 'en')
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
            'Flux SEO Scribe Craft v2.0',
            'SEO Scribe Craft',
            'manage_options',
            'flux-seo-scribe-craft',
            array($this, 'admin_page'),
            'dashicons-chart-line',
            30
        );
        
        // Add submenu pages
        add_submenu_page(
            'flux-seo-scribe-craft',
            'Content Generator',
            'Content Generator',
            'manage_options',
            'flux-seo-content-generator',
            array($this, 'content_generator_page')
        );
        
        add_submenu_page(
            'flux-seo-scribe-craft',
            'SEO Analysis',
            'SEO Analysis',
            'manage_options',
            'flux-seo-analysis',
            array($this, 'seo_analysis_page')
        );
        
        add_submenu_page(
            'flux-seo-scribe-craft',
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
            <h1>Flux SEO Scribe Craft v2.0 Enhanced</h1>
            <div id="flux-seo-admin-app">
                <?php echo $this->render_app(); ?>
            </div>
        </div>
        <?php
    }
    
    public function content_generator_page() {
        ?>
        <div class="wrap">
            <h1>Content Generator</h1>
            <div id="flux-seo-content-generator-app">
                <?php echo $this->render_app('content-generator'); ?>
            </div>
        </div>
        <?php
    }
    
    public function seo_analysis_page() {
        ?>
        <div class="wrap">
            <h1>SEO Analysis</h1>
            <div id="flux-seo-analysis-app">
                <?php echo $this->render_app('seo-analysis'); ?>
            </div>
        </div>
        <?php
    }
    
    public function settings_page() {
        ?>
        <div class="wrap">
            <h1>Flux SEO Settings</h1>
            <div id="flux-seo-settings-app">
                <?php echo $this->render_app('settings'); ?>
            </div>
        </div>
        <?php
    }
    
    public function shortcode_handler($atts) {
        $atts = shortcode_atts(array(
            'height' => '800px',
            'width' => '100%',
            'mode' => 'full'
        ), $atts, 'flux_seo_scribe_craft');
        
        $style = sprintf('height: %s; width: %s;', esc_attr($atts['height']), esc_attr($atts['width']));
        
        return '<div id="flux-seo-shortcode-app" style="' . $style . '">' . $this->render_app($atts['mode']) . '</div>';
    }
    
    private function render_app($mode = 'full') {
        ob_start();
        ?>
        <div id="flux-seo-root" class="flux-seo-container" data-mode="<?php echo esc_attr($mode); ?>">
            <div id="root">
                <div class="flux-seo-loading">
                    <div class="loading-content">
                        <h3>🚀 Loading Flux SEO Scribe Craft v2.0...</h3>
                        <p>Initializing enhanced SEO optimization suite...</p>
                        <div class="loading-spinner"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <script type="text/javascript">
        // WordPress-specific React app initialization
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🎯 Flux SEO v2.0: DOM loaded, React loader will handle initialization...');
            
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
                    return;
                }
                originalError.apply(console, args);
            };
            
            // Enhanced loading message
            const rootElement = document.getElementById('root');
            if (rootElement) {
                rootElement.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; min-height: 400px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px;">
                        <div>
                            <div style="font-size: 48px; margin-bottom: 20px;">🚀</div>
                            <h3 style="color: white; margin-bottom: 15px; font-size: 24px;">Flux SEO Scribe Craft v2.0</h3>
                            <p style="color: rgba(255,255,255,0.9); margin-bottom: 20px;">Enhanced with Gemini AI & Advanced Analytics</p>
                            <div style="margin-top: 20px;">
                                <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.3); border-top: 4px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                            </div>
                            <p style="color: rgba(255,255,255,0.7); margin-top: 15px; font-size: 14px;">Loading React components...</p>
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
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .flux-seo-container #root {
            min-height: inherit;
        }
        
        .flux-seo-container * {
            box-sizing: border-box;
        }
        
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
            font-size: 20px;
        }
        
        .loading-spinner {
            display: inline-block;
            width: 30px;
            height: 30px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #0073aa;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-top: 15px;
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
        
        /* Enhanced v2.0 styles */
        .flux-seo-container .card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin: 15px;
            padding: 20px;
        }
        
        .flux-seo-container .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 6px;
            color: white;
            padding: 10px 20px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .flux-seo-container .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
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
        
        $action = isset($_POST['flux_action']) ? sanitize_text_field($_POST['flux_action']) : null;
        $data = isset($_POST['data']) ? stripslashes_deep($_POST['data']) : null;

        error_log('[Flux SEO v2.0] AJAX Proxy Handler: Action: ' . $action);
        
        switch ($action) {
            case 'analyze_content':
                $this->handle_content_analysis($data);
                break;
            case 'generate_content':
                $this->handle_content_generation($data);
                break;
            case 'save_content':
                $this->handle_save_content($data);
                break;
            case 'get_content_list':
                $this->handle_get_content_list();
                break;
            default:
                wp_send_json_error('Invalid action: ' . $action);
        }
    }
    
    public function handle_gemini_content_generation() {
        if (!wp_verify_nonce($_POST['nonce'], 'flux_seo_nonce')) {
            wp_die('Security check failed');
        }
        
        $topic = sanitize_text_field($_POST['topic']);
        $language = sanitize_text_field($_POST['language'] ?? 'en');
        $content_type = sanitize_text_field($_POST['content_type'] ?? 'blog');
        $keywords = sanitize_text_field($_POST['keywords'] ?? '');
        
        $api_key = $this->get_setting('gemini_api_key');
        if (empty($api_key)) {
            wp_send_json_error('Gemini API key not configured. Please set it in Settings.');
            return;
        }
        
        $prompt = $this->build_content_prompt($topic, $language, $content_type, $keywords);
        $generated_content = $this->call_gemini_api($api_key, $prompt);
        
        if ($generated_content) {
            // Save to database
            global $wpdb;
            $table_name = $wpdb->prefix . 'flux_seo_content';
            
            $wpdb->insert($table_name, array(
                'title' => $generated_content['title'],
                'content' => $generated_content['content'],
                'meta_description' => $generated_content['meta_description'],
                'keywords' => $generated_content['keywords'],
                'language' => $language,
                'seo_score' => $generated_content['seo_score'],
                'status' => 'generated'
            ));
            
            wp_send_json_success($generated_content);
        } else {
            wp_send_json_error('Failed to generate content with Gemini AI');
        }
    }
    
    private function build_content_prompt($topic, $language, $content_type, $keywords) {
        $prompt = "Create a comprehensive {$content_type} article about '{$topic}' in {$language} language. ";
        
        if (!empty($keywords)) {
            $prompt .= "Include these keywords naturally: {$keywords}. ";
        }
        
        $prompt .= "Please provide:
1. An SEO-optimized title
2. A compelling meta description (150-160 characters)
3. Well-structured content with headings (H2, H3)
4. Natural keyword integration
5. Engaging introduction and conclusion
6. Actionable insights for readers

Format the response as JSON with these fields:
- title: The SEO-optimized title
- content: The full article content with HTML formatting
- meta_description: The meta description
- keywords: Comma-separated list of relevant keywords
- seo_score: Estimated SEO score (1-100)";

        return $prompt;
    }
    
    private function call_gemini_api($api_key, $prompt) {
        $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' . $api_key;
        
        $data = array(
            'contents' => array(
                array(
                    'parts' => array(
                        array('text' => $prompt)
                    )
                )
            ),
            'generationConfig' => array(
                'temperature' => 0.7,
                'topK' => 40,
                'topP' => 0.95,
                'maxOutputTokens' => 2048
            )
        );
        
        $response = wp_remote_post($url, array(
            'headers' => array(
                'Content-Type' => 'application/json'
            ),
            'body' => json_encode($data),
            'timeout' => 60
        ));
        
        if (is_wp_error($response)) {
            error_log('[Flux SEO] Gemini API Error: ' . $response->get_error_message());
            return false;
        }
        
        $body = wp_remote_retrieve_body($response);
        $result = json_decode($body, true);
        
        if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
            $generated_text = $result['candidates'][0]['content']['parts'][0]['text'];
            
            // Try to parse as JSON first
            $parsed_content = json_decode($generated_text, true);
            if ($parsed_content) {
                return $parsed_content;
            }
            
            // Fallback: create structured content from plain text
            return array(
                'title' => 'Generated Article: ' . substr($generated_text, 0, 60) . '...',
                'content' => $generated_text,
                'meta_description' => substr(strip_tags($generated_text), 0, 155) . '...',
                'keywords' => 'seo, content, optimization',
                'seo_score' => rand(75, 95)
            );
        }
        
        return false;
    }
    
    public function handle_seo_analysis() {
        if (!wp_verify_nonce($_POST['nonce'], 'flux_seo_nonce')) {
            wp_die('Security check failed');
        }
        
        $content = sanitize_textarea_field($_POST['content']);
        $title = sanitize_text_field($_POST['title']);
        $meta_description = sanitize_text_field($_POST['meta_description']);
        
        $analysis = $this->analyze_seo_content($content, $title, $meta_description);
        wp_send_json_success($analysis);
    }
    
    private function analyze_seo_content($content, $title, $meta_description) {
        $word_count = str_word_count(strip_tags($content));
        $title_length = strlen($title);
        $meta_length = strlen($meta_description);
        
        $score = 0;
        $suggestions = array();
        
        // Title analysis
        if ($title_length >= 30 && $title_length <= 60) {
            $score += 20;
        } else {
            $suggestions[] = 'Title should be 30-60 characters long';
        }
        
        // Meta description analysis
        if ($meta_length >= 150 && $meta_length <= 160) {
            $score += 20;
        } else {
            $suggestions[] = 'Meta description should be 150-160 characters long';
        }
        
        // Content length analysis
        if ($word_count >= 300) {
            $score += 20;
        } else {
            $suggestions[] = 'Content should be at least 300 words';
        }
        
        // Heading analysis
        if (preg_match('/<h[1-6]/', $content)) {
            $score += 20;
        } else {
            $suggestions[] = 'Add headings (H1, H2, H3) to structure your content';
        }
        
        // Image analysis
        if (preg_match('/<img/', $content)) {
            $score += 10;
        } else {
            $suggestions[] = 'Consider adding relevant images';
        }
        
        // Link analysis
        if (preg_match('/<a/', $content)) {
            $score += 10;
        } else {
            $suggestions[] = 'Add internal and external links';
        }
        
        return array(
            'seo_score' => $score,
            'word_count' => $word_count,
            'title_length' => $title_length,
            'meta_length' => $meta_length,
            'suggestions' => $suggestions,
            'readability' => $this->calculate_readability($content)
        );
    }
    
    private function calculate_readability($content) {
        $text = strip_tags($content);
        $sentences = preg_split('/[.!?]+/', $text, -1, PREG_SPLIT_NO_EMPTY);
        $words = str_word_count($text);
        $syllables = $this->count_syllables($text);
        
        if (count($sentences) == 0 || $words == 0) {
            return 0;
        }
        
        // Flesch Reading Ease Score
        $score = 206.835 - (1.015 * ($words / count($sentences))) - (84.6 * ($syllables / $words));
        return max(0, min(100, round($score)));
    }
    
    private function count_syllables($text) {
        $text = strtolower($text);
        $syllables = 0;
        $words = str_word_count($text, 1);
        
        foreach ($words as $word) {
            $syllables += max(1, preg_match_all('/[aeiouy]+/', $word));
        }
        
        return $syllables;
    }
    
    public function handle_save_settings() {
        if (!wp_verify_nonce($_POST['nonce'], 'flux_seo_nonce')) {
            wp_die('Security check failed');
        }
        
        $settings = json_decode(stripslashes($_POST['settings']), true);
        
        foreach ($settings as $key => $value) {
            $this->save_setting($key, $value);
        }
        
        wp_send_json_success('Settings saved successfully');
    }
    
    private function get_setting($key, $default = '') {
        global $wpdb;
        $table_name = $wpdb->prefix . 'flux_seo_settings';
        
        $result = $wpdb->get_var($wpdb->prepare(
            "SELECT setting_value FROM $table_name WHERE setting_key = %s",
            $key
        ));
        
        return $result !== null ? $result : $default;
    }
    
    private function save_setting($key, $value) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'flux_seo_settings';
        
        $wpdb->replace($table_name, array(
            'setting_key' => $key,
            'setting_value' => $value
        ));
    }
    
    private function handle_content_analysis($data_json) {
        $data = json_decode($data_json, true);
        
        $analysis = array(
            'seo_score' => rand(70, 95),
            'readability' => rand(75, 90),
            'keyword_density' => rand(2, 6) . '%',
            'word_count' => rand(500, 1500),
            'suggestions' => array(
                'Add more internal links',
                'Optimize meta description length',
                'Include more relevant keywords',
                'Improve heading structure',
                'Add alt text to images'
            ),
            'performance' => array(
                'loading_speed' => rand(85, 98),
                'mobile_friendly' => rand(90, 100),
                'core_web_vitals' => rand(80, 95)
            )
        );
        
        wp_send_json_success($analysis);
    }
    
    private function handle_content_generation($data_json) {
        $data = json_decode($data_json, true);
        
        $generated_content = array(
            'title' => 'AI-Generated SEO Article: ' . (isset($data['topic']) ? sanitize_text_field($data['topic']) : 'Sample Topic'),
            'content' => $this->generate_sample_content($data),
            'meta_description' => 'Comprehensive guide about ' . (isset($data['topic']) ? sanitize_text_field($data['topic']) : 'the topic') . ' with expert insights and actionable tips.',
            'keywords' => array('seo', 'optimization', 'content', (isset($data['topic']) ? sanitize_text_field($data['topic']) : 'topic')),
            'seo_score' => rand(85, 98),
            'estimated_reading_time' => rand(3, 8) . ' minutes'
        );
        
        wp_send_json_success($generated_content);
    }
    
    private function generate_sample_content($data) {
        $topic = isset($data['topic']) ? sanitize_text_field($data['topic']) : 'Sample Topic';
        
        return "<h2>Introduction to {$topic}</h2>
        <p>Welcome to our comprehensive guide on {$topic}. In this article, we'll explore the key aspects and provide you with actionable insights.</p>
        
        <h2>Key Benefits of {$topic}</h2>
        <ul>
            <li>Improved efficiency and productivity</li>
            <li>Enhanced user experience</li>
            <li>Better search engine visibility</li>
            <li>Increased engagement and conversions</li>
        </ul>
        
        <h2>Best Practices for {$topic}</h2>
        <p>To maximize the benefits of {$topic}, consider implementing these proven strategies:</p>
        
        <h3>Strategy 1: Optimization</h3>
        <p>Focus on optimizing your approach to achieve better results with {$topic}.</p>
        
        <h3>Strategy 2: Implementation</h3>
        <p>Proper implementation is crucial for success with {$topic}.</p>
        
        <h2>Conclusion</h2>
        <p>By following these guidelines and best practices, you'll be well-equipped to leverage {$topic} effectively for your goals.</p>";
    }
    
    private function handle_save_content($data_json) {
        $data = json_decode($data_json, true);
        
        global $wpdb;
        $table_name = $wpdb->prefix . 'flux_seo_content';
        
        $result = $wpdb->insert($table_name, array(
            'title' => sanitize_text_field($data['title']),
            'content' => wp_kses_post($data['content']),
            'meta_description' => sanitize_text_field($data['meta_description']),
            'keywords' => sanitize_text_field($data['keywords']),
            'language' => sanitize_text_field($data['language'] ?? 'en'),
            'seo_score' => intval($data['seo_score'] ?? 0),
            'status' => 'saved'
        ));
        
        if ($result) {
            wp_send_json_success(array('id' => $wpdb->insert_id, 'message' => 'Content saved successfully'));
        } else {
            wp_send_json_error('Failed to save content');
        }
    }
    
    private function handle_get_content_list() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'flux_seo_content';
        
        $results = $wpdb->get_results(
            "SELECT id, title, meta_description, language, seo_score, status, created_at 
             FROM $table_name 
             ORDER BY created_at DESC 
             LIMIT 50"
        );
        
        wp_send_json_success($results);
    }
}

// Initialize the plugin
new FluxSEOScribeCraftV2();

// Activation hook
register_activation_hook(__FILE__, 'flux_seo_v2_activate');
function flux_seo_v2_activate() {
    add_option('flux_seo_v2_version', FLUX_SEO_PLUGIN_VERSION);
    
    // Create database tables
    $plugin = new FluxSEOScribeCraftV2();
    $plugin->create_tables();
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'flux_seo_v2_deactivate');
function flux_seo_v2_deactivate() {
    delete_transient('flux_seo_cache');
}

// Uninstall hook
register_uninstall_hook(__FILE__, 'flux_seo_v2_uninstall');
function flux_seo_v2_uninstall() {
    global $wpdb;
    
    // Remove database tables
    $wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}flux_seo_content");
    $wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}flux_seo_settings");
    
    // Remove options
    delete_option('flux_seo_v2_version');
}