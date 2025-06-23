
// Complete WordPress React Application
(function() {
    'use strict';
    
    // Global namespace for the app
    window.FluxSEOApp = window.FluxSEOApp || {};
    
    // Check if React is available
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
        console.error('Flux SEO: React or ReactDOM not found. Loading from CDN...');
        
        const loadReact = () => {
            return new Promise((resolve, reject) => {
                if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
                    resolve();
                    return;
                }
                
                const reactScript = document.createElement('script');
                reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
                reactScript.onload = () => {
                    const reactDOMScript = document.createElement('script');
                    reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
                    reactDOMScript.onload = resolve;
                    reactDOMScript.onerror = reject;
                    document.head.appendChild(reactDOMScript);
                };
                reactScript.onerror = reject;
                document.head.appendChild(reactScript);
            });
        };
        
        loadReact().then(() => {
            console.log('✅ React loaded successfully from CDN');
            initializeApp();
        }).catch((error) => {
            console.error('❌ Failed to load React:', error);
        });
    } else {
        initializeApp();
    }
    
    function initializeApp() {
        // Main SEO Dashboard Component
        const SEODashboard = () => {
            const [activeTab, setActiveTab] = React.useState('analyzer');
            const [isLoading, setIsLoading] = React.useState(true);
            const [generatedContent, setGeneratedContent] = React.useState(null);
            const [formData, setFormData] = React.useState({
                topic: '',
                keywords: '',
                tone: 'professional',
                wordCount: 'medium',
                language: 'en'
            });
            const [isGenerating, setIsGenerating] = React.useState(false);
            const [error, setError] = React.useState(null);
            
            React.useEffect(() => {
                const timer = setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
                
                return () => clearTimeout(timer);
            }, []);

            const handleContentGeneration = async () => {
                if (!formData.topic.trim()) {
                    setError('Please enter a topic');
                    return;
                }

                setIsGenerating(true);
                setError(null);

                try {
                    const formDataToSend = new FormData();
                    formDataToSend.append('action', 'flux_seo_proxy');
                    formDataToSend.append('flux_action', 'generate_content');
                    formDataToSend.append('data', JSON.stringify(formData));
                    formDataToSend.append('nonce', fluxSeoData.nonce);

                    const response = await fetch(fluxSeoData.ajaxurl, {
                        method: 'POST',
                        body: formDataToSend
                    });

                    const result = await response.json();
                    
                    if (result.success) {
                        setGeneratedContent(result.data);
                        setActiveTab('generator'); // Switch to generator tab to show results
                    } else {
                        setError('Failed to generate content: ' + (result.data || 'Unknown error'));
                    }
                } catch (error) {
                    console.error('Error generating content:', error);
                    setError('Network error occurred while generating content');
                } finally {
                    setIsGenerating(false);
                }
            };
            
            if (isLoading) {
                return React.createElement('div', {
                    className: 'flux-seo-loading-screen'
                }, React.createElement('div', {
                    className: 'flux-seo-loading-content'
                }, [
                    React.createElement('div', {
                        key: 'spinner',
                        className: 'flux-seo-loading-spinner'
                    }),
                    React.createElement('h3', { key: 'title' }, '🚀 Loading Flux SEO Scribe Craft'),
                    React.createElement('p', { key: 'desc' }, 'Initializing professional SEO optimization suite...')
                ]));
            }
            
            return React.createElement(window.FluxSEOComponents.LanguageProvider, null,
                React.createElement('div', {
                    className: 'flux-seo-dashboard'
                }, [
                    React.createElement('header', {
                        key: 'header',
                        className: 'flux-seo-header'
                    }, [
                        React.createElement('h1', { key: 'title' }, '🚀 Flux SEO Scribe Craft'),
                        React.createElement('p', { key: 'subtitle' }, 'Professional SEO Optimization Suite')
                    ]),
                    
                    React.createElement('nav', {
                        key: 'nav',
                        className: 'flux-seo-nav'
                    }, [
                        React.createElement('button', {
                            key: 'analyzer',
                            className: `flux-seo-tab ${activeTab === 'analyzer' ? 'active' : ''}`,
                            onClick: () => setActiveTab('analyzer')
                        }, '📊 Content Analyzer'),
                        React.createElement('button', {
                            key: 'generator',
                            className: `flux-seo-tab ${activeTab === 'generator' ? 'active' : ''}`,
                            onClick: () => setActiveTab('generator')
                        }, '✍️ Content Generator'),
                        React.createElement('button', {
                            key: 'analytics',
                            className: `flux-seo-tab ${activeTab === 'analytics' ? 'active' : ''}`,
                            onClick: () => setActiveTab('analytics')
                        }, '📈 Analytics Dashboard'),
                        React.createElement('button', {
                            key: 'manual',
                            className: `flux-seo-tab ${activeTab === 'manual' ? 'active' : ''}`,
                            onClick: () => setActiveTab('manual')
                        }, '📖 Manual Intelligence')
                    ]),
                    
                    React.createElement('main', {
                        key: 'main',
                        className: 'flux-seo-content'
                    }, getTabContent(activeTab, {
                        formData,
                        setFormData,
                        onGenerate: handleContentGeneration,
                        isGenerating,
                        error,
                        generatedContent
                    }))
                ])
            );
        };
        
        const getTabContent = (tab, props) => {
            switch (tab) {
                case 'analyzer':
                    return React.createElement(window.FluxSEOComponents.ContentAnalyzer);
                case 'generator':
                    return React.createElement(ContentGeneratorTab, props);
                case 'analytics':
                    return React.createElement(window.FluxSEOComponents.AnalyticsOverview);
                case 'manual':
                    return React.createElement(ManualIntelligence);
                default:
                    return React.createElement(window.FluxSEOComponents.ContentAnalyzer);
            }
        };

        // Content Generator Tab Component
        const ContentGeneratorTab = ({ formData, setFormData, onGenerate, isGenerating, error, generatedContent }) => {
            return React.createElement('div', {
                className: 'flux-seo-content-generator'
            }, [
                React.createElement(window.FluxSEOComponents.ContentGenerationForm, {
                    key: 'form',
                    formData,
                    setFormData,
                    onGenerate,
                    isGenerating,
                    error
                }),

                generatedContent && React.createElement('div', {
                    key: 'generated-content',
                    className: 'flux-seo-generated-content'
                }, [
                    React.createElement('div', {
                        key: 'header',
                        className: 'flux-seo-content-header'
                    }, [
                        React.createElement('h3', { key: 'title' }, '📝 Generated Content'),
                        React.createElement('div', {
                            key: 'actions',
                            className: 'flux-seo-content-actions'
                        }, [
                            React.createElement('button', {
                                key: 'copy',
                                className: 'flux-seo-button secondary',
                                onClick: () => {
                                    navigator.clipboard.writeText(generatedContent.content || generatedContent.title);
                                }
                            }, '📋 Copy'),
                            React.createElement('button', {
                                key: 'save',
                                className: 'flux-seo-button primary',
                                onClick: () => {
                                    // Save to WordPress posts
                                    console.log('Saving content to WordPress...');
                                }
                            }, '💾 Save as Draft')
                        ])
                    ]),
                    React.createElement('div', {
                        key: 'content-body',
                        className: 'flux-seo-content-body'
                    }, [
                        generatedContent.title && React.createElement('h4', { key: 'title' }, generatedContent.title),
                        React.createElement('div', {
                            key: 'content',
                            dangerouslySetInnerHTML: { 
                                __html: (generatedContent.content || '').replace(/\n/g, '<br>')
                            }
                        }),
                        generatedContent.meta_description && React.createElement('div', {
                            key: 'meta',
                            className: 'meta-description'
                        }, [
                            React.createElement('strong', { key: 'label' }, 'Meta Description: '),
                            generatedContent.meta_description
                        ]),
                        generatedContent.keywords && React.createElement('div', {
                            key: 'keywords',
                            className: 'keywords'
                        }, [
                            React.createElement('strong', { key: 'label' }, 'Keywords: '),
                            Array.isArray(generatedContent.keywords) ? 
                                generatedContent.keywords.join(', ') : 
                                generatedContent.keywords
                        ])
                    ])
                ])
            ]);
        };

        // Manual Intelligence Component
        const ManualIntelligence = () => {
            const { language } = React.useContext(window.FluxSEOComponents.LanguageContext);
            
            const t = (enText, thText) => {
                return language === 'th' ? thText : enText;
            };

            return React.createElement('div', {
                className: 'flux-seo-manual-intelligence'
            }, [
                React.createElement('h2', { key: 'title' }, [
                    React.createElement('span', { key: 'icon' }, '📖 '),
                    t('Manual Intelligence', 'คู่มือการใช้งาน')
                ]),

                React.createElement('div', {
                    key: 'guide-sections',
                    className: 'flux-seo-guide-sections'
                }, [
                    React.createElement('div', {
                        key: 'getting-started',
                        className: 'flux-seo-guide-section'
                    }, [
                        React.createElement('h3', { key: 'title' }, 
                            t('Getting Started', 'เริ่มต้นใช้งาน')),
                        React.createElement('ul', { key: 'list' }, [
                            React.createElement('li', { key: '1' }, 
                                t('Configure your Gemini API key in WordPress settings', 
                                  'ตั้งค่า Gemini API key ในการตั้งค่า WordPress')),
                            React.createElement('li', { key: '2' }, 
                                t('Choose your content type and target audience', 
                                  'เลือกประเภทเนื้อหาและกลุ่มเป้าหมาย')),
                            React.createElement('li', { key: '3' }, 
                                t('Enter your topic and relevant keywords', 
                                  'กรอกหัวข้อและคีย์เวิร์ดที่เกี่ยวข้อง')),
                            React.createElement('li', { key: '4' }, 
                                t('Generate and review your content', 
                                  'สร้างและตรวจสอบเนื้อหาของคุณ'))
                        ])
                    ]),

                    React.createElement('div', {
                        key: 'features',
                        className: 'flux-seo-guide-section'
                    }, [
                        React.createElement('h3', { key: 'title' }, 
                            t('Key Features', 'ฟีเจอร์หลัก')),
                        React.createElement('ul', { key: 'list' }, [
                            React.createElement('li', { key: '1' }, 
                                t('AI-powered content generation with Gemini AI', 
                                  'การสร้างเนื้อหาด้วย AI จาก Gemini AI')),
                            React.createElement('li', { key: '2' }, 
                                t('Real-time SEO analysis and scoring', 
                                  'การวิเคราะห์และให้คะแนน SEO แบบเรียลไทม์')),
                            React.createElement('li', { key: '3' }, 
                                t('Multi-language support (English & Thai)', 
                                  'รองรับหลายภาษา (อังกฤษและไทย)')),
                            React.createElement('li', { key: '4' }, 
                                t('Analytics dashboard with performance insights', 
                                  'แดชบอร์ดวิเคราะห์พร้อมข้อมูลเชิงลึก')),
                            React.createElement('li', { key: '5' }, 
                                t('Direct integration with WordPress posts', 
                                  'การเชื่อมต่อโดยตรงกับโพสต์ WordPress'))
                        ])
                    ]),

                    React.createElement('div', {
                        key: 'tips',
                        className: 'flux-seo-guide-section'
                    }, [
                        React.createElement('h3', { key: 'title' }, 
                            t('Best Practices', 'แนวทางปฏิบัติที่ดี')),
                        React.createElement('ul', { key: 'list' }, [
                            React.createElement('li', { key: '1' }, 
                                t('Use specific, descriptive topics for better results', 
                                  'ใช้หัวข้อที่เฉพาะเจาะจงและชัดเจนเพื่อผลลัพธ์ที่ดีขึ้น')),
                            React.createElement('li', { key: '2' }, 
                                t('Include 3-5 relevant keywords per content piece', 
                                  'รวมคีย์เวิร์ดที่เกี่ยวข้อง 3-5 คำต่อเนื้อหา')),
                            React.createElement('li', { key: '3' }, 
                                t('Choose appropriate tone based on your audience', 
                                  'เลือกโทนเสียงที่เหมาะสมตามกลุ่มเป้าหมาย')),
                            React.createElement('li', { key: '4' }, 
                                t('Review and edit generated content before publishing', 
                                  'ตรวจสอบและแก้ไขเนื้อหาที่สร้างก่อนเผยแพร่')),
                            React.createElement('li', { key: '5' }, 
                                t('Monitor performance through the analytics dashboard', 
                                  'ติดตามประสิทธิภาพผ่านแดชบอร์ดวิเคราะห์'))
                        ])
                    ])
                ])
            ]);
        };

        // Initialize function
        window.FluxSEOApp.init = function(containerId) {
            console.log('🎯 Initializing Flux SEO App in container:', containerId);
            
            const container = document.getElementById(containerId);
            if (!container) {
                console.error('❌ Container not found:', containerId);
                return;
            }
            
            // Clear loading content
            container.innerHTML = '';
            
            // Create React root and render the app
            try {
                if (ReactDOM.createRoot) {
                    // React 18
                    const root = ReactDOM.createRoot(container);
                    root.render(React.createElement(SEODashboard));
                } else {
                    // React 17 fallback
                    ReactDOM.render(React.createElement(SEODashboard), container);
                }
                console.log('✅ Flux SEO App initialized successfully');
            } catch (error) {
                console.error('❌ Error initializing app:', error);
                container.innerHTML = '<div class="flux-seo-error">Failed to initialize the application. Please refresh the page.</div>';
            }
        };
    }
    
    console.log('🚀 Flux SEO Complete WordPress App loaded');
})();
