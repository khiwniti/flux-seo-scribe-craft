<?php
/**
 * Plugin Name: Flux SEO App
 * Plugin URI: https://example.com/plugins/flux-seo-app/
 * Description: Integrates the Flux SEO React application into WordPress.
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://example.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: flux-seo-app
 * Domain Path: /languages
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Define plugin constants.
define( 'FLUX_SEO_APP_VERSION', '1.0.0' );
define( 'FLUX_SEO_APP_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'FLUX_SEO_APP_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Enqueue scripts and styles.
 */
function flux_seo_app_enqueue_scripts() {
    // Enqueue WordPress React and ReactDOM.
    wp_enqueue_script( 'react' );
    wp_enqueue_script( 'react-dom' );

    // Enqueue the main plugin script.
    wp_enqueue_script(
        'flux-seo-app-script',
        FLUX_SEO_APP_PLUGIN_URL . '../dist/flux-seo-plugin/flux-seo-app.js',
        array( 'react', 'react-dom' ), // Dependencies
        FLUX_SEO_APP_VERSION,
        true // Load in footer
    );

    // Pass data to the script if needed, e.g., API endpoints, nonces.
    wp_localize_script(
        'flux-seo-app-script',
        'fluxSeoAppData',
        array(
            'api_url' => rest_url( 'flux-seo/v1/' ),
            'nonce'   => wp_create_nonce( 'wp_rest' ),
        )
    );

    // Enqueue a basic stylesheet if your app needs one.
    // If your app's CSS is bundled within the JS, this might not be necessary.
    // wp_enqueue_style(
    // 'flux-seo-app-style',
    // FLUX_SEO_APP_PLUGIN_URL . '../dist/flux-seo-plugin/style.css', // Assuming a separate CSS file
    // array(),
    // FLUX_SEO_APP_VERSION
    // );
}
// Hook for front-end and admin area.
// If the app is admin-only, use admin_enqueue_scripts. If front-end only, use wp_enqueue_scripts.
// Using a general hook for now, can be refined.
add_action( 'wp_enqueue_scripts', 'flux_seo_app_enqueue_scripts' );
add_action( 'admin_enqueue_scripts', 'flux_seo_app_enqueue_scripts' );


/**
 * Shortcode to display the React app.
 * Usage: [flux_seo_app] or [flux_seo_app container_id="custom-id"]
 *
 * @param array $atts Shortcode attributes.
 * @return string HTML output for the app container.
 */
