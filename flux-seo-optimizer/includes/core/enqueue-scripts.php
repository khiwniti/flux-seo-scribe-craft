<?php
/**
 * Enqueue scripts and styles for Flux SEO Optimizer React App
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

class Flux_SEO_Optimizer_Enqueue_Scripts {

    private static $_instance = null;

    public static function instance() {
        if ( is_null( self::$_instance ) ) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    private function __construct() {
        // For now, enqueue scripts on all admin pages and frontend pages.
        // This can be refined to only load where the shortcode/block is present,
        // or on specific admin pages.
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_react_app' ) ); // For frontend
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_react_app_admin' ) ); // For admin (if tool is used there)
    }

    public function enqueue_react_app_admin( $hook_suffix ) {
        // Example: Only load on a specific admin page for the tool
        // if ( 'toplevel_page_my-tool-slug' !== $hook_suffix && 'settings_page_flux-seo-optimizer' !== $hook_suffix) {
        //     return;
        // }
        // For now, loading it if the main settings page is shown, or if a generic condition is met.
        // This needs to be more specific if the React app is only for a certain admin section.
        // If the shortcode is the primary way, admin enqueueing might not be needed unless there's an admin dashboard.

        // For simplicity, let's assume the React app is mainly via shortcode on the frontend.
        // If it's also meant to be an admin tool, this logic needs careful consideration.
        // For now, this function is a placeholder. We'll primarily focus on frontend via shortcode.
        // To actually use it in admin, you'd call $this->enqueue_react_app(); under specific conditions.
    }

    public function enqueue_react_app() {
        // This function will be called by `wp_enqueue_scripts` (frontend)
        // and potentially `admin_enqueue_scripts` (admin) if the app is used there.

        // Vite WordPress build output directory is 'dist/flux-seo-plugin/'
        // The JS filename is 'flux-seo-app.js'
        // CSS filename (if extracted) would likely be 'flux-seo-app.css' or 'style.css'

        $script_name = 'flux-seo-app.js';
        $style_name = 'flux-seo-app.css'; // Assuming this name, verify after checking Vite CSS output

        $script_asset_path = FLUX_SEO_OPTIMIZER_PLUGIN_DIR . "dist/flux-seo-plugin/" . $script_name;
        $script_asset_url = FLUX_SEO_OPTIMIZER_PLUGIN_URL . "dist/flux-seo-plugin/" . $script_name;

        $style_asset_path = FLUX_SEO_OPTIMIZER_PLUGIN_DIR . "dist/flux-seo-plugin/" . $style_name;
        $style_asset_url = FLUX_SEO_OPTIMIZER_PLUGIN_URL . "dist/flux-seo-plugin/" . $style_name;

        // In a real plugin, you'd check if the shortcode is present or if on a specific page
        // to avoid loading the app everywhere. For now, loading more broadly for testing.
        // global $post;
        // if ( !is_a( $post, 'WP_Post' ) || !has_shortcode( $post->post_content, 'flux_seo_optimizer_dashboard' ) ) {
        //     // Or if not on a specific admin page for the tool
        //     return;
        // }

        if ( file_exists( $script_asset_path ) ) {
            wp_enqueue_script(
                'flux-seo-optimizer-react-app',
                $script_asset_url,
                array( 'wp-element' ), // Add 'wp-element' for React and ReactDOM
                filemtime( $script_asset_path ), // Versioning
                true // Load in footer
            );

            $localized_data = array(
                'rest_url'       => esc_url_raw( rest_url() ),
                'nonce'          => wp_create_nonce( 'wp_rest' ),
                'proxy_endpoint' => esc_url_raw( rest_url( Flux_SEO_Optimizer_Proxy_Endpoint::instance()->namespace . '/' . Flux_SEO_Optimizer_Proxy_Endpoint::instance()->route_base ) ),
                'api_key_set'    => !empty( Flux_SEO_Optimizer_Settings_Page::get_api_key() ),
                'root_element_id' => 'flux-seo-react-root', // Pass the ID of the root div
            );
            wp_localize_script( 'flux-seo-optimizer-react-app', 'fluxSeoAppData', $localized_data );

        } else {
            error_log( 'Flux SEO Optimizer: React app script not found at ' . $script_asset_path );
            // Display an admin notice if files are missing and user is admin
            if (current_user_can('manage_options')) {
                add_action('admin_notices', function() use ($script_asset_path) {
                    echo '<div class="notice notice-error"><p>';
                    printf(
                        /* translators: %s: path to the missing script file */
                        esc_html__( 'Flux SEO Optimizer error: React app script not found at %s. Please run the build process (e.g., npm run build:wordpress).', 'flux-seo-optimizer' ),
                        '<code>' . esc_html( $script_asset_path ) . '</code>'
                    );
                    echo '</p></div>';
                });
            }
        }

        // Enqueue style if it exists.
        // Vite's UMD library build might bundle CSS into JS or output a separate file.
        // If it's 'flux-seo-app.css' and present, this will load it.
        if ( file_exists( $style_asset_path ) ) {
            wp_enqueue_style(
                'flux-seo-optimizer-react-app-styles',
                $style_asset_url,
                array(),
                filemtime( $style_asset_path )
            );
        } else {
            // This is not necessarily an error if CSS is bundled into JS by Vite's library mode.
            // error_log( 'Flux SEO Optimizer: React app styles not found at ' . $style_asset_path );
        }
    }
}
