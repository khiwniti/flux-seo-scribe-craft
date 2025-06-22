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
            'rest_url' => esc_url_raw( rest_url() ), // Ensure this is the base REST URL
            'nonce'    => wp_create_nonce( 'wp_rest' ),
            'proxy_endpoint' => esc_url_raw( rest_url( 'flux-seo/v1/gemini-proxy' ) ), // Specific proxy endpoint
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

    // Add a submenu page for settings.
    add_submenu_page(
        'flux-seo-app',                      // Parent slug
        __( 'Flux SEO Settings', 'flux-seo-app' ), // Page title
        __( 'Settings', 'flux-seo-app' ),    // Menu title
        'manage_options',                    // Capability
        'flux-seo-app-settings',             // Menu slug
        'flux_seo_app_settings_page_content' // Callback function
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
 * Display the settings page content.
 */
function flux_seo_app_settings_page_content() {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }

    // Check if the form has been submitted
    if ( isset( $_POST['flux_seo_api_key_nonce'] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['flux_seo_api_key_nonce'] ) ), 'flux_seo_save_api_key' ) ) {
        if ( isset( $_POST['flux_seo_gemini_api_key'] ) ) {
            $api_key = sanitize_text_field( wp_unslash( $_POST['flux_seo_gemini_api_key'] ) );
            update_option( 'flux_seo_gemini_api_key', $api_key );
            echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'Settings saved.', 'flux-seo-app' ) . '</p></div>';
        }
    }

    $current_api_key = get_option( 'flux_seo_gemini_api_key', '' );
    ?>
    <div class="wrap">
        <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
        <form method="post" action="">
            <?php wp_nonce_field( 'flux_seo_save_api_key', 'flux_seo_api_key_nonce' ); ?>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">
                        <label for="flux_seo_gemini_api_key"><?php esc_html_e( 'Gemini API Key', 'flux-seo-app' ); ?></label>
                    </th>
                    <td>
                        <input type="text" id="flux_seo_gemini_api_key" name="flux_seo_gemini_api_key" value="<?php echo esc_attr( $current_api_key ); ?>" class="regular-text" />
                        <p class="description">
                            <?php esc_html_e( 'Enter your Gemini API key. This key is required for all AI-powered features.', 'flux-seo-app' ); ?>
                            <a href="https://aistudio.google.com/app/apikey" target="_blank"><?php esc_html_e( 'Get your API key from Google AI Studio.', 'flux-seo-app'); ?></a>
                        </p>
                    </td>
                </tr>
            </table>
            <?php submit_button( __( 'Save API Key', 'flux-seo-app' ) ); ?>
        </form>
    </div>
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


/**
 * Register REST API endpoint for Gemini Proxy.
 */
add_action( 'rest_api_init', 'flux_seo_register_gemini_proxy_endpoint' );

function flux_seo_register_gemini_proxy_endpoint() {
    register_rest_route(
        'flux-seo/v1', // Namespace
        '/gemini-proxy',   // Route
        array(
            'methods'             => WP_REST_Server::CREATABLE, // Corresponds to POST
            'callback'            => 'flux_seo_handle_gemini_proxy_request',
            'permission_callback' => function () {
                // Only allow users who can manage options (administrators)
                // Or any logged-in user if you want broader access for specific features.
                // For now, let's restrict to admins.
                return current_user_can( 'manage_options' );
            },
            'args' => array( // Define expected arguments from the request body
                'model' => array(
                    'required' => true,
                    'type' => 'string',
                    'description' => 'The Gemini model to use (e.g., gemini-pro).',
                ),
                'prompt' => array(
                    'required' => false,
                    'type' => 'string',
                    'description' => 'The prompt for content generation.',
                ),
                'contents' => array( // For chat or multi-turn
                    'required' => false,
                    'type' => 'array',
                    'description' => 'Contents for chat or multi-turn conversation.',
                ),
                'generationConfig' => array(
                    'required' => false,
                    'type' => 'object',
                    'description' => 'Configuration for content generation.',
                ),
                // Add other parameters your geminiService might send
            ),
        )
    );
}

/**
 * Handle the Gemini proxy request.
 *
 * @param WP_REST_Request $request The incoming REST API request.
 * @return WP_REST_Response|WP_Error The REST API response or an error.
 */
function flux_seo_handle_gemini_proxy_request( WP_REST_Request $request ) {
    $api_key = get_option( 'flux_seo_gemini_api_key', '' );

    if ( empty( $api_key ) ) {
        return new WP_Error(
            'missing_api_key',
            __( 'Gemini API key is not configured in Flux SEO settings.', 'flux-seo-app' ),
            array( 'status' => 400 ) // Bad Request
        );
    }

    $params = $request->get_json_params();
    $model = isset( $params['model'] ) ? sanitize_text_field( $params['model'] ) : null;

    // Determine the correct Gemini API URL based on the task (generateContent vs. countTokens vs. chat)
    // This logic needs to mirror what geminiService.ts does.
    // For now, assuming a generic generateContent style endpoint.
    // Example: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
    // The model name is part of the URL path for some Gemini API calls.

    $gemini_api_url = '';
    $request_body = array();

    // Simplified example: assuming all calls are for generateContent or chat (which uses generateContent)
    if ( strpos($model, 'gemini-') === 0 ) { // Basic check
        $gemini_api_url = "https://generativelanguage.googleapis.com/v1beta/models/" . $model . ":generateContent?key=" . $api_key;

        // Construct the body based on expected parameters from geminiService.ts
        if (isset($params['contents'])) { // For chat-like or multi-part requests
            $request_body['contents'] = $params['contents']; // Needs sanitization if complex
        } elseif (isset($params['prompt'])) { // Simpler prompt-based generation
             $request_body['contents'] = array(array('parts' => array(array('text' => $params['prompt']))));
        }

        if (isset($params['generationConfig'])) {
            $request_body['generationConfig'] = $params['generationConfig']; // Needs sanitization
        }

    } else {
         return new WP_Error(
            'invalid_model_for_proxy',
            __( 'The specified model is not supported by this proxy or is invalid.', 'flux-seo-app' ),
            array( 'status' => 400 )
        );
    }


    if ( empty( $request_body ) ) {
        return new WP_Error(
            'missing_payload',
            __( 'Missing required payload (e.g., prompt or contents).', 'flux-seo-app' ),
            array( 'status' => 400 )
        );
    }

    $args = array(
        'method'  => 'POST',
        'headers' => array(
            'Content-Type' => 'application/json',
        ),
        'body'    => wp_json_encode( $request_body ),
        'timeout' => 60, // Increase timeout for potentially long AI responses
    );

    $response = wp_remote_post( $gemini_api_url, $args );

    if ( is_wp_error( $response ) ) {
        return new WP_Error(
            'gemini_api_request_failed',
            $response->get_error_message(),
            array( 'status' => 500 ) // Internal Server Error
        );
    }

    $response_code = wp_remote_retrieve_response_code( $response );
    $response_body = wp_remote_retrieve_body( $response );
    $decoded_body = json_decode( $response_body, true );

    if ( $response_code >= 200 && $response_code < 300 ) {
        return new WP_REST_Response( $decoded_body, $response_code );
    } else {
        // Try to return a more specific error from Gemini if available
        $error_message = __( 'An unknown error occurred with the Gemini API.', 'flux-seo-app' );
        if ( isset( $decoded_body['error']['message'] ) ) {
            $error_message = $decoded_body['error']['message'];
        }
        return new WP_Error(
            'gemini_api_error',
            $error_message,
            array( 'status' => $response_code, 'details' => $decoded_body )
        );
    }
}

?>
