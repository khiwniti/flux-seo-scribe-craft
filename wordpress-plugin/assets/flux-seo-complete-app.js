
(function() {
    'use strict';
    
    // Global namespace
    window.FluxSEOApp = window.FluxSEOApp || {};
    
    // Load React if not available
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
        const loadReact = () => {
            return new Promise((resolve, reject) => {
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
        
        loadReact().then(initializeApp).catch(console.error);
    } else {
        initializeApp();
    }
    
    function initializeApp() {
        const { createElement: h, useState, useEffect, useContext, createContext } = React;
        
        // Language Context
        const LanguageContext = createContext({ language: 'en', setLanguage: () => {} });
        
        const LanguageProvider = ({ children }) => {
            const [language, setLanguage] = useState('en');
            return h(LanguageContext.Provider, { value: { language, setLanguage } }, children);
        };
        
        // Main Dashboard Component
        const SEODashboard = ({ defaultTab = 'analyzer' }) => {
            const [activeTab, setActiveTab] = useState(defaultTab);
            const [isLoading, setIsLoading] = useState(true);
            const { language } = useContext(LanguageContext);
            
            useEffect(() => {
                setTimeout(() => setIsLoading(false), 1500);
            }, []);
            
            const t = (enText, thText) => language === 'th' ? thText : enText;
            
            const tabs = [
                { id: 'analyzer', label: t('Content Analyzer', 'เครื่องมือวิเคราะห์'), icon: '🔍' },
                { id: 'generator', label: t('Content Generator', 'เครื่องมือสร้างเนื้อหา'), icon: '✍️' },
                { id: 'analytics', label: t('Analytics', 'การวิเคราะห์'), icon: '📊' },
                { id: 'keywords', label: t('Keywords', 'คีย์เวิร์ด'), icon: '🎯' },
                { id: 'meta', label: t('Meta Tags', 'เมตาแท็ก'), icon: '🌐' },
                { id: 'schema', label: t('Schema', 'สกีมา'), icon: '📋' },
                { id: 'technical', label: t('Technical SEO', 'SEO เชิงเทคนิค'), icon: '⚙️' },
                { id: 'chatbot', label: t('AI Chatbot', 'AI แชทบอท'), icon: '🤖' }
            ];
            
            if (isLoading) {
                return h('div', { className: 'flux-seo-loading' }, [
                    h('div', { key: 'spinner', className: 'flux-seo-spinner' }),
                    h('h3', { key: 'title' }, '🚀 Loading Flux SEO Scribe Craft'),
                    h('p', { key: 'desc' }, t('Initializing AI-powered SEO suite...', 'กำลังเริ่มต้นระบบ SEO ที่ขับเคลื่อนด้วย AI...'))
                ]);
            }
            
            return h('div', { className: 'flux-seo-dashboard' }, [
                // Header
                h('div', { key: 'header', className: 'flux-seo-header' }, [
                    h('div', { key: 'title-section', className: 'flux-seo-title-section' }, [
                        h('h1', { key: 'title' }, [
                            h('span', { key: 'icon' }, '🚀 '),
                            'Flux SEO Scribe Craft'
                        ]),
                        h('p', { key: 'subtitle' }, t(
                            'Professional AI-powered SEO optimization suite with comprehensive analysis tools',
                            'ชุดเครื่องมือ SEO ที่ขับเคลื่อนด้วย AI พร้อมเครื่องมือวิเคราะห์ครบวงจร'
                        ))
                    ]),
                    h(LanguageSwitcher, { key: 'lang-switcher' })
                ]),
                
                // Navigation Tabs
                h('nav', { key: 'nav', className: 'flux-seo-nav' }, 
                    tabs.map(tab => 
                        h('button', {
                            key: tab.id,
                            className: `flux-seo-tab ${activeTab === tab.id ? 'active' : ''}`,
                            onClick: () => setActiveTab(tab.id)
                        }, `${tab.icon} ${tab.label}`)
                    )
                ),
                
                // Content Area
                h('main', { key: 'content', className: 'flux-seo-content' }, 
                    getTabContent(activeTab)
                )
            ]);
        };
        
        // Language Switcher Component
        const LanguageSwitcher = () => {
            const { language, setLanguage } = useContext(LanguageContext);
            
            return h('div', { className: 'flux-seo-language-switcher' }, [
                h('button', {
                    key: 'en',
                    className: `lang-btn ${language === 'en' ? 'active' : ''}`,
                    onClick: () => setLanguage('en')
                }, 'EN'),
                h('button', {
                    key: 'th',
                    className: `lang-btn ${language === 'th' ? 'active' : ''}`,
                    onClick: () => setLanguage('th')
                }, 'ไทย')
            ]);
        };
        
        // Content Analyzer Component
        const ContentAnalyzer = () => {
            const [content, setContent] = useState('');
            const [keywords, setKeywords] = useState('');
            const [analysis, setAnalysis] = useState(null);
            const [isAnalyzing, setIsAnalyzing] = useState(false);
            const { language } = useContext(LanguageContext);
            
            const t = (enText, thText) => language === 'th' ? thText : enText;
            
            const analyzeContent = async () => {
                if (!content.trim()) return;
                
                setIsAnalyzing(true);
                try {
                    const response = await fetch(fluxSeoData.rest_url + 'flux-seo/v1/analyze-content', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-WP-Nonce': fluxSeoData.nonce
                        },
                        body: JSON.stringify({ content, keywords })
                    });
                    
                    const result = await response.json();
                    setAnalysis(result);
                } catch (error) {
                    console.error('Analysis error:', error);
                } finally {
                    setIsAnalyzing(false);
                }
            };
            
            return h('div', { className: 'flux-seo-analyzer' }, [
                h('div', { key: 'form', className: 'analyzer-form' }, [
                    h('h2', { key: 'title' }, t('Content Analysis', 'การวิเคราะห์เนื้อหา')),
                    h('div', { key: 'content-input', className: 'form-group' }, [
                        h('label', { key: 'label' }, t('Content to Analyze:', 'เนื้อหาที่ต้องการวิเคราะห์:')),
                        h('textarea', {
                            key: 'textarea',
                            value: content,
                            onChange: (e) => setContent(e.target.value),
                            placeholder: t('Paste your content here...', 'วางเนื้อหาของคุณที่นี่...'),
                            rows: 10,
                            className: 'content-textarea'
                        })
                    ]),
                    h('div', { key: 'keywords-input', className: 'form-group' }, [
                        h('label', { key: 'label' }, t('Target Keywords:', 'คีย์เวิร์ดเป้าหมาย:')),
                        h('input', {
                            key: 'input',
                            type: 'text',
                            value: keywords,
                            onChange: (e) => setKeywords(e.target.value),
                            placeholder: t('Enter keywords...', 'กรอกคีย์เวิร์ด...')
                        })
                    ]),
                    h('button', {
                        key: 'analyze-btn',
                        onClick: analyzeContent,
                        disabled: isAnalyzing || !content.trim(),
                        className: 'analyze-button'
                    }, isAnalyzing ? t('Analyzing...', 'กำลังวิเคราะห์...') : t('Analyze Content', 'วิเคราะห์เนื้อหา'))
                ]),
                
                analysis && h('div', { key: 'results', className: 'analysis-results' }, [
                    h('h3', { key: 'title' }, t('Analysis Results', 'ผลการวิเคราะห์')),
                    h('div', { key: 'metrics', className: 'metrics-grid' }, [
                        h('div', { key: 'seo-score', className: 'metric-card' }, [
                            h('div', { key: 'score', className: 'metric-score' }, analysis.seo_score),
                            h('div', { key: 'label', className: 'metric-label' }, t('SEO Score', 'คะแนน SEO'))
                        ]),
                        h('div', { key: 'readability', className: 'metric-card' }, [
                            h('div', { key: 'score', className: 'metric-score' }, analysis.readability_score),
                            h('div', { key: 'label', className: 'metric-label' }, t('Readability', 'ความอ่านง่าย'))
                        ]),
                        h('div', { key: 'word-count', className: 'metric-card' }, [
                            h('div', { key: 'score', className: 'metric-score' }, analysis.word_count),
                            h('div', { key: 'label', className: 'metric-label' }, t('Words', 'คำ'))
                        ]),
                        h('div', { key: 'keyword-density', className: 'metric-card' }, [
                            h('div', { key: 'score', className: 'metric-score' }, analysis.keyword_density + '%'),
                            h('div', { key: 'label', className: 'metric-label' }, t('Keyword Density', 'ความหนาแน่นคีย์เวิร์ด'))
                        ])
                    ]),
                    h('div', { key: 'suggestions', className: 'suggestions' }, [
                        h('h4', { key: 'title' }, t('Suggestions', 'คำแนะนำ')),
                        h('ul', { key: 'list' }, 
                            analysis.suggestions.map((suggestion, index) =>
                                h('li', { key: index }, suggestion)
                            )
                        )
                    ])
                ])
            ]);
        };
        
        // Content Generator Component
        const ContentGenerator = () => {
            const [formData, setFormData] = useState({
                topic: '',
                keywords: '',
                tone: 'professional',
                wordCount: 'medium',
                contentType: 'blog'
            });
            const [generatedContent, setGeneratedContent] = useState(null);
            const [isGenerating, setIsGenerating] = useState(false);
            const [error, setError] = useState(null);
            const { language } = useContext(LanguageContext);
            
            const t = (enText, thText) => language === 'th' ? thText : enText;
            
            const generateContent = async () => {
                if (!formData.topic.trim()) {
                    setError(t('Please enter a topic', 'กรุณาใส่หัวข้อ'));
                    return;
                }
                
                setIsGenerating(true);
                setError(null);
                
                try {
                    const prompt = `Create a ${formData.contentType} about "${formData.topic}" with a ${formData.tone} tone. Target keywords: ${formData.keywords}. Word count: ${formData.wordCount}. Language: ${language}`;
                    
                    const response = await fetch(fluxSeoData.rest_url + 'flux-seo/v1/gemini-proxy', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-WP-Nonce': fluxSeoData.nonce
                        },
                        body: JSON.stringify({
                            model: 'gemini-pro',
                            prompt: prompt,
                            generationConfig: {
                                temperature: 0.7,
                                maxOutputTokens: 2048
                            }
                        })
                    });
                    
                    const result = await response.json();
                    
                    if (result.candidates && result.candidates[0]) {
                        const content = result.candidates[0].content.parts[0].text;
                        setGeneratedContent({
                            content: content,
                            title: formData.topic,
                            meta_description: content.substring(0, 160) + '...'
                        });
                    } else {
                        throw new Error('No content generated');
                    }
                } catch (error) {
                    console.error('Generation error:', error);
                    setError(t('Failed to generate content. Please check your API key.', 'ไม่สามารถสร้างเนื้อหาได้ กรุณาตรวจสอบ API Key'));
                } finally {
                    setIsGenerating(false);
                }
            };
            
            const saveContent = async () => {
                if (!generatedContent) return;
                
                try {
                    const response = await fetch(fluxSeoData.rest_url + 'flux-seo/v1/save-content', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-WP-Nonce': flux SeoData.nonce
                        },
                        body: JSON.stringify(generatedContent)
                    });
                    
                    const result = await response.json();
                    if (result.success) {
                        alert(t('Content saved as draft!', 'บันทึกเนื้อหาเป็นแบบร่างแล้ว!'));
                    }
                } catch (error) {
                    console.error('Save error:', error);
                }
            };
            
            return h('div', { className: 'flux-seo-generator' }, [
                h('div', { key: 'form', className: 'generator-form' }, [
                    h('h2', { key: 'title' }, t('AI Content Generator', 'เครื่องมือสร้างเนื้อหา AI')),
                    
                    error && h('div', { key: 'error', className: 'error-message' }, error),
                    
                    h('div', { key: 'topic-input', className: 'form-group' }, [
                        h('label', { key: 'label' }, t('Topic:', 'หัวข้อ:')),
                        h('input', {
                            key: 'input',
                            type: 'text',
                            value: formData.topic,
                            onChange: (e) => setFormData({...formData, topic: e.target.value}),
                            placeholder: t('Enter your topic...', 'กรอกหัวข้อของคุณ...')
                        })
                    ]),
                    
                    h('div', { key: 'keywords-input', className: 'form-group' }, [
                        h('label', { key: 'label' }, t('Keywords:', 'คีย์เวิร์ด:')),
                        h('input', {
                            key: 'input',
                            type: 'text',
                            value: formData.keywords,
                            onChange: (e) => setFormData({...formData, keywords: e.target.value}),
                            placeholder: t('Enter keywords...', 'กรอกคีย์เวิร์ด...')
                        })
                    ]),
                    
                    h('div', { key: 'tone-select', className: 'form-group' }, [
                        h('label', { key: 'label' }, t('Tone:', 'โทนเสียง:')),
                        h('select', {
                            key: 'select',
                            value: formData.tone,
                            onChange: (e) => setFormData({...formData, tone: e.target.value})
                        }, [
                            h('option', { key: 'professional', value: 'professional' }, t('Professional', 'มืออาชีพ')),
                            h('option', { key: 'casual', value: 'casual' }, t('Casual', 'สบายๆ')),
                            h('option', { key: 'friendly', value: 'friendly' }, t('Friendly', 'เป็นมิตร')),
                            h('option', { key: 'academic', value: 'academic' }, t('Academic', 'วิชาการ'))
                        ])
                    ]),
                    
                    h('div', { key: 'content-type', className: 'form-group' }, [
                        h('label', { key: 'label' }, t('Content Type:', 'ประเภทเนื้อหา:')),
                        h('select', {
                            key: 'select',
                            value: formData.contentType,
                            onChange: (e) => setFormData({...formData, contentType: e.target.value})
                        }, [
                            h('option', { key: 'blog', value: 'blog' }, t('Blog Post', 'บล็อกโพสต์')),
                            h('option', { key: 'article', value: 'article' }, t('Article', 'บทความ')),
                            h('option', { key: 'guide', value: 'guide' }, t('Guide', 'คู่มือ')),
                            h('option', { key: 'review', value: 'review' }, t('Review', 'รีวิว'))
                        ])
                    ]),
                    
                    h('button', {
                        key: 'generate-btn',
                        onClick: generateContent,
                        disabled: isGenerating || !formData.topic.trim(),
                        className: 'generate-button'
                    }, isGenerating ? t('Generating...', 'กำลังสร้าง...') : t('Generate Content', 'สร้างเนื้อหา'))
                ]),
                
                generatedContent && h('div', { key: 'generated', className: 'generated-content' }, [
                    h('div', { key: 'header', className: 'content-header' }, [
                        h('h3', { key: 'title' }, t('Generated Content', 'เนื้อหาที่สร้างขึ้น')),
                        h('div', { key: 'actions', className: 'content-actions' }, [
                            h('button', {
                                key: 'copy',
                                onClick: () => navigator.clipboard.writeText(generatedContent.content),
                                className: 'action-button'
                            }, t('Copy', 'คัดลอก')),
                            h('button', {
                                key: 'save',
                                onClick: saveContent,
                                className: 'action-button primary'
                            }, t('Save as Draft', 'บันทึกเป็นแบบร่าง'))
                        ])
                    ]),
                    h('div', { key: 'content', className: 'content-display' }, 
                        generatedContent.content.split('\n').map((paragraph, index) =>
                            h('p', { key: index }, paragraph)
                        )
                    )
                ])
            ]);
        };
        
        // Analytics Dashboard Component
        const AnalyticsDashboard = () => {
            const { language } = useContext(LanguageContext);
            const t = (enText, thText) => language === 'th' ? thText : enText;
            
            const mockData = {
                totalPosts: 156,
                avgSeoScore: 78,
                topKeywords: ['SEO', 'Content Marketing', 'WordPress', 'AI', 'Digital Marketing'],
                recentActivity: [
                    { action: 'Content Generated', time: '2 hours ago', score: 85 },
                    { action: 'SEO Analysis', time: '4 hours ago', score: 92 },
                    { action: 'Meta Tags Updated', time: '1 day ago', score: 78 }
                ]
            };
            
            return h('div', { className: 'flux-seo-analytics' }, [
                h('h2', { key: 'title' }, t('SEO Analytics Dashboard', 'แดชบอร์ดการวิเคราะห์ SEO')),
                
                h('div', { key: 'stats', className: 'stats-grid' }, [
                    h('div', { key: 'posts', className: 'stat-card' }, [
                        h('div', { key: 'number', className: 'stat-number' }, mockData.totalPosts),
                        h('div', { key: 'label', className: 'stat-label' }, t('Total Posts', 'โพสต์ทั้งหมด'))
                    ]),
                    h('div', { key: 'seo', className: 'stat-card' }, [
                        h('div', { key: 'number', className: 'stat-number' }, mockData.avgSeoScore),
                        h('div', { key: 'label', className: 'stat-label' }, t('Avg SEO Score', 'คะแนน SEO เฉลี่ย'))
                    ]),
                    h('div', { key: 'keywords', className: 'stat-card' }, [
                        h('div', { key: 'number', className: 'stat-number' }, mockData.topKeywords.length),
                        h('div', { key: 'label', className: 'stat-label' }, t('Top Keywords', 'คีย์เวิร์ดยอดนิยม'))
                    ])
                ]),
                
                h('div', { key: 'sections', className: 'analytics-sections' }, [
                    h('div', { key: 'keywords-section', className: 'analytics-section' }, [
                        h('h3', { key: 'title' }, t('Top Keywords', 'คีย์เวิร์ดยอดนิยม')),
                        h('div', { key: 'keywords', className: 'keywords-list' },
                            mockData.topKeywords.map((keyword, index) =>
                                h('span', { key: index, className: 'keyword-tag' }, keyword)
                            )
                        )
                    ]),
                    
                    h('div', { key: 'activity-section', className: 'analytics-section' }, [
                        h('h3', { key: 'title' }, t('Recent Activity', 'กิจกรรมล่าสุด')),
                        h('div', { key: 'activities', className: 'activities-list' },
                            mockData.recentActivity.map((activity, index) =>
                                h('div', { key: index, className: 'activity-item' }, [
                                    h('div', { key: 'action', className: 'activity-action' }, activity.action),
                                    h('div', { key: 'time', className: 'activity-time' }, activity.time),
                                    h('div', { key: 'score', className: 'activity-score' }, `Score: ${activity.score}`)
                                ])
                            )
                        )
                    ])
                ])
            ]);
        };
        
        // Simple placeholder components for other tabs
        const KeywordResearch = () => {
            const { language } = useContext(LanguageContext);
            const t = (enText, thText) => language === 'th' ? thText : enText;
            
            return h('div', { className: 'flux-seo-keywords' }, [
                h('h2', { key: 'title' }, t('Keyword Research', 'การวิจัยคีย์เวิร์ด')),
                h('p', { key: 'desc' }, t('Advanced keyword research tools coming soon...', 'เครื่องมือวิจัยคีย์เวิร์ดขั้นสูงเร็วๆ นี้...'))
            ]);
        };
        
        const MetaTagsManager = () => {
            const { language } = useContext(LanguageContext);
            const t = (enText, thText) => language === 'th' ? thText : enText;
            
            return h('div', { className: 'flux-seo-meta' }, [
                h('h2', { key: 'title' }, t('Meta Tags Manager', 'จัดการเมตาแท็ก')),
                h('p', { key: 'desc' }, t('Meta tags optimization tools coming soon...', 'เครื่องมือปรับแต่งเมตาแท็กเร็วๆ นี้...'))
            ]);
        };
        
        const SchemaMarkup = () => {
            const { language } = useContext(LanguageContext);
            const t = (enText, thText) => language === 'th' ? thText : enText;
            
            return h('div', { className: 'flux-seo-schema' }, [
                h('h2', { key: 'title' }, t('Schema Markup Generator', 'เครื่องมือสร้าง Schema Markup')),
                h('p', { key: 'desc' }, t('Schema markup generation tools coming soon...', 'เครื่องมือสร้าง Schema markup เร็วๆ นี้...'))
            ]);
        };
        
        const TechnicalSEO = () => {
            const { language } = useContext(LanguageContext);
            const t = (enText, thText) => language === 'th' ? thText : enText;
            
            return h('div', { className: 'flux-seo-technical' }, [
                h('h2', { key: 'title' }, t('Technical SEO Audit', 'ตรวจสอบ SEO เชิงเทคนิค')),
                h('p', { key: 'desc' }, t('Technical SEO audit tools coming soon...', 'เครื่องมือตรวจสอบ SEO เชิงเทคนิคเร็วๆ นี้...'))
            ]);
        };
        
        const AIChat bot = () => {
            const { language } = useContext(LanguageContext);
            const t = (enText, thText) => language === 'th' ? thText : enText;
            
            return h('div', { className: 'flux-seo-chatbot' }, [
                h('h2', { key: 'title' }, t('AI SEO Chatbot', 'AI SEO แชทบอท')),
                h('p', { key: 'desc' }, t('AI-powered SEO assistant coming soon...', 'ผู้ช่วย SEO ที่ขับเคลื่อนด้วย AI เร็วๆ นี้...'))
            ]);
        };
        
        // Tab content router
        function getTabContent(activeTab) {
            switch (activeTab) {
                case 'analyzer': return h(ContentAnalyzer);
                case 'generator': return h(ContentGenerator);
                case 'analytics': return h(AnalyticsDashboard);
                case 'keywords': return h(KeywordResearch);
                case 'meta': return h(MetaTagsManager);
                case 'schema': return h(SchemaMarkup);
                case 'technical': return h(TechnicalSEO);
                case 'chatbot': return h(AIChatbot);
                default: return h(ContentAnalyzer);
            }
        }
        
        // Initialize functions
        window.FluxSEOApp.init = function(containerId, options = {}) {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error('Container not found:', containerId);
                return;
            }
            
            const root = ReactDOM.createRoot ? ReactDOM.createRoot(container) : null;
            const app = h(LanguageProvider, null, h(SEODashboard, options));
            
            if (root) {
                root.render(app);
            } else {
                ReactDOM.render(app, container);
            }
        };
        
        window.FluxSEOApp.initDashboard = function(containerId) {
            window.FluxSEOApp.init(containerId, { defaultTab: 'analyzer' });
        };
        
        console.log('✅ Flux SEO App initialized successfully');
    }
})();
