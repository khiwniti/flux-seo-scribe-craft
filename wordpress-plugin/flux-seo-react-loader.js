/**
 * React Loader for Flux SEO Scribe Craft
 * Ensures React and ReactDOM are properly loaded before initializing the app
 */

(function() {
    'use strict';
    
    console.log('🔧 FluxSEO React Loader: Starting...');
    console.log('🔍 Current environment check:', {
        React: typeof window.React,
        ReactDOM: typeof window.ReactDOM,
        fluxSeoAjax: typeof window.fluxSeoAjax,
        location: window.location.href
    });
    
    // Check if React and ReactDOM are available
    function checkReactAvailability() {
        const reactAvailable = typeof window.React !== 'undefined';
        const reactDOMAvailable = typeof window.ReactDOM !== 'undefined';
        
        console.log('🔍 React availability check:', {
            React: reactAvailable,
            ReactDOM: reactDOMAvailable,
            windowReact: !!window.React,
            windowReactDOM: !!window.ReactDOM
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
        const rootElement = document.getElementById('root');
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
    }
    
    // Initialize the app once React is available
    function initializeFluxSEOApp() {
        console.log('🚀 Initializing FluxSEO App with React...');
        
        // Load the main app script
        const script = document.createElement('script');
        const pluginUrl = (typeof fluxSeoAjax !== 'undefined' && fluxSeoAjax.pluginUrl) 
            ? fluxSeoAjax.pluginUrl 
            : './';
        script.src = pluginUrl + 'flux-seo-wordpress-app.js';
        console.log('📦 Loading main app script from:', script.src);
        script.onload = function() {
            console.log('✅ FluxSEO App script loaded successfully');
            
            // Wait a bit for the app to initialize
            setTimeout(() => {
                if (typeof window.FluxSEOApp !== 'undefined') {
                    console.log('🎉 FluxSEOApp is ready!');
                } else {
                    console.warn('⚠️ FluxSEOApp not found after script load');
                }
            }, 500);
        };
        script.onerror = function() {
            console.error('❌ Failed to load FluxSEO App script');
            showAppLoadError();
        };
        
        document.head.appendChild(script);
    }
    
    // Show error if app script fails to load
    function showAppLoadError() {
        const rootElement = document.getElementById('root');
        if (rootElement) {
            rootElement.innerHTML = `
                <div style="padding: 20px; border: 2px solid #dc3545; border-radius: 8px; background: #f8d7da; color: #721c24; margin: 20px;">
                    <h3>⚠️ App Loading Error</h3>
                    <p>The FluxSEO application script could not be loaded.</p>
                    <p><strong>Possible causes:</strong></p>
                    <ul>
                        <li>Plugin files are missing or corrupted</li>
                        <li>Server permissions issue</li>
                        <li>JavaScript syntax error in the app</li>
                    </ul>
                    <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Refresh Page
                    </button>
                </div>
            `;
        }
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