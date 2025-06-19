console.log('Flux SEO: flux-seo-wordpress-app.js script started execution.');
/**
 * Flux SEO Scribe Craft - WordPress Compatible React Application
 * This is a simplified version that works within WordPress environment
 */

// WordPress-compatible React app initialization
(function() {
    console.log('Flux SEO: IIFE entered.');
    console.log('Flux SEO: Checking React availability (before CDN check):', typeof React);
    console.log('Flux SEO: Checking ReactDOM availability (before CDN check):', typeof ReactDOM);
    'use strict';
    
    // Check if React is available
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
        console.log('Flux SEO: React/ReactDOM not found. Attempting to load from CDN...');
        loadReactFromCDN();
        return;
    } else {
        console.log('Flux SEO: React and ReactDOM found. Initializing app...');
        initializeApp();
    }
    
    function loadReactFromCDN() {
        console.log('Flux SEO [loadReactFromCDN]: Entry point.');
        // Load React from CDN if not available
        const reactScript = document.createElement('script');
        reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
        reactScript.onload = function() {
            console.log('Flux SEO [loadReactFromCDN]: React loaded from CDN.');
            const reactDOMScript = document.createElement('script');
            reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
            reactDOMScript.onload = function() {
                console.log('Flux SEO [loadReactFromCDN]: ReactDOM loaded from CDN. Initializing app...');
                initializeApp();
            };
            document.head.appendChild(reactDOMScript);
        };
        document.head.appendChild(reactScript);
        console.log('Flux SEO [loadReactFromCDN]: Exit point.');
    }
    
    function initializeApp() {
        console.log('Flux SEO [initializeApp]: Entry point.');
        console.log('Flux SEO [initializeApp]: document.readyState:', document.readyState);
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            console.log('Flux SEO [initializeApp]: DOM is loading, adding DOMContentLoaded listener.');
            document.addEventListener('DOMContentLoaded', mountApp);
        } else {
            console.log('Flux SEO [initializeApp]: DOM already loaded, calling mountApp directly.');
            mountApp();
        }
        
        // Also listen for custom initialization event
        window.addEventListener('fluxSeoInit', function(event) {
            console.log('Flux SEO [initializeApp]: Custom fluxSeoInit event triggered.', event.detail);
            mountApp();
        });
        console.log('Flux SEO [initializeApp]: Exit point. Event listeners set up.');
    }
    
    function mountApp() {
        console.log('Flux SEO [mountApp]: Entry point.');
        const rootElement = document.getElementById('root');

        if (!rootElement) {
            console.error('Flux SEO [mountApp]: Root element with ID "root" not found. App cannot mount.');
            return;
        }
        console.log('Flux SEO [mountApp]: Found root element:', rootElement);
        
        // Check if already mounted
        if (rootElement.dataset.fluxSeoMounted === 'true') {
            console.warn('Flux SEO [mountApp]: App already detected as mounted on this root element. Skipping.');
            return;
        }
        
        console.log('Flux SEO [mountApp]: Attempting to mount React application...');
        
        try {
            if (typeof ReactDOM.createRoot === 'function') {
                // React 18+
                console.log('Flux SEO [mountApp]: Using React 18+ createRoot API.');
                const root = ReactDOM.createRoot(rootElement);
                root.render(React.createElement(FluxSEOApp));
            } else if (typeof ReactDOM.render === 'function') {
                // React 17 fallback
                console.log('Flux SEO [mountApp]: Using React 17 ReactDOM.render API.');
                ReactDOM.render(React.createElement(FluxSEOApp), rootElement);
            } else {
                console.error('Flux SEO [mountApp]: Neither ReactDOM.createRoot nor ReactDOM.render are available. Cannot mount app.');
                showErrorState(rootElement, 'React mounting functions not found.');
                return;
            }
            
            rootElement.dataset.fluxSeoMounted = 'true';
            console.log('Flux SEO [mountApp]: App mounted successfully on element:', rootElement);
            
        } catch (error) {
            console.error('Flux SEO [mountApp]: Error during React mounting:', error);
            showErrorState(rootElement, error.message);
        }
        console.log('Flux SEO [mountApp]: Exit point.');
    }
    
    function showErrorState(container, errorMessage = 'React mounting failed') {
        if (!container) return;
        container.innerHTML = `
            <div class="flux-seo-error">
                <h3>⚠️ Application Error</h3>
                <p>There was an error loading the SEO application.</p>
                <p><strong>Error Details:</strong> ${errorMessage}</p>
                <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #0073aa; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Refresh Page
                </button>
            </div>
        `;
    }
    
    // Main React Application Component
    function FluxSEOApp() {
        const [message, setMessage] = React.useState("Loading simple app...");

        React.useEffect(() => {
            setMessage("Minimal React App is working in WordPress!");
        }, []);

        return React.createElement('div', {
            style: {
                padding: '20px',
                border: '2px solid #0073aa',
                borderRadius: '5px',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif',
                backgroundColor: '#f0f0f0',
                color: '#333'
            }
        }, [
            React.createElement('h2', { key: 'title', style: { color: '#0073aa' } }, 'Simplified Flux SEO Scribe Craft'),
            React.createElement('p', { key: 'message', style: { fontSize: '18px' } }, message),
            React.createElement('p', { key: 'info', style: { fontSize: '14px', color: '#555' } }, 'If you see this, the basic React rendering is functional.')
        ]);
    }
    
})();