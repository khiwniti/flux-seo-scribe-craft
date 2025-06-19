/**
 * WordPress Integration for Flux SEO Scribe Craft
 * This file handles the integration between the React app and WordPress
 */

(function() {
    'use strict';

    // WordPress integration object
    window.FluxSEOWordPress = {
        initialized: false,
        
        // Initialize the application
        init: function() {
            if (this.initialized) return;
            
            console.log('Initializing Flux SEO Scribe Craft WordPress Integration');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', this.initApp.bind(this));
            } else {
                this.initApp();
            }
            
            this.initialized = true;
        },
        
        // Initialize the React application
        initApp: function() {
            // Find all root elements where the app should mount
            const rootElements = document.querySelectorAll('#root, #flux-seo-root, #flux-seo-admin-app, #flux-seo-shortcode-app');
            
            if (rootElements.length === 0) {
                console.warn('Flux SEO: No root element found for mounting the application');
                return;
            }
            
            // Setup AJAX integration
            this.setupAjaxIntegration();
            
            // Setup router integration
            this.setupRouterIntegration();
            
            // Initialize each root element
            rootElements.forEach((element, index) => {
                if (element.querySelector('#root')) {
                    // Already has a root element, skip
                    return;
                }
                
                // Create root div if it doesn't exist
                if (element.id !== 'root') {
                    const rootDiv = document.createElement('div');
                    rootDiv.id = 'root';
                    element.appendChild(rootDiv);
                }
            });
            
            console.log('Flux SEO: Application initialized successfully');
        },
        
        // Setup AJAX integration with WordPress
        setupAjaxIntegration: function() {
            if (typeof fluxSeoAjax === 'undefined') {
                console.warn('Flux SEO: WordPress AJAX configuration not found');
                return;
            }
            
            // Override fetch for API calls
            const originalFetch = window.fetch;
            window.fetch = function(url, options) {
                // Check if this is an API call that should go through WordPress
                if (url.includes('/api/') || url.includes('api.')) {
                    return FluxSEOWordPress.wordpressAjaxCall(url, options);
                }
                
                // For other requests, use original fetch
                return originalFetch.apply(this, arguments);
            };
        },
        
        // Handle API calls through WordPress AJAX
        wordpressAjaxCall: function(url, options) {
            console.log('FluxSEOWordPress.wordpressAjaxCall: URL:', url, 'Options:', options);
            return new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append('action', 'flux_seo_proxy');
                formData.append('nonce', fluxSeoAjax.nonce);
                
                // Determine the action based on URL
                let fluxAction = 'general';
                if (url.includes('analyze')) {
                    fluxAction = 'analyze_content';
                } else if (url.includes('generate')) {
                    fluxAction = 'generate_content';
                }
                
                formData.append('flux_action', fluxAction);
                
                // Add request data
                if (options && options.body) {
                    let data = options.body;
                    if (typeof data === 'string') {
                        try {
                            data = JSON.parse(data);
                        } catch (e) {
                            // Keep as string
                        }
                    }
                    formData.append('data', JSON.stringify(data));
                }
                
                // Make the AJAX call
                fetch(fluxSeoAjax.ajaxurl, {
                    method: 'POST',
                    body: formData,
                    credentials: 'same-origin'
                })
                .then(response => {
                    return response.text().then(text => {
                        console.log('FluxSEOWordPress.wordpressAjaxCall: Raw response text:', text);
                        return JSON.parse(text);
                    });
                })
                .then(data => {
                    if (data.success) {
                        // Create a mock Response object
                        const mockResponse = {
                            ok: true,
                            status: 200,
                            json: () => Promise.resolve(data.data),
                            text: () => Promise.resolve(JSON.stringify(data.data))
                        };
                        resolve(mockResponse);
                    } else {
                        console.error('FluxSEOWordPress.wordpressAjaxCall: Request failed, data:', data);
                        reject(new Error(data.data || 'Request failed'));
                    }
                })
                .catch(error => {
                    console.error('FluxSEOWordPress.wordpressAjaxCall: Caught error:', error);
                    reject(error);
                });
            });
        },
        
        // Setup router integration to work with WordPress
        setupRouterIntegration: function() {
            // Override history methods to prevent conflicts with WordPress
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;
            
            history.pushState = function(state, title, url) {
                // Only allow relative URLs within the app
                if (url && !url.startsWith('/') && !url.startsWith('#')) {
                    return;
                }
                return originalPushState.apply(this, arguments);
            };
            
            history.replaceState = function(state, title, url) {
                // Only allow relative URLs within the app
                if (url && !url.startsWith('/') && !url.startsWith('#')) {
                    return;
                }
                return originalReplaceState.apply(this, arguments);
            };
        },
        
        // Utility function to get WordPress admin URL
        getAdminUrl: function(path) {
            if (typeof fluxSeoAjax !== 'undefined' && fluxSeoAjax.adminUrl) {
                return fluxSeoAjax.adminUrl + (path || '');
            }
            return '/wp-admin/' + (path || '');
        },
        
        // Utility function to get plugin URL
        getPluginUrl: function(path) {
            if (typeof fluxSeoAjax !== 'undefined' && fluxSeoAjax.pluginUrl) {
                return fluxSeoAjax.pluginUrl + (path || '');
            }
            return '/wp-content/plugins/flux-seo-scribe-craft/' + (path || '');
        }
    };
    
    // Auto-initialize when script loads
    window.FluxSEOWordPress.init();
    
    // Also initialize on window load as backup
    window.addEventListener('load', function() {
        window.FluxSEOWordPress.init();
    });
    
})();