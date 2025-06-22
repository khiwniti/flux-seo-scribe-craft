<?php
/**
 * Plugin Name: Flux SEO Optimizer
 * Description: Integrates React-based SEO tools with Gemini AI, using a WordPress backend to proxy API calls.
 * Version: 0.1.0
 * Author: Jules @ AI Software Engineer
 * Text Domain: flux-seo-optimizer
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

define( 'FLUX_SEO_OPTIMIZER_VERSION', '0.1.0' );
define( 'FLUX_SEO_OPTIMIZER_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'FLUX_SEO_OPTIMIZER_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Include admin settings and REST API proxy
require_once FLUX_SEO_OPTIMIZER_PLUGIN_DIR . 'includes/admin/settings-page.php';
require_once FLUX_SEO_OPTIMIZER_PLUGIN_DIR . 'includes/api/proxy-endpoint.php';
require_once FLUX_SEO_OPTIMIZER_PLUGIN_DIR . 'includes/core/shortcodes.php';
require_once FLUX_SEO_OPTIMIZER_PLUGIN_DIR . 'includes/core/enqueue-scripts.php';


// Activation/Deactivation hooks (optional, can be added later if needed for setup/cleanup)
// register_activation_hook( __FILE__, 'flux_seo_optimizer_activate' );
// register_deactivation_hook( __FILE__, 'flux_seo_optimizer_deactivate' );

// function flux_seo_optimizer_activate() {
//     // Actions to run on plugin activation, e.g., set default options
// }

// function flux_seo_optimizer_deactivate() {
//     // Actions to run on plugin deactivation
// }

/**
 * Initialize the plugin.
 * Loads text domain and other core functionalities.
 */
function flux_seo_optimizer_init() {
    load_plugin_textdomain( 'flux-seo-optimizer', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );

    // Initialize REST API endpoints and admin settings
    Flux_SEO_Optimizer_Proxy_Endpoint::instance();
    Flux_SEO_Optimizer_Settings_Page::instance();
    Flux_SEO_Optimizer_Shortcodes::instance();
    Flux_SEO_Optimizer_Enqueue_Scripts::instance();
}
add_action( 'plugins_loaded', 'flux_seo_optimizer_init' );
