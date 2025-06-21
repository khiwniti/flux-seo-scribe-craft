<?php
/**
 * Plugin Name: Flux SEO Scribe Craft
 * Plugin URI: https://github.com/khiwniti/flux-seo-scribe-craft
 * Description: A WordPress plugin that embeds React components for SEO content creation and management.
 * Version: 2.0.0
 * Author: Your Name
 * License: GPL v2 or later
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

class FluxSeoScribeCraft {
    
    public function __construct() {
        // add_action('init', array($this, 'init')); // Neutralized
        // add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts')); // Neutralized
        // add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts')); // Neutralized
        // add_shortcode('flux_seo_app', array($this, 'render_app_shortcode')); // Neutralized
        // add_action('wp_ajax_flux_seo_api', array($this, 'handle_ajax_request')); // Neutralized
        // add_action('wp_ajax_nopriv_flux_seo_api', array($this, 'handle_ajax_request')); // Neutralized
        // add_action('admin_menu', array($this, 'add_admin_menu')); // Neutralized
    }
    
    public function init() {
        // Initialize plugin
        load_plugin_textdomain('flux-seo-scribe-craft', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
    
    public function enqueue_scripts() {
        // Enqueue React app for frontend
        wp_enqueue_script(
            'flux-seo-app',
            FLUX_SEO_PLUGIN_URL . 'dist/main.js',
            array(),
            FLUX_SEO_PLUGIN_VERSION,
            true
        );
        
        wp_enqueue_style(
            'flux-seo-app-style',
            FLUX_SEO_PLUGIN_URL . 'dist/main.css',
            array(),
            FLUX_SEO_PLUGIN_VERSION
        );
        
        // Localize script with WordPress data
        wp_localize_script('flux-seo-app', 'fluxSeoData', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('flux_seo_nonce'),
            'apiUrl' => rest_url('flux-seo/v1/'),
            'pluginUrl' => FLUX_SEO_PLUGIN_URL,
        ));
    }
    
    public function enqueue_admin_scripts($hook) {
        // Only load on our admin pages
        if (strpos($hook, 'flux-seo') === false) {
            return;
        }
        
        wp_enqueue_script(
            'flux-seo-admin',
            FLUX_SEO_PLUGIN_URL . 'dist/admin.js',
            array(),
            FLUX_SEO_PLUGIN_VERSION,
            true
        );
        
        wp_enqueue_style(
            'flux-seo-admin-style',
            FLUX_SEO_PLUGIN_URL . 'dist/admin.css',
            array(),
            FLUX_SEO_PLUGIN_VERSION
        );
        
        wp_localize_script('flux-seo-admin', 'fluxSeoAdminData', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('flux_seo_admin_nonce'),
            'apiUrl' => rest_url('flux-seo/v1/'),
        ));
    }
    
    public function render_app_shortcode($atts) {
        $atts = shortcode_atts(array(
            'component' => 'main',
            'props' => '{}',
        ), $atts);
        
        $props = json_decode($atts['props'], true) ?: array();
        $component_data = array(
            'component' => $atts['component'],
            'props' => $props,
        );
        
        ob_start();
        ?>
        <div id="flux-seo-app-<?php echo esc_attr(uniqid()); ?>" 
             class="flux-seo-app-container" 
             data-component="<?php echo esc_attr(json_encode($component_data)); ?>">
            <div class="flux-seo-loading">Loading...</div>
        </div>
        <?php
        return ob_get_clean();
    }
    
    public function handle_ajax_request() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'flux_seo_nonce')) {
            wp_die('Security check failed');
        }
        
        $action = sanitize_text_field($_POST['flux_action']);
        
        switch ($action) {
            case 'get_content':
                $this->get_content();
                break;
            case 'save_content':
                $this->save_content();
                break;
            case 'generate_seo':
                $this->generate_seo();
                break;
            case 'generate_blog_post':
                $this->generate_blog_post();
                break;
            case 'improve_content':
                $this->improve_content();
                break;
            case 'generate_keywords':
                $this->generate_keywords();
                break;
            case 'save_blog_post':
                $this->save_blog_post();
                break;
            default:
                wp_send_json_error('Invalid action');
        }
    }
    
    private function get_content() {
        // Handle get content request
        $post_id = intval($_POST['post_id']);
        $content = get_post_meta($post_id, '_flux_seo_content', true);
        wp_send_json_success($content);
    }
    
    private function save_content() {
        // Handle save content request
        $post_id = intval($_POST['post_id']);
        $content = sanitize_textarea_field($_POST['content']);
        $seo_data = isset($_POST['seo_data']) ? json_decode(stripslashes($_POST['seo_data']), true) : array();
        $language = sanitize_text_field($_POST['language'] ?? 'en');
        
        update_post_meta($post_id, '_flux_seo_content', $content);
        update_post_meta($post_id, '_flux_seo_data', $seo_data);
        update_post_meta($post_id, '_flux_seo_language', $language);
        
        wp_send_json_success('Content saved');
    }
    
    private function save_blog_post() {
        // Handle blog post saving
        $title = sanitize_text_field($_POST['title']);
        $content = wp_kses_post($_POST['content']);
        $meta_description = sanitize_text_field($_POST['meta_description'] ?? '');
        $keywords = isset($_POST['keywords']) ? array_map('sanitize_text_field', (array)$_POST['keywords']) : array();
        $language = sanitize_text_field($_POST['language'] ?? 'en');
        $seo_score = intval($_POST['seo_score'] ?? 0);
        
        // Create new post
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
                '_flux_seo_score' => $seo_score,
                '_flux_seo_generated' => true,
                '_flux_seo_generated_date' => current_time('mysql')
            )
        );
        
        $post_id = wp_insert_post($post_data);
        
        if ($post_id && !is_wp_error($post_id)) {
            wp_send_json_success(array(
                'post_id' => $post_id,
                'edit_url' => admin_url('post.php?post=' . $post_id . '&action=edit'),
                'message' => 'Blog post saved successfully'
            ));
        } else {
            wp_send_json_error('Failed to save blog post');
        }
    }
    
    private function generate_seo() {
        // Handle SEO generation request
        $content = sanitize_textarea_field($_POST['content']);
        $language = sanitize_text_field($_POST['language'] ?? 'en');
        $keywords = sanitize_text_field($_POST['keywords'] ?? '');
        
        // Call Gemini AI API for SEO generation
        $seo_data = $this->call_gemini_ai_seo($content, $language, $keywords);
        
        if ($seo_data) {
            wp_send_json_success($seo_data);
        } else {
            wp_send_json_error('Failed to generate SEO content');
        }
    }
    
    private function generate_blog_post() {
        // Handle blog post generation
        $topic = sanitize_text_field($_POST['topic']);
        $language = sanitize_text_field($_POST['language'] ?? 'en');
        $word_count = intval($_POST['word_count'] ?? 1000);
        $tone = sanitize_text_field($_POST['tone'] ?? 'professional');
        $keywords = sanitize_text_field($_POST['keywords'] ?? '');
        $target_audience = sanitize_text_field($_POST['target_audience'] ?? 'general');
        
        $blog_data = $this->call_gemini_ai_blog($topic, $language, $word_count, $tone, $keywords, $target_audience);
        
        if ($blog_data) {
            wp_send_json_success($blog_data);
        } else {
            wp_send_json_error('Failed to generate blog post');
        }
    }
    
    private function improve_content() {
        // Handle content improvement
        $content = sanitize_textarea_field($_POST['content']);
        $language = sanitize_text_field($_POST['language'] ?? 'en');
        $improvement_type = sanitize_text_field($_POST['improvement_type'] ?? 'general');
        
        $improved_data = $this->call_gemini_ai_improve($content, $language, $improvement_type);
        
        if ($improved_data) {
            wp_send_json_success($improved_data);
        } else {
            wp_send_json_error('Failed to improve content');
        }
    }
    
    private function generate_keywords() {
        // Handle keyword generation
        $topic = sanitize_text_field($_POST['topic']);
        $language = sanitize_text_field($_POST['language'] ?? 'en');
        $count = intval($_POST['count'] ?? 20);
        
        $keywords_data = $this->call_gemini_ai_keywords($topic, $language, $count);
        
        if ($keywords_data) {
            wp_send_json_success($keywords_data);
        } else {
            wp_send_json_error('Failed to generate keywords');
        }
    }
    
    private function call_gemini_ai_seo($content, $language, $keywords) {
        $api_key = get_option('flux_seo_gemini_api_key', 'AIzaSyDTITCw_UcgzUufrsCFuxp9HXri6Y0XrDo');
        $api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
        
        $language_instruction = $language === 'th' 
            ? 'Please respond in Thai language with proper grammar, cultural context, and natural flow.'
            : 'Please respond in English with clear, professional language and proper grammar.';
        
        $keyword_text = !empty($keywords) ? "Target keywords: $keywords" : '';
        
        $prompt = "$language_instruction

Analyze and optimize the following content for SEO:

**Content to optimize:**
$content

**Requirements:**
- Language: " . ($language === 'th' ? 'Thai' : 'English') . "
- Content type: blog post
- $keyword_text

**Generate the following SEO elements:**
1. SEO-optimized title (max 60 characters)
2. Meta description (max 160 characters)
3. Focus keywords (5-10 keywords)
4. Semantic keywords (related terms)
5. Content optimization suggestions
6. Internal linking suggestions
7. SEO score analysis (out of 100)

Please format the response as JSON:
{
  \"title\": \"Optimized title\",
  \"metaDescription\": \"Optimized meta description\",
  \"focusKeywords\": [\"keyword1\", \"keyword2\"],
  \"semanticKeywords\": [\"related1\", \"related2\"],
  \"suggestions\": [\"suggestion1\", \"suggestion2\"],
  \"internalLinks\": [\"link suggestion1\", \"link suggestion2\"],
  \"seoScore\": 85,
  \"analysis\": {
    \"titleScore\": 90,
    \"descriptionScore\": 85,
    \"keywordDensity\": \"2.5%\",
    \"readabilityScore\": 80,
    \"improvements\": [\"improvement1\", \"improvement2\"]
  }
}";

        $body = array(
            'contents' => array(
                array(
                    'parts' => array(
                        array('text' => $prompt)
                    )
                )
            ),
            'generationConfig' => array(
                'maxOutputTokens' => 2048,
                'temperature' => 0.6,
                'topP' => 0.8,
                'topK' => 40
            ),
            'safetySettings' => $this->get_safety_settings()
        );
        
        $response = wp_remote_post($api_url . '?key=' . $api_key, array(
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
            'body' => json_encode($body),
            'timeout' => 60
        ));
        
        if (is_wp_error($response)) {
            error_log('Gemini AI API Error: ' . $response->get_error_message());
            return false;
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
            $content = $data['candidates'][0]['content']['parts'][0]['text'];
            
            // Try to extract JSON from the response
            if (preg_match('/\{[\s\S]*\}/', $content, $matches)) {
                $json_data = json_decode($matches[0], true);
                if ($json_data) {
                    return $json_data;
                }
            }
            
            // Fallback parsing
            return $this->parse_seo_response($content);
        }
        
        return false;
    }
    
    private function call_gemini_ai_blog($topic, $language, $word_count, $tone, $keywords, $target_audience) {
        $api_key = get_option('flux_seo_gemini_api_key', 'AIzaSyDTITCw_UcgzUufrsCFuxp9HXri6Y0XrDo');
        $api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
        
        $language_instruction = $language === 'th' 
            ? 'Please respond in Thai language with proper grammar, cultural context, and natural flow.'
            : 'Please respond in English with clear, professional language and proper grammar.';
        
        $keyword_text = !empty($keywords) ? "Focus keywords: $keywords" : '';
        
        $prompt = "$language_instruction

Create a comprehensive blog post about \"$topic\" with the following specifications:

**Requirements:**
- Language: " . ($language === 'th' ? 'Thai' : 'English') . "
- Word count: approximately $word_count words
- Tone: $tone
- Target audience: $target_audience
- $keyword_text

**Structure needed:**
- SEO-optimized title
- Meta description (150-160 characters)
- Article outline
- Full article content with proper headings (H2, H3)
- Introduction that hooks the reader
- Main content sections with detailed information
- Conclusion with call-to-action
- Suggested internal linking opportunities

**SEO Guidelines:**
- Use the focus keywords naturally throughout the content
- Include semantic keywords and related terms
- Optimize for search intent
- Create engaging, readable content
- Include actionable insights and practical tips

Please format the response as JSON:
{
  \"title\": \"SEO-optimized title\",
  \"metaDescription\": \"Meta description\",
  \"outline\": [\"Outline point 1\", \"Outline point 2\"],
  \"content\": \"Full article content with HTML formatting\",
  \"keywords\": [\"suggested\", \"keywords\"],
  \"readingTime\": \"estimated reading time\",
  \"seoScore\": \"estimated SEO score out of 100\"
}";

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
            'safetySettings' => $this->get_safety_settings()
        );
        
        $response = wp_remote_post($api_url . '?key=' . $api_key, array(
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
            'body' => json_encode($body),
            'timeout' => 90
        ));
        
        if (is_wp_error($response)) {
            error_log('Gemini AI Blog API Error: ' . $response->get_error_message());
            return false;
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
            $content = $data['candidates'][0]['content']['parts'][0]['text'];
            
            // Try to extract JSON from the response
            if (preg_match('/\{[\s\S]*\}/', $content, $matches)) {
                $json_data = json_decode($matches[0], true);
                if ($json_data) {
                    return $json_data;
                }
            }
            
            // Fallback parsing
            return $this->parse_blog_response($content, $topic);
        }
        
        return false;
    }
    
    private function call_gemini_ai_improve($content, $language, $improvement_type) {
        $api_key = get_option('flux_seo_gemini_api_key', 'AIzaSyDTITCw_UcgzUufrsCFuxp9HXri6Y0XrDo');
        $api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
        
        $language_instruction = $language === 'th' 
            ? 'Please respond in Thai language with proper grammar, cultural context, and natural flow.'
            : 'Please respond in English with clear, professional language and proper grammar.';
        
        $improvement_guidelines = $this->get_improvement_guidelines($improvement_type, $language);
        
        $prompt = "$language_instruction

Improve the following content based on $improvement_type optimization:

**Original Content:**
$content

**Improvement Requirements:**
- Language: " . ($language === 'th' ? 'Thai' : 'English') . "
- Improvement focus: $improvement_type
- Tone: maintain original tone

**Specific Improvements for $improvement_type:**
$improvement_guidelines

Please format the response as JSON:
{
  \"improvedContent\": \"Enhanced content\",
  \"changes\": [
    {
      \"type\": \"change type\",
      \"original\": \"original text\",
      \"improved\": \"improved text\",
      \"reason\": \"why this change was made\"
    }
  ],
  \"summary\": \"Summary of improvements\",
  \"metrics\": {
    \"readabilityImprovement\": \"+15%\",
    \"seoImprovement\": \"+20%\",
    \"engagementImprovement\": \"+10%\"
  },
  \"additionalSuggestions\": [\"suggestion 1\", \"suggestion 2\"]
}";

        $body = array(
            'contents' => array(
                array(
                    'parts' => array(
                        array('text' => $prompt)
                    )
                )
            ),
            'generationConfig' => array(
                'maxOutputTokens' => 3072,
                'temperature' => 0.6,
                'topP' => 0.8,
                'topK' => 40
            ),
            'safetySettings' => $this->get_safety_settings()
        );
        
        $response = wp_remote_post($api_url . '?key=' . $api_key, array(
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
            'body' => json_encode($body),
            'timeout' => 60
        ));
        
        if (is_wp_error($response)) {
            error_log('Gemini AI Improve API Error: ' . $response->get_error_message());
            return false;
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
            $content = $data['candidates'][0]['content']['parts'][0]['text'];
            
            // Try to extract JSON from the response
            if (preg_match('/\{[\s\S]*\}/', $content, $matches)) {
                $json_data = json_decode($matches[0], true);
                if ($json_data) {
                    return $json_data;
                }
            }
        }
        
        return false;
    }
    
    private function call_gemini_ai_keywords($topic, $language, $count) {
        $api_key = get_option('flux_seo_gemini_api_key', 'AIzaSyDTITCw_UcgzUufrsCFuxp9HXri6Y0XrDo');
        $api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
        
        $language_instruction = $language === 'th' 
            ? 'Please respond in Thai language with proper grammar, cultural context, and natural flow.'
            : 'Please respond in English with clear, professional language and proper grammar.';
        
        $prompt = "$language_instruction

Generate a comprehensive list of SEO keywords for the topic: \"$topic\"

**Requirements:**
- Language: " . ($language === 'th' ? 'Thai' : 'English') . "
- Number of keywords: $count
- Difficulty level: mixed (easy, medium, hard)
- Include long-tail keywords
- Include question-based keywords
- Include local keywords if applicable

**Keyword Categories:**
1. Primary keywords (high volume, competitive)
2. Secondary keywords (medium volume, moderate competition)
3. Long-tail keywords (lower volume, less competitive)
4. Question keywords (what, how, why, when, where)
5. Local keywords (if applicable)
6. Semantic keywords (related terms)

Please format as JSON:
{
  \"primaryKeywords\": [
    {
      \"keyword\": \"keyword phrase\",
      \"intent\": \"search intent\",
      \"difficulty\": 7,
      \"type\": \"primary\"
    }
  ],
  \"secondaryKeywords\": [],
  \"longTailKeywords\": [],
  \"questionKeywords\": [],
  \"localKeywords\": [],
  \"semanticKeywords\": []
}";

        $body = array(
            'contents' => array(
                array(
                    'parts' => array(
                        array('text' => $prompt)
                    )
                )
            ),
            'generationConfig' => array(
                'maxOutputTokens' => 3072,
                'temperature' => 0.7,
                'topP' => 0.8,
                'topK' => 40
            ),
            'safetySettings' => $this->get_safety_settings()
        );
        
        $response = wp_remote_post($api_url . '?key=' . $api_key, array(
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
            'body' => json_encode($body),
            'timeout' => 60
        ));
        
        if (is_wp_error($response)) {
            error_log('Gemini AI Keywords API Error: ' . $response->get_error_message());
            return false;
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
            $content = $data['candidates'][0]['content']['parts'][0]['text'];
            
            // Try to extract JSON from the response
            if (preg_match('/\{[\s\S]*\}/', $content, $matches)) {
                $json_data = json_decode($matches[0], true);
                if ($json_data) {
                    return $json_data;
                }
            }
        }
        
        return false;
    }
    
    private function get_safety_settings() {
        return array(
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
        );
    }
    
    private function get_improvement_guidelines($type, $language) {
        $guidelines = array(
            'general' => "
- Improve clarity and flow
- Enhance readability
- Fix grammar and style issues
- Strengthen weak sections
- Add relevant examples
            ",
            'seo' => "
- Optimize keyword placement and density
- Improve title and headings for SEO
- Add semantic keywords naturally
- Enhance meta elements
- Improve internal linking opportunities
- Optimize for featured snippets
            ",
            'readability' => "
- Simplify complex sentences
- Use shorter paragraphs
- Add bullet points and lists
- Improve transitions between sections
- Use active voice
- Eliminate jargon and complex terms
            ",
            'engagement' => "
- Add compelling hooks and openings
- Include storytelling elements
- Add questions to engage readers
- Use emotional triggers appropriately
- Include actionable advice
- Add call-to-action elements
            "
        );
        
        return isset($guidelines[$type]) ? $guidelines[$type] : $guidelines['general'];
    }
    
    private function parse_seo_response($content) {
        // Fallback parser for SEO content
        return array(
            'title' => 'AI-Generated SEO Title',
            'metaDescription' => 'AI-generated meta description for better search visibility.',
            'focusKeywords' => array('seo', 'optimization', 'content'),
            'semanticKeywords' => array('search engine', 'ranking', 'visibility'),
            'suggestions' => array('Improve keyword density', 'Add internal links'),
            'internalLinks' => array('Related article 1', 'Related article 2'),
            'seoScore' => 75,
            'analysis' => array(
                'titleScore' => 80,
                'descriptionScore' => 75,
                'keywordDensity' => '2.1%',
                'readabilityScore' => 78,
                'improvements' => array('Add more keywords', 'Improve readability')
            )
        );
    }
    
    private function parse_blog_response($content, $topic) {
        // Fallback parser for blog content
        return array(
            'title' => 'AI-Generated: ' . $topic,
            'metaDescription' => 'Comprehensive guide about ' . $topic . ' with expert insights and practical tips.',
            'outline' => array(
                'Introduction',
                'Main concepts and definitions',
                'Best practices and strategies',
                'Common challenges and solutions',
                'Conclusion and next steps'
            ),
            'content' => $content,
            'keywords' => array($topic, 'guide', 'tips', 'best practices'),
            'readingTime' => '5 minutes',
            'seoScore' => 80
        );
    }
    
    public function add_admin_menu() {
        add_menu_page(
            'Flux SEO Scribe Craft',
            'Flux SEO',
            'manage_options',
            'flux-seo-main',
            array($this, 'admin_page'),
            'dashicons-edit-page',
            30
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
            <div id="flux-seo-admin-app" class="flux-seo-admin-container">
                <div class="flux-seo-loading">Loading admin interface...</div>
            </div>
        </div>
        <?php
    }
    
    public function settings_page() {
        ?>
        <div class="wrap">
            <h1>Flux SEO Settings</h1>
            <div id="flux-seo-settings-app" class="flux-seo-settings-container">
                <div class="flux-seo-loading">Loading settings...</div>
            </div>
        </div>
        <?php
    }
}

// Initialize the plugin
// new FluxSeoScribeCraft(); // Neutralized

// Activation hook
register_activation_hook(__FILE__, 'flux_seo_activate');
function flux_seo_activate() {
    // Create database tables if needed
    global $wpdb;
    
    $table_name = $wpdb->prefix . 'flux_seo_data';
    
    $charset_collate = $wpdb->get_charset_collate();
    
    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        post_id bigint(20) NOT NULL,
        seo_data longtext NOT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY post_id (post_id)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'flux_seo_deactivate');
function flux_seo_deactivate() {
    // Clean up if needed
}