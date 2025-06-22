<?php
/**
 * Shortcodes for Flux SEO Optimizer
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

class Flux_SEO_Optimizer_Shortcodes {

    private static $_instance = null;

    public static function instance() {
        if ( is_null( self::$_instance ) ) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    private function __construct() {
        add_shortcode( 'flux_seo_optimizer_dashboard', array( $this, 'render_dashboard_shortcode' ) );
    }

    public function render_dashboard_shortcode( $atts ) {
        // Ensure scripts are enqueued (though they are also enqueued globally via Enqueue_Scripts class for now)
        // For more targeted loading, you could enqueue here instead.
        // Flux_SEO_Optimizer_Enqueue_Scripts::instance()->enqueue_react_app();


        // Attributes for the shortcode (if any needed in the future)
        // $atts = shortcode_atts( array(
        // 'example_param' => 'default_value',
        // ), $atts, 'flux_seo_optimizer_dashboard' );

        // The React app will mount onto this div.
        // The ID "flux-seo-react-root" should match what's used in src/main.tsx or src/wordpress-entry.tsx
        return '<div id="flux-seo-react-root"></div>';
    }
}
