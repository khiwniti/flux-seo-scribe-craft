<?php
/**
 * WordPress REST API Proxy Endpoint for Gemini API
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

class Flux_SEO_Optimizer_Proxy_Endpoint {

    private static $_instance = null;
    protected $namespace = 'flux-seo/v1';
    protected $route_base = 'gemini-proxy';

    public static function instance() {
        if ( is_null( self::$_instance ) ) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    private function __construct() {
        add_action( 'rest_api_init', array( $this, 'register_routes' ) );
    }

    public function register_routes() {
        register_rest_route(
            $this->namespace,
            '/' . $this->route_base,
            array(
                array(
                    'methods'             => WP_REST_Server::CREATABLE, // POST
                    'callback'            => array( $this, 'handle_proxy_request' ),
                    'permission_callback' => array( $this, 'permissions_check' ),
                    'args'                => $this->get_endpoint_args(),
                ),
                'schema' => array( $this, 'get_public_item_schema' ),
            )
        );
    }

    public function permissions_check( $request ) {
        // Using 'edit_posts' as a basic capability check.
        // Adjust this capability based on who should be able to use the plugin's features.
        // For a more public-facing tool that any logged-in user can use, 'read' might be okay,
        // but for something that consumes API quota, 'edit_posts' or a custom capability is better.
        if ( ! current_user_can( 'edit_posts' ) ) {
            return new WP_Error(
                'rest_forbidden_context',
                __( 'Sorry, you are not allowed to access this endpoint.', 'flux-seo-optimizer' ),
                array( 'status' => rest_authorization_required_code() )
            );
        }
        // Explicitly verify the nonce passed in the header by geminiService.ts
        $nonce = $request->get_header( 'X-WP-Nonce' );
        if ( ! $nonce || ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
            return new WP_Error(
                'rest_nonce_invalid',
                __( 'Nonce is invalid or missing from X-WP-Nonce header.', 'flux-seo-optimizer' ),
                array( 'status' => 403 )
            );
        }
        return true;
    }

    public function handle_proxy_request( WP_REST_Request $request ) {
        $api_key = Flux_SEO_Optimizer_Settings_Page::get_api_key();

        if ( empty( $api_key ) ) {
            return new WP_Error(
                'missing_api_key',
                __( 'Google Gemini API key is missing. Please configure it in the plugin settings.', 'flux-seo-optimizer' ),
                array( 'status' => 400 ) // Bad Request, or 401/403 could also be considered
            );
        }

        $body_params = $request->get_json_params();

        if ( empty( $body_params ) ) {
            return new WP_Error(
                'missing_payload',
                __( 'Request payload is missing.', 'flux-seo-optimizer' ),
                array( 'status' => 400 )
            );
        }

        // Structure of payload from geminiService.ts:
        // $payload = {
        //   model: "gemini-pro", (or other model)
        //   prompt: "Some prompt text", (for generateBlogContent)
        //   contents: [{ role: "user", parts: [{ text: "prompt" }] }, ...], (for getChatbotResponse, generateImagePromptForText)
        //   generationConfig: { ... },
        // };

        $gemini_api_url = '';
        $gemini_request_body = array();

        // Determine the Gemini API URL and construct the body based on the incoming payload.
        // The current geminiService.ts sends a 'prompt' for generateBlogContent,
        // and 'contents' for others. The Gemini API generally uses a 'contents' array.
        // We might need to adapt the 'prompt' to the 'contents' structure.

        $model = isset( $body_params['model'] ) ? sanitize_text_field( $body_params['model'] ) : 'gemini-pro';
        // The Gemini API URL structure is typically:
        // https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY
        // Or for chat:
        // https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:streamGenerateContent?key=YOUR_API_KEY (if streaming)
        // We'll use generateContent for now.

        $gemini_api_url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$api_key}";

        $gemini_request_body['contents'] = array();

        if ( isset( $body_params['prompt'] ) && !empty( $body_params['prompt'] ) ) {
            // Adapt simple prompt to 'contents' structure
            $gemini_request_body['contents'][] = array(
                'parts' => array(
                    array( 'text' => $body_params['prompt'] )
                )
            );
        } elseif ( isset( $body_params['contents'] ) && is_array( $body_params['contents'] ) ) {
            $gemini_request_body['contents'] = $body_params['contents']; // Assuming already in correct format
        } else {
            return new WP_Error(
                'invalid_payload',
                __( 'Invalid payload structure. Missing "prompt" or "contents".', 'flux-seo-optimizer' ),
                array( 'status' => 400 )
            );
        }

        if ( isset( $body_params['generationConfig'] ) ) {
            $gemini_request_body['generationConfig'] = $body_params['generationConfig'];
        }
        // Add safetySettings if passed and needed, or apply defaults server-side.
        // if (isset($body_params['safetySettings'])) {
        //     $gemini_request_body['safetySettings'] = $body_params['safetySettings'];
        // }


        $args = array(
            'method'  => 'POST',
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
            'body'    => wp_json_encode( $gemini_request_body ),
            'timeout' => 60, // Increased timeout for potentially long AI responses
        );

        $response = wp_remote_post( $gemini_api_url, $args );

        if ( is_wp_error( $response ) ) {
            // WordPress HTTP API error
            return new WP_Error(
                'gemini_api_wp_error',
                $response->get_error_message(),
                array( 'status' => 500 ) // Internal Server Error
            );
        }

        $response_code = wp_remote_retrieve_response_code( $response );
        $response_body = wp_remote_retrieve_body( $response );
        $decoded_body = json_decode( $response_body, true );

        if ( $response_code >= 200 && $response_code < 300 ) {
            // Successful response from Gemini
            return new WP_REST_Response( $decoded_body, $response_code );
        } else {
            // Error from Gemini API
            $error_message = __( 'An unknown error occurred with the Gemini API.', 'flux-seo-optimizer' );
            $error_details = $decoded_body;

            if ( isset( $decoded_body['error']['message'] ) ) {
                $error_message = $decoded_body['error']['message'];
            }

            // Check if the error indicates an API key issue from Gemini's side
            $is_api_key_issue = false;
            if ( isset( $decoded_body['error']['status'] ) ) {
                $status = $decoded_body['error']['status'];
                if ( $status === 'UNAUTHENTICATED' || $status === 'PERMISSION_DENIED' ) {
                     $is_api_key_issue = true;
                }
            }
            if (strpos(strtolower($error_message), 'api key') !== false) {
                $is_api_key_issue = true;
            }

            if ($is_api_key_issue) {
                 return new WP_Error(
                    'missing_api_key', // Use the same code as geminiService.ts expects for API key issues
                    __( 'Gemini API request failed due to an API key issue: ', 'flux-seo-optimizer' ) . $error_message,
                    array( 'status' => $response_code, 'details' => $error_details )
                );
            }

            return new WP_Error(
                'gemini_api_error',
                $error_message,
                array( 'status' => $response_code, 'details' => $error_details )
            );
        }
    }

    public function get_endpoint_args() {
        // Define expected arguments for the endpoint if needed for validation/sanitization
        // For now, we are taking the raw JSON params.
        return array();
    }

    public function get_public_item_schema() {
        // Define schema for the endpoint if needed
        return array();
    }
}
