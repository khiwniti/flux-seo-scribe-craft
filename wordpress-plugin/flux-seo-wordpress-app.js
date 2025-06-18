/**
 * Flux SEO Scribe Craft - WordPress Compatible React Application
 * This is a simplified version that works within WordPress environment
 */

// WordPress-compatible React app initialization
(function() {
    'use strict';
    
    // Check if React is available
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
        console.log('Flux SEO: Loading React from CDN...');
        loadReactFromCDN();
        return;
    }
    
    initializeApp();
    
    function loadReactFromCDN() {
        // Load React from CDN if not available
        const reactScript = document.createElement('script');
        reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
        reactScript.onload = function() {
            const reactDOMScript = document.createElement('script');
            reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
            reactDOMScript.onload = initializeApp;
            document.head.appendChild(reactDOMScript);
        };
        document.head.appendChild(reactScript);
    }
    
    function initializeApp() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', mountApp);
        } else {
            mountApp();
        }
        
        // Also listen for custom initialization event
        window.addEventListener('fluxSeoInit', function(event) {
            console.log('Flux SEO: Custom initialization triggered', event.detail);
            mountApp();
        });
    }
    
    function mountApp() {
        const rootElement = document.getElementById('root');
        if (!rootElement) {
            console.log('Flux SEO: Root element not found');
            return;
        }
        
        // Check if already mounted
        if (rootElement.dataset.fluxSeoMounted === 'true') {
            console.log('Flux SEO: App already mounted');
            return;
        }
        
        console.log('Flux SEO: Mounting React application...');
        
        try {
            // Create React root and render app
            const root = ReactDOM.createRoot ? ReactDOM.createRoot(rootElement) : null;
            
            if (root) {
                // React 18+
                root.render(React.createElement(FluxSEOApp));
            } else {
                // React 17 fallback
                ReactDOM.render(React.createElement(FluxSEOApp), rootElement);
            }
            
            rootElement.dataset.fluxSeoMounted = 'true';
            console.log('Flux SEO: App mounted successfully');
            
        } catch (error) {
            console.error('Flux SEO: Error mounting app:', error);
            showErrorState(rootElement);
        }
    }
    
    function showErrorState(container) {
        container.innerHTML = `
            <div class="flux-seo-error">
                <h3>⚠️ Application Error</h3>
                <p>There was an error loading the SEO application.</p>
                <p><strong>Error Details:</strong> React mounting failed</p>
                <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #0073aa; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Refresh Page
                </button>
            </div>
        `;
    }
    
    // Main React Application Component
    function FluxSEOApp() {
        const [activeTab, setActiveTab] = React.useState('analyzer');
        const [isLoading, setIsLoading] = React.useState(true);
        
        React.useEffect(() => {
            // Simulate app initialization
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1500);
            
            return () => clearTimeout(timer);
        }, []);
        
        if (isLoading) {
            return React.createElement('div', {
                className: 'flux-seo-loading'
            }, React.createElement('div', {
                className: 'loading-content'
            }, [
                React.createElement('h3', { key: 'title' }, '🔄 Loading Flux SEO Scribe Craft...'),
                React.createElement('p', { key: 'subtitle' }, 'Initializing SEO optimization suite...')
            ]));
        }
        
        return React.createElement('div', {
            className: 'flux-seo-app',
            style: {
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
            }
        }, [
            // Header
            React.createElement('div', {
                key: 'header',
                style: {
                    padding: '20px',
                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                    textAlign: 'center'
                }
            }, [
                React.createElement('h1', {
                    key: 'title',
                    style: { margin: '0 0 10px 0', fontSize: '28px' }
                }, '🚀 Flux SEO Scribe Craft'),
                React.createElement('p', {
                    key: 'subtitle',
                    style: { margin: 0, opacity: 0.9, fontSize: '16px' }
                }, 'Professional SEO Optimization Suite')
            ]),
            
            // Navigation Tabs
            React.createElement('div', {
                key: 'nav',
                style: {
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '20px',
                    gap: '10px'
                }
            }, [
                createTabButton('analyzer', '🔍 Content Analyzer', activeTab, setActiveTab),
                createTabButton('generator', '✍️ Blog & Image Generator', activeTab, setActiveTab),
                createTabButton('analytics', '📊 Advanced Analytics', activeTab, setActiveTab)
            ]),
            
            // Content Area
            React.createElement('div', {
                key: 'content',
                style: {
                    padding: '20px',
                    flex: 1,
                    overflow: 'auto'
                }
            }, getTabContent(activeTab))
        ]);
    }
    
    function createTabButton(tabId, label, activeTab, setActiveTab) {
        return React.createElement('button', {
            key: tabId,
            onClick: () => setActiveTab(tabId),
            style: {
                padding: '12px 24px',
                border: 'none',
                borderRadius: '25px',
                background: activeTab === tabId ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tabId ? 'bold' : 'normal',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
            }
        }, label);
    }
    
    function getTabContent(activeTab) {
        const contentStyle = {
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '15px',
            padding: '30px',
            backdropFilter: 'blur(10px)',
            minHeight: '300px'
        };
        
        switch (activeTab) {
            case 'analyzer':
                return React.createElement('div', { style: contentStyle }, [
                    React.createElement('h2', { key: 'title', style: { marginTop: 0 } }, '🔍 Content Analyzer'),
                    React.createElement('p', { key: 'desc' }, 'Analyze your content for SEO optimization opportunities with real-time scoring and suggestions.'),
                    React.createElement('div', {
                        key: 'features',
                        style: { marginTop: '20px' }
                    }, [
                        createFeatureItem('✅ Keyword density analysis'),
                        createFeatureItem('✅ Readability scoring'),
                        createFeatureItem('✅ Meta tag optimization'),
                        createFeatureItem('✅ Content structure analysis'),
                        createFeatureItem('✅ SEO recommendations')
                    ]),
                    createActionButton('Start Analysis', '🔍')
                ]);
                
            case 'generator':
                return React.createElement('div', { style: contentStyle }, [
                    React.createElement('h2', { key: 'title', style: { marginTop: 0 } }, '✍️ Blog & Image Generator'),
                    React.createElement('p', { key: 'desc' }, 'Generate SEO-optimized blog posts and images using AI-powered tools.'),
                    React.createElement('div', {
                        key: 'features',
                        style: { marginTop: '20px' }
                    }, [
                        createFeatureItem('✅ AI-powered content generation'),
                        createFeatureItem('✅ SEO-optimized blog posts'),
                        createFeatureItem('✅ Custom image creation'),
                        createFeatureItem('✅ Keyword integration'),
                        createFeatureItem('✅ Content templates')
                    ]),
                    createActionButton('Generate Content', '✍️')
                ]);
                
            case 'analytics':
                return React.createElement('div', { style: contentStyle }, [
                    React.createElement('h2', { key: 'title', style: { marginTop: 0 } }, '📊 Advanced Analytics'),
                    React.createElement('p', { key: 'desc' }, 'Track and monitor your SEO performance with comprehensive reporting.'),
                    React.createElement('div', {
                        key: 'features',
                        style: { marginTop: '20px' }
                    }, [
                        createFeatureItem('✅ Performance tracking'),
                        createFeatureItem('✅ Keyword rankings'),
                        createFeatureItem('✅ Traffic analysis'),
                        createFeatureItem('✅ Competitor insights'),
                        createFeatureItem('✅ Custom reports')
                    ]),
                    createActionButton('View Analytics', '📊')
                ]);
                
            default:
                return React.createElement('div', { style: contentStyle }, 'Select a tab to get started');
        }
    }
    
    function createFeatureItem(text) {
        return React.createElement('div', {
            style: {
                padding: '8px 0',
                fontSize: '16px',
                opacity: 0.9
            }
        }, text);
    }
    
    function createActionButton(text, icon) {
        return React.createElement('button', {
            style: {
                marginTop: '30px',
                padding: '15px 30px',
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '30px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
            },
            onClick: function() {
                alert(`${text} feature will be available in the full version!\n\nThis is a demo of the WordPress plugin integration.`);
            },
            onMouseOver: function(e) {
                e.target.style.background = 'rgba(255,255,255,0.3)';
                e.target.style.transform = 'translateY(-2px)';
            },
            onMouseOut: function(e) {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.transform = 'translateY(0)';
            }
        }, `${icon} ${text}`);
    }
    
})();