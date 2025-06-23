/**
 * React Loader for Flux SEO Scribe Craft
 * Ensures React and ReactDOM are properly loaded before initializing the app
 */

(function() {
    'use strict';
    
    console.log('🔧 FluxSEO React Loader: Starting...');
    
    // Check if React and ReactDOM are available
    function checkReactAvailability() {
        const reactAvailable = typeof window.React !== 'undefined';
        const reactDOMAvailable = typeof window.ReactDOM !== 'undefined';
        
        console.log('🔍 Current environment check:', {
            React: typeof React,
            ReactDOM: typeof ReactDOM,
            windowReact: typeof window.React,
            windowReactDOM: typeof window.ReactDOM
        });
        
        return reactAvailable && reactDOMAvailable;
    }
    
    // Wait for React to be available
    function waitForReact(callback, maxAttempts = 50) {
        let attempts = 0;
        
        const checkInterval = setInterval(() => {
            attempts++;
            console.log(`🔄 Attempt ${attempts}/${maxAttempts}: Checking for React...`);
            
            if (checkReactAvailability()) {
                console.log('✅ React and ReactDOM are available!');
                clearInterval(checkInterval);
                callback();
            } else if (attempts >= maxAttempts) {
                console.error('❌ React not found after maximum attempts');
                clearInterval(checkInterval);
                showReactError();
            }
        }, 200);
    }
    
    // Show error if React is not available
    function showReactError() {
        const rootElements = document.querySelectorAll('#flux-seo-admin-dashboard, [id^="flux-seo-container-"]');
        rootElements.forEach(rootElement => {
            if (rootElement) {
                rootElement.innerHTML = `
                    <div style="padding: 20px; border: 2px solid #dc3545; border-radius: 8px; background: #f8d7da; color: #721c24; margin: 20px;">
                        <h3>⚠️ React Loading Error</h3>
                        <p>React and ReactDOM libraries could not be loaded.</p>
                        <p><strong>Possible solutions:</strong></p>
                        <ul>
                            <li>Check your internet connection</li>
                            <li>Verify CDN accessibility</li>
                            <li>Check browser console for network errors</li>
                            <li>Try refreshing the page</li>
                        </ul>
                        <p><strong>Technical details:</strong></p>
                        <ul>
                            <li>React available: ${typeof window.React !== 'undefined'}</li>
                            <li>ReactDOM available: ${typeof window.ReactDOM !== 'undefined'}</li>
                        </ul>
                        <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Refresh Page
                        </button>
                    </div>
                `;
            }
        });
    }
    
    // Initialize the app once React is available
    function initializeFluxSEOApp() {
        console.log('🚀 Initializing FluxSEO App with React...');
        
        // Check for service workers and disable them to prevent conflicts
        if ('serviceWorker' in navigator) {
            console.log('🔧 FluxSEO: Checking for service workers to disable...');
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                if (registrations.length > 0) {
                    console.log('🚫 FluxSEO: Found', registrations.length, 'service worker(s), unregistering...');
                    for(let registration of registrations) {
                        registration.unregister();
                    }
                } else {
                    console.log('✅ FluxSEO: No service workers found to unregister');
                }
            });
        }
        
        // Wait for the app to be ready
        if (typeof window.FluxSEOApp !== 'undefined' && typeof window.FluxSEOApp.init === 'function') {
            console.log('🎉 FluxSEOApp is ready!');
        } else {
            console.log('⏳ FluxSEOApp not yet available, waiting...');
            waitForFluxSEOApp();
        }
    }
    
    // Wait for FluxSEOApp to become available
    function waitForFluxSEOApp() {
        let attempts = 0;
        const maxAttempts = 30;
        
        const checkInterval = setInterval(() => {
            attempts++;
            
            if (typeof window.FluxSEOApp !== 'undefined' && typeof window.FluxSEOApp.init === 'function') {
                console.log('🎉 FluxSEOApp is ready!');
                clearInterval(checkInterval);
            } else if (attempts >= maxAttempts) {
                console.error('❌ FluxSEOApp not found after maximum attempts');
                clearInterval(checkInterval);
                showAppLoadError();
            } else {
                console.log(`⏳ Flux SEO: FluxSEOApp not yet available, retrying... (${attempts}/${maxAttempts})`);
            }
        }, 500);
    }
    
    // Show error if app fails to load
    function showAppLoadError() {
        const rootElements = document.querySelectorAll('#flux-seo-admin-dashboard, [id^="flux-seo-container-"]');
        rootElements.forEach(rootElement => {
            if (rootElement) {
                rootElement.innerHTML = `
                    <div style="padding: 20px; border: 2px solid #dc3545; border-radius: 8px; background: #f8d7da; color: #721c24; margin: 20px;">
                        <h3>⚠️ Loading Issue</h3>
                        <p>The SEO application is taking longer than expected to load.</p>
                        <p><strong>Possible causes:</strong></p>
                        <ul>
                            <li>JavaScript files not loading correctly</li>
                            <li>Network connectivity issues</li>
                            <li>Plugin conflicts</li>
                        </ul>
                        <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Refresh Page
                        </button>
                    </div>
                `;
            }
        });
    }
    
    // Start the loading process
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            waitForReact(initializeFluxSEOApp);
        });
    } else {
        waitForReact(initializeFluxSEOApp);
    }
    
})();