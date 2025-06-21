/**
 * WordPress AJAX Communication Utility
 */

export interface WpAjaxError extends Error {
  response?: any; // Raw response
  status?: number; // HTTP status
  wpSuccess?: boolean; // WordPress success flag (from {success: boolean, data: any})
}

interface WpAjaxParams {
  wpAjaxAction: string; // The WordPress action hook (e.g., 'flux_seo_generate_content')
  action?: string; // The 'flux_action' if using a proxy like flux_seo_proxy
  data?: Record<string, any>; // Payload for the request
  method?: 'POST' | 'GET';
}

// Ensure fluxSeoAjax is available globally (localized by WordPress)
declare global {
  interface Window {
    fluxSeoAjax: {
      ajaxurl: string;
      nonce: string;
      // other localized data can be added here if needed
    };
  }
}

/**
 * Makes an AJAX request to the WordPress backend.
 *
 * @param params - The parameters for the AJAX request.
 * @returns A promise that resolves with the 'data' field of the WordPress AJAX response.
 * @throws {WpAjaxError} If the request fails or WordPress returns an error.
 */
export async function makeWpAjaxRequest<T = any>(
  params: WpAjaxParams
): Promise<T> {
  const { wpAjaxAction, action, data = {}, method = 'POST' } = params;

  if (!window.fluxSeoAjax?.ajaxurl || !window.fluxSeoAjax?.nonce) {
    console.error('fluxSeoAjax (ajaxurl or nonce) is not available on window.');
    const error = new Error(
      'AJAX configuration is missing. Ensure fluxSeoAjax is properly localized.'
    ) as WpAjaxError;
    throw error;
  }

  const formData = new FormData();
  formData.append('action', wpAjaxAction); // This is the WordPress action hook
  formData.append('nonce', window.fluxSeoAjax.nonce);

  if (action && wpAjaxAction === 'flux_seo_proxy') {
    // If using the proxy, the 'flux_action' is part of the data payload
    formData.append('flux_action', action);
  } else if (action) {
    // If not using proxy but action is provided, it might be an error or specific design
    console.warn(`'action' parameter was provided for non-proxy wpAjaxAction '${wpAjaxAction}'. Check usage.`);
  }

  // Append other data to FormData
  // For nested objects or arrays, WordPress typically expects them as JSON strings
  // or specific field naming (e.g., data[key][subkey]).
  // Here, we'll stringify complex objects if 'data' itself is the payload key,
  // or append individual items if 'data' is a flat structure.
  // The current PHP handlers (e.g. handle_gemini_content_generation) expect top-level fields.
  // The ajax_proxy_handler expects 'data' to be a JSON string for its sub-actions.

  if (wpAjaxAction === 'flux_seo_proxy' && data) {
    formData.append('data', JSON.stringify(data)); // Proxy expects 'data' as a JSON string
  } else {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value)); // Or handle complex types differently
        } else {
          formData.append(key, String(value));
        }
      }
    }
  }

  try {
    const response = await fetch(window.fluxSeoAjax.ajaxurl, {
      method: method,
      body: formData,
      // Headers are not typically needed for FormData fetch, browser sets multipart/form-data
    });

    if (!response.ok) {
      const error = new Error(
        `Network response was not ok. Status: ${response.status}`
      ) as WpAjaxError;
      error.status = response.status;
      try {
        error.response = await response.json();
      } catch (e) {
        error.response = await response.text();
      }
      throw error;
    }

    const jsonResponse = await response.json();

    if (jsonResponse.success === false) {
      const error = new Error(
        `WordPress AJAX error: ${jsonResponse.data || 'Unknown error'}`
      ) as WpAjaxError;
      error.wpSuccess = false;
      error.response = jsonResponse.data; // Contains the error message or details from WP
      throw error;
    }

    if (jsonResponse.success === true) {
        return jsonResponse.data as T;
    }

    // Fallback for responses that don't strictly follow {success: boolean, data: any}
    // but are still valid JSON from a successful HTTP request.
    // This might happen with older AJAX handlers or misconfigured ones.
    console.warn("AJAX response didn't have a 'success' boolean field. Assuming success based on HTTP status.", jsonResponse);
    return jsonResponse as T;

  } catch (error: any) {
    console.error(`Error in makeWpAjaxRequest for action '${wpAjaxAction}':`, error);
    // Re-throw if it's already a WpAjaxError, otherwise wrap it
    if (error.wpSuccess !== undefined || error.status !== undefined) {
      throw error;
    }
    const newError = new Error(`AJAX request failed: ${error.message}`) as WpAjaxError;
    newError.response = error;
    throw newError;
  }
}