function flux_seo_app_shortcode( $atts ) {
    $atts = shortcode_atts(
        array(
            'container_id' => 'flux-seo-app-container-' . uniqid(),
        ),
        $atts,
        'flux_seo_app'
    );

    $container_id = esc_attr( $atts['container_id'] );

    // The JavaScript will look for this ID to mount the app.
    // The `wordpress-entry.tsx` initializes the app on `DOMContentLoaded` or via custom event.
    // We can also trigger it explicitly.
    ob_start();
    ?>
    <div id="<?php echo $container_id; ?>">
        <p>Loading Flux SEO App...</p>
    </div>
    <script type="text/javascript">
        document.addEventListener('DOMContentLoaded', function() {
            if (window.FluxSEOApp && typeof window.FluxSEOApp.init === 'function') {
                console.log('Flux SEO Plugin: Initializing app for shortcode container <?php echo $container_id; ?>');
                window.FluxSEOApp.init('<?php echo $container_id; ?>');
            } else {
                console.error('Flux SEO Plugin: FluxSEOApp.init is not available. Make sure the main script is loaded.');
                // Fallback if script loading is delayed or fails
                var attempts = 0;
                var interval = setInterval(function() {
                    attempts++;
                    if (window.FluxSEOApp && typeof window.FluxSEOApp.init === 'function') {
                        clearInterval(interval);
                        console.log('Flux SEO Plugin (delayed): Initializing app for shortcode container <?php echo $container_id; ?>');
                        window.FluxSEOApp.init('<?php echo $container_id; ?>');
                    } else if (attempts > 20) { // Try for ~10 seconds
                        clearInterval(interval);
                        console.error('Flux SEO Plugin (delayed): Failed to initialize app for <?php echo $container_id; ?> after multiple attempts.');
                        var el = document.getElementById('<?php echo $container_id; ?>');
                        if(el) el.innerHTML = '<p>Error: Could not load Flux SEO App. Please check browser console for details.</p>';
                    }
                }, 500);
            }
        });
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode( 'flux_seo_app', 'flux_seo_app_shortcode' );

/**
 * Add an admin menu page for the app.
 */
function flux_seo_app_admin_menu() {
    add_menu_page(
        __( 'Flux SEO App', 'flux-seo-app' ), // Page title
        __( 'Flux SEO', 'flux-seo-app' ),    // Menu title
        'manage_options',                    // Capability
        'flux-seo-app',                      // Menu slug
        'flux_seo_app_admin_page_content',   // Callback function to display page content
        'dashicons-chart-area',              // Icon URL or dashicon class
        80                                   // Position
    );
}
add_action( 'admin_menu', 'flux_seo_app_admin_menu' );

/**
 * Display the admin page content.
 * This will simply be a div where our React app mounts.
 */
function flux_seo_app_admin_page_content() {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }
    // The main app script should already be enqueued by 'admin_enqueue_scripts'.
    // The `wordpress-entry.tsx` initializes the app on `DOMContentLoaded` or via custom event.
    // We provide a unique ID for the container.
    $container_id = 'flux-seo-admin-app-container';
    ?>
    <div class="wrap">
        <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
        <div id="<?php echo esc_attr( $container_id ); ?>">
            <p>Loading Flux SEO Application...</p>
        </div>
    </div>
    <script type="text/javascript">
        document.addEventListener('DOMContentLoaded', function() {
            // Ensure this runs after the main script has defined FluxSEOApp
            if (window.FluxSEOApp && typeof window.FluxSEOApp.init === 'function') {
                 console.log('Flux SEO Plugin: Initializing app for admin container <?php echo $container_id; ?>');
                window.FluxSEOApp.init('<?php echo esc_attr( $container_id ); ?>');
            } else {
                console.error('Flux SEO Plugin: FluxSEOApp.init is not available for admin page. Make sure the main script is loaded.');
                 var attempts = 0;
                var interval = setInterval(function() {
                    attempts++;
                    if (window.FluxSEOApp && typeof window.FluxSEOApp.init === 'function') {
                        clearInterval(interval);
                        console.log('Flux SEO Plugin (delayed): Initializing app for admin container <?php echo $container_id; ?>');
                        window.FluxSEOApp.init('<?php echo esc_attr( $container_id ); ?>');
                    } else if (attempts > 20) { // Try for ~10 seconds
                        clearInterval(interval);
                        console.error('Flux SEO Plugin (delayed): Failed to initialize admin app for <?php echo $container_id; ?> after multiple attempts.');
                        var el = document.getElementById('<?php echo esc_attr( $container_id ); ?>');
                        if(el) el.innerHTML = '<p>Error: Could not load Flux SEO App. Please check browser console for details.</p>';
                    }
                }, 500);
            }
        });
    </script>
    <?php
}

/**
 * Activation hook.
 */
function flux_seo_app_activate() {
    // Actions to run on plugin activation, e.g., set default options.
    if ( ! get_option( 'flux_seo_app_version' ) ) {
        update_option( 'flux_seo_app_version', FLUX_SEO_APP_VERSION );
    }
}
register_activation_hook( __FILE__, 'flux_seo_app_activate' );

/**
 * Deactivation hook.
 */
function flux_seo_app_deactivate() {
    // Actions to run on plugin deactivation.
}
register_deactivation_hook( __FILE__, 'flux_seo_app_deactivate' );

/**
 * Uninstall hook.
 * Note: This is called when the user deletes the plugin from the WordPress admin.
 * It's not called on deactivation.
 */
function flux_seo_app_uninstall() {
    // Actions to run on plugin uninstall, e.g., delete options, custom tables.
    delete_option( 'flux_seo_app_version' );
    // Add any other cleanup specific to your plugin.
}
// For uninstall, it's common to check if WP_UNINSTALL_PLUGIN is defined.
// However, register_uninstall_hook is the more modern way if your plugin is in a single file like this.
if ( function_exists( 'register_uninstall_hook' ) ) {
    register_uninstall_hook( __FILE__, 'flux_seo_app_uninstall' );
}

// TODO: Add REST API endpoints if needed for the app to communicate with WordPress backend.
// Example:
// add_action( 'rest_api_init', function () {
// register_rest_route( 'flux-seo/v1', '/settings/', array(
// 'methods' => 'GET',
// 'callback' => 'flux_seo_get_settings',
// 'permission_callback' => function () {
// return current_user_can( 'manage_options' );
// }
// ) );
// register_rest_route( 'flux-seo/v1', '/settings/', array(
// 'methods' => 'POST',
// 'callback' => 'flux_seo_save_settings',
// 'permission_callback' => function () {
// return current_user_can( 'manage_options' );
// }
// ) );
// } );
//
// function flux_seo_get_settings() {
// // ... get settings logic ...
// return new WP_REST_Response( get_option('flux_seo_settings', []), 200 );
// }
//
// function flux_seo_save_settings( WP_REST_Request $request ) {
// // ... save settings logic ...
// $settings = $request->get_json_params();
// update_option( 'flux_seo_settings', $settings );
// return new WP_REST_Response( 'Settings saved.', 200 );
// }

?>
