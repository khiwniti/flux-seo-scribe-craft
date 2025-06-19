/**
 * WordPress Integration for Flux SEO Scribe Craft
 * This file handles the integration between the React app and WordPress
 */

(function() {
    'use strict';
    
    console.log('⏭️ FluxSEO WordPress Integration: Script loaded');
    console.log('🔍 Integration environment check:', {
        FluxSEOApp: typeof window.FluxSEOApp,
        React: typeof window.React,
        ReactDOM: typeof window.ReactDOM,
        fluxSeoAjax: typeof window.fluxSeoAjax
    });

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
            console.log('🔧 FluxSEOWordPress.initApp: Starting initialization...');
            
            // Find all root elements where the app should mount
            const rootElements = document.querySelectorAll('#root, #flux-seo-root, #flux-seo-admin-app, #flux-seo-shortcode-app');
            console.log('🔍 Found root elements:', rootElements.length, Array.from(rootElements).map(el => el.id));
            
            if (rootElements.length === 0) {
                console.warn('⚠️ Flux SEO: No root element found for mounting the application');
                console.log('📋 Available elements:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));
                return;
            }
            
            // Setup AJAX integration
            this.setupAjaxIntegration();
            
            // Setup router integration
            this.setupRouterIntegration();
            
            // Initialize each root element
            rootElements.forEach((element, index) => {
                console.log(`🎯 Processing root element ${index + 1}:`, element.id);
                
                if (element.querySelector('#root')) {
                    console.log('⏭️ Element already has a root child, skipping');
                    return;
                }
                
                // Create root div if it doesn't exist
                if (element.id !== 'root') {
                    const rootDiv = document.createElement('div');
                    rootDiv.id = 'root';
                    element.appendChild(rootDiv);
                    console.log('✅ Created root div inside:', element.id);
                }
            });
            
            // Check if FluxSEOApp is available and try to initialize
            this.checkAndInitializeFluxSEOApp();
            
            console.log('✅ Flux SEO: WordPress integration initialized successfully');
        },
        
        // Check for FluxSEOApp and initialize it
        checkAndInitializeFluxSEOApp: function() {
            console.log('🔍 Checking for window.FluxSEOApp...');
            
            if (typeof window.FluxSEOApp !== 'undefined' && window.FluxSEOApp.init) {
                console.log('✅ FluxSEOApp found, initializing...');
                try {
                    window.FluxSEOApp.init('root');
                    console.log('🎉 FluxSEOApp initialized successfully');
                } catch (error) {
                    console.error('💥 Error initializing FluxSEOApp:', error);
                }
            } else {
                console.log('⏳ FluxSEOApp not yet available, will retry...');
                // Listen for when the app becomes available
                this.waitForFluxSEOApp();
            }
        },
        
        // Wait for FluxSEOApp to become available
        waitForFluxSEOApp: function() {
            let attempts = 0;
            const maxAttempts = 30; // 15 seconds with 500ms intervals
            
            const checkInterval = setInterval(() => {
                attempts++;
                console.log(`🔄 Attempt ${attempts}/${maxAttempts}: Checking for FluxSEOApp...`);
                
                if (typeof window.FluxSEOApp !== 'undefined' && window.FluxSEOApp.init) {
                    console.log('✅ FluxSEOApp found after waiting, initializing...');
                    clearInterval(checkInterval);
                    try {
                        window.FluxSEOApp.init('root');
                        console.log('🎉 FluxSEOApp initialized successfully');
                    } catch (error) {
                        console.error('💥 Error initializing FluxSEOApp:', error);
                    }
                } else if (attempts >= maxAttempts) {
                    console.error('❌ FluxSEOApp not found after maximum attempts');
                    clearInterval(checkInterval);
                    this.showLoadingError();
                }
            }, 500);
        },
        
        // Show loading error
        showLoadingError: function() {
            const rootElement = document.getElementById('root');
            if (rootElement) {
                rootElement.innerHTML = `
                    <div style="padding: 20px; border: 2px solid #dc3545; border-radius: 8px; background: #f8d7da; color: #721c24; margin: 20px;">
                        <h3>⚠️ WordPress Integration Error</h3>
                        <p>The FluxSEOApp could not be loaded properly.</p>
                        <p><strong>Possible causes:</strong></p>
                        <ul>
                            <li>JavaScript files not loading correctly</li>
                            <li>React dependencies missing</li>
                            <li>Plugin file conflicts</li>
                            <li>Browser compatibility issues</li>
                        </ul>
                        <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Refresh Page
                        </button>
                    </div>
                `;
            }
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