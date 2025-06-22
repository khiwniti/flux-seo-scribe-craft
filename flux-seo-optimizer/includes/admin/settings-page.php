<?php
/**
 * Admin Settings Page for Flux SEO Optimizer
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

class Flux_SEO_Optimizer_Settings_Page {

    private static $_instance = null;
    const SETTINGS_GROUP = 'flux_seo_optimizer_settings';
    const OPTION_NAME = 'flux_seo_optimizer_options';
    const PAGE_SLUG = 'flux-seo-optimizer';

    public static function instance() {
        if ( is_null( self::$_instance ) ) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    private function __construct() {
        add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
        add_action( 'admin_init', array( $this, 'register_settings' ) );
    }

    public function add_admin_menu() {
        add_options_page(
            __( 'Flux SEO Optimizer Settings', 'flux-seo-optimizer' ),
            __( 'Flux SEO Optimizer', 'flux-seo-optimizer' ),
            'manage_options',
            self::PAGE_SLUG,
            array( $this, 'render_settings_page' )
        );
    }

    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
            <form action="options.php" method="post">
                <?php
                settings_fields( self::SETTINGS_GROUP );
                do_settings_sections( self::PAGE_SLUG );
                submit_button( __( 'Save Settings', 'flux-seo-optimizer' ) );
                ?>
            </form>
        </div>
        <?php
    }

    public function register_settings() {
        register_setting( self::SETTINGS_GROUP, self::OPTION_NAME, array( $this, 'sanitize_options' ) );

        add_settings_section(
            'flux_seo_optimizer_api_key_section',
            __( 'API Key Configuration', 'flux-seo-optimizer' ),
            array( $this, 'render_api_key_section_text' ),
            self::PAGE_SLUG
        );

        add_settings_field(
            'gemini_api_key',
            __( 'Google Gemini API Key', 'flux-seo-optimizer' ),
            array( $this, 'render_gemini_api_key_field' ),
            self::PAGE_SLUG,
            'flux_seo_optimizer_api_key_section'
        );
    }

    public function render_api_key_section_text() {
        echo '<p>' . esc_html__( 'Enter your Google Gemini API Key to enable AI features.', 'flux-seo-optimizer' ) . '</p>';
        // You can add a link to where users can get an API key.
        echo '<p>' . sprintf(
            wp_kses(
                __( 'You can obtain an API key from <a href="%s" target="_blank">Google AI Studio</a>.', 'flux-seo-optimizer' ),
                array( 'a' => array( 'href' => array(), 'target' => array() ) )
            ),
            'https://aistudio.google.com/app/apikey'
        ) . '</p>';
    }

    public function render_gemini_api_key_field() {
        $options = get_option( self::OPTION_NAME, array() );
        $api_key = isset( $options['gemini_api_key'] ) ? $options['gemini_api_key'] : '';
        ?>
        <input type="text" name="<?php echo esc_attr( self::OPTION_NAME ); ?>[gemini_api_key]"
               value="<?php echo esc_attr( $api_key ); ?>" class="regular-text">
        <p class="description">
            <?php esc_html_e( 'Your API key is stored securely and used for AI content generation.', 'flux-seo-optimizer' ); ?>
        </p>
        <?php
    }

    public function sanitize_options( $input ) {
        $sanitized_input = array();
        if ( isset( $input['gemini_api_key'] ) ) {
            $sanitized_input['gemini_api_key'] = sanitize_text_field( $input['gemini_api_key'] );
        }
        // Add more sanitization for other options if any

        return $sanitized_input;
    }

    /**
     * Helper function to get the API key
     * @return string The API key or empty string if not set.
     */
    public static function get_api_key() {
        $options = get_option( self::OPTION_NAME, array() );
        return isset( $options['gemini_api_key'] ) ? $options['gemini_api_key'] : '';
    }
}
