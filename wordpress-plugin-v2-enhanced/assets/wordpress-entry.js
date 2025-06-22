
// WordPress-specific React application entry point
(function() {
    'use strict';
    
    // Global namespace for the app
    window.FluxSEOApp = window.FluxSEOApp || {};
    
    // WordPress compatibility layer
    const WordPressAPI = {
        async request(endpoint, options = {}) {
            const url = `${window.fluxSeoData?.apiUrl || '/wp-json/flux-seo/v1/'}${endpoint}`;
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.fluxSeoData?.nonce || '',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            return response.json();
        },
        
        async generateContent(params) {
            return this.request('generate-content', {
                method: 'POST',
                body: JSON.stringify(params)
            });
        },
        
        async analyzeContent(params) {
            return this.request('analyze-content', {
                method: 'POST',
                body: JSON.stringify(params)
            });
        },
        
        async saveContent(params) {
            return this.request('save-content', {
                method: 'POST',
                body: JSON.stringify(params)
            });
        },
        
        async getHistory(params = {}) {
            const queryString = new URLSearchParams(params).toString();
            return this.request(`generation-history${queryString ? '?' + queryString : ''}`);
        }
    };
    
    // Enhanced Content Generator Component
    const ContentGenerator = () => {
        const [formData, setFormData] = React.useState({
            topic: '',
            keywords: '',
            tone: 'professional',
            wordCount: 'medium',
            contentType: 'blog',
            targetAudience: 'general',
            language: window.fluxSeoData?.language || 'en'
        });
        
        const [generatedContent, setGeneratedContent] = React.useState('');
        const [analysis, setAnalysis] = React.useState(null);
        const [isGenerating, setIsGenerating] = React.useState(false);
        const [isAnalyzing, setIsAnalyzing] = React.useState(false);
        const [error, setError] = React.useState(null);
        const [savedPosts, setSavedPosts] = React.useState([]);
        
        const updateFormData = (field, value) => {
            setFormData(prev => ({ ...prev, [field]: value }));
        };
        
        const generateContent = async () => {
            if (!formData.topic.trim()) {
                setError('Please enter a topic to generate content.');
                return;
            }
            
            setIsGenerating(true);
            setError(null);
            
            try {
                const response = await WordPressAPI.generateContent(formData);
                if (response.success) {
                    setGeneratedContent(response.content);
                    // Auto-analyze generated content
                    analyzeContent(response.content);
                } else {
                    setError('Failed to generate content. Please try again.');
                }
            } catch (err) {
                console.error('Content generation error:', err);
                setError(err.message || 'An error occurred while generating content.');
            } finally {
                setIsGenerating(false);
            }
        };
        
        const analyzeContent = async (content = generatedContent) => {
            if (!content.trim()) {
                setError('No content to analyze.');
                return;
            }
            
            setIsAnalyzing(true);
            
            try {
                const response = await WordPressAPI.analyzeContent({
                    content: content,
                    language: formData.language,
                    keywords: formData.keywords
                });
                
                if (response.success) {
                    setAnalysis(response.analysis);
                }
            } catch (err) {
                console.error('Content analysis error:', err);
            } finally {
                setIsAnalyzing(false);
            }
        };
        
        const saveContentAsPost = async () => {
            if (!generatedContent.trim()) {
                setError('No content to save.');
                return;
            }
            
            try {
                const response = await WordPressAPI.saveContent({
                    title: formData.topic,
                    content: generatedContent,
                    metaDescription: `Professional content about ${formData.topic}`,
                    keywords: formData.keywords.split(',').map(k => k.trim()),
                    language: formData.language
                });
                
                if (response.success) {
                    setSavedPosts(prev => [...prev, {
                        id: response.post_id,
                        title: formData.topic,
                        editUrl: response.edit_url
                    }]);
                    alert('Content saved as draft post successfully!');
                }
            } catch (err) {
                console.error('Save content error:', err);
                setError('Failed to save content as post.');
            }
        };
        
        const copyToClipboard = () => {
            navigator.clipboard.writeText(generatedContent).then(() => {
                alert('Content copied to clipboard!');
            });
        };
        
        return React.createElement('div', {
            className: 'flux-seo-content-generator'
        }, [
            // Header
            React.createElement('div', {
                key: 'header',
                className: 'flux-seo-header'
            }, [
                React.createElement('h2', { key: 'title' }, '🤖 AI Content Generator'),
                React.createElement('p', { key: 'desc' }, 'Generate professional, SEO-optimized content with AI')
            ]),
            
            // Error Display
            error && React.createElement('div', {
                key: 'error',
                className: 'flux-seo-error'
            }, [
                React.createElement('strong', { key: 'label' }, '❌ Error: '),
                error
            ]),
            
            // Form
            React.createElement('div', {
                key: 'form',
                className: 'flux-seo-form'
            }, [
                React.createElement('div', {
                    key: 'topic-group',
                    className: 'flux-seo-form-group'
                }, [
                    React.createElement('label', { key: 'label' }, 'Topic *'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        value: formData.topic,
                        onChange: (e) => updateFormData('topic', e.target.value),
                        placeholder: 'Enter your content topic...',
                        className: 'flux-seo-input'
                    })
                ]),
                
                React.createElement('div', {
                    key: 'keywords-group',
                    className: 'flux-seo-form-group'
                }, [
                    React.createElement('label', { key: 'label' }, 'Keywords'),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        value: formData.keywords,
                        onChange: (e) => updateFormData('keywords', e.target.value),
                        placeholder: 'Enter keywords separated by commas...',
                        className: 'flux-seo-input'
                    })
                ]),
                
                React.createElement('div', {
                    key: 'options-row',
                    className: 'flux-seo-form-row'
                }, [
                    React.createElement('div', {
                        key: 'tone-group',
                        className: 'flux-seo-form-group'
                    }, [
                        React.createElement('label', { key: 'label' }, 'Tone'),
                        React.createElement('select', {
                            key: 'select',
                            value: formData.tone,
                            onChange: (e) => updateFormData('tone', e.target.value),
                            className: 'flux-seo-select'
                        }, [
                            React.createElement('option', { key: 'professional', value: 'professional' }, 'Professional'),
                            React.createElement('option', { key: 'casual', value: 'casual' }, 'Casual'),
                            React.createElement('option', { key: 'authoritative', value: 'authoritative' }, 'Authoritative'),
                            React.createElement('option', { key: 'conversational', value: 'conversational' }, 'Conversational')
                        ])
                    ]),
                    
                    React.createElement('div', {
                        key: 'length-group',
                        className: 'flux-seo-form-group'
                    }, [
                        React.createElement('label', { key: 'label' }, 'Length'),
                        React.createElement('select', {
                            key: 'select',
                            value: formData.wordCount,
                            onChange: (e) => updateFormData('wordCount', e.target.value),
                            className: 'flux-seo-select'
                        }, [
                            React.createElement('option', { key: 'short', value: 'short' }, 'Short (500-800 words)'),
                            React.createElement('option', { key: 'medium', value: 'medium' }, 'Medium (1000-1500 words)'),
                            React.createElement('option', { key: 'long', value: 'long' }, 'Long (2000-3000 words)')
                        ])
                    ]),
                    
                    React.createElement('div', {
                        key: 'type-group',
                        className: 'flux-seo-form-group'
                    }, [
                        React.createElement('label', { key: 'label' }, 'Content Type'),
                        React.createElement('select', {
                            key: 'select',
                            value: formData.contentType,
                            onChange: (e) => updateFormData('contentType', e.target.value),
                            className: 'flux-seo-select'
                        }, [
                            React.createElement('option', { key: 'blog', value: 'blog' }, 'Blog Post'),
                            React.createElement('option', { key: 'article', value: 'article' }, 'Article'),
                            React.createElement('option', { key: 'guide', value: 'guide' }, 'How-to Guide'),
                            React.createElement('option', { key: 'review', value: 'review' }, 'Product Review'),
                            React.createElement('option', { key: 'news', value: 'news' }, 'News Article')
                        ])
                    ])
                ]),
                
                React.createElement('button', {
                    key: 'generate-btn',
                    onClick: generateContent,
                    disabled: isGenerating || !formData.topic.trim(),
                    className: 'flux-seo-button primary'
                }, isGenerating ? '🔄 Generating...' : '🚀 Generate Content')
            ]),
            
            // Generated Content Display
            generatedContent && React.createElement('div', {
                key: 'content',
                className: 'flux-seo-generated-content'
            }, [
                React.createElement('div', {
                    key: 'content-header',
                    className: 'flux-seo-content-header'
                }, [
                    React.createElement('h3', { key: 'title' }, '📝 Generated Content'),
                    React.createElement('div', {
                        key: 'actions',
                        className: 'flux-seo-content-actions'
                    }, [
                        React.createElement('button', {
                            key: 'copy',
                            onClick: copyToClipboard,
                            className: 'flux-seo-button secondary'
                        }, '📋 Copy'),
                        React.createElement('button', {
                            key: 'save',
                            onClick: saveContentAsPost,
                            className: 'flux-seo-button secondary'
                        }, '💾 Save as Post'),
                        React.createElement('button', {
                            key: 'analyze',
                            onClick: () => analyzeContent(),
                            disabled: isAnalyzing,
                            className: 'flux-seo-button secondary'
                        }, isAnalyzing ? '🔄 Analyzing...' : '🔍 Analyze')
                    ])
                ]),
                
                React.createElement('div', {
                    key: 'content-body',
                    className: 'flux-seo-content-body',
                    dangerouslySetInnerHTML: { __html: generatedContent.replace(/\n/g, '<br>') }
                })
            ]),
            
            // Analysis Results
            analysis && React.createElement('div', {
                key: 'analysis',
                className: 'flux-seo-analysis'
            }, [
                React.createElement('h3', { key: 'title' }, '📊 Content Analysis'),
                React.createElement('div', {
                    key: 'metrics',
                    className: 'flux-seo-metrics'
                }, [
                    React.createElement('div', {
                        key: 'word-count',
                        className: 'flux-seo-metric'
                    }, [
                        React.createElement('span', { key: 'label' }, 'Word Count'),
                        React.createElement('span', { key: 'value' }, analysis.wordCount)
                    ]),
                    React.createElement('div', {
                        key: 'seo-score',
                        className: 'flux-seo-metric'
                    }, [
                        React.createElement('span', { key: 'label' }, 'SEO Score'),
                        React.createElement('span', { 
                            key: 'value',
                            className: 'flux-seo-score'
                        }, analysis.seoScore + '/100')
                    ]),
                    React.createElement('div', {
                        key: 'readability',
                        className: 'flux-seo-metric'
                    }, [
                        React.createElement('span', { key: 'label' }, 'Readability'),
                        React.createElement('span', { key: 'value' }, analysis.readabilityScore + '/100')
                    ]),
                    React.createElement('div', {
                        key: 'keyword-density',
                        className: 'flux-seo-metric'
                    }, [
                        React.createElement('span', { key: 'label' }, 'Keyword Density'),
                        React.createElement('span', { key: 'value' }, analysis.keywordDensity + '%')
                    ])
                ]),
                
                analysis.suggestions.length > 0 && React.createElement('div', {
                    key: 'suggestions',
                    className: 'flux-seo-suggestions'
                }, [
                    React.createElement('h4', { key: 'title' }, '💡 Improvement Suggestions'),
                    React.createElement('ul', { key: 'list' },
                        analysis.suggestions.map((suggestion, index) =>
                            React.createElement('li', { key: index }, suggestion)
                        )
                    )
                ])
            ]),
            
            // Saved Posts
            savedPosts.length > 0 && React.createElement('div', {
                key: 'saved-posts',
                className: 'flux-seo-saved-posts'
            }, [
                React.createElement('h3', { key: 'title' }, '📚 Saved Posts'),
                React.createElement('ul', { key: 'list' },
                    savedPosts.map((post, index) =>
                        React.createElement('li', { key: index }, [
                            React.createElement('span', { key: 'title' }, post.title),
                            React.createElement('a', {
                                key: 'edit',
                                href: post.editUrl,
                                target: '_blank',
                                className: 'flux-seo-edit-link'
                            }, 'Edit Post →')
                        ])
                    )
                )
            ])
        ]);
    };
    
    // Main Dashboard Component
    const SEODashboard = () => {
        const [activeTab, setActiveTab] = React.useState('generator');
        
        return React.createElement('div', {
            className: 'flux-seo-dashboard'
        }, [
            React.createElement('header', {
                key: 'header',
                className: 'flux-seo-header'
            }, [
                React.createElement('h1', { key: 'title' }, '🚀 Flux SEO Scribe Craft'),
                React.createElement('p', { key: 'subtitle' }, 'Professional AI-Powered SEO Content Suite')
            ]),
            
            React.createElement('nav', {
                key: 'nav',
                className: 'flux-seo-nav'
            }, [
                React.createElement('button', {
                    key: 'generator',
                    className: `flux-seo-tab ${activeTab === 'generator' ? 'active' : ''}`,
                    onClick: () => setActiveTab('generator')
                }, '✍️ Content Generator'),
                React.createElement('button', {
                    key: 'analyzer',
                    className: `flux-seo-tab ${activeTab === 'analyzer' ? 'active' : ''}`,
                    onClick: () => setActiveTab('analyzer')
                }, '📊 Content Analyzer'),
                React.createElement('button', {
                    key: 'history',
                    className: `flux-seo-tab ${activeTab === 'history' ? 'active' : ''}`,
                    onClick: () => setActiveTab('history')
                }, '📚 Generation History')
            ]),
            
            React.createElement('main', {
                key: 'main',
                className: 'flux-seo-content'
            }, getTabContent(activeTab))
        ]);
    };
    
    const getTabContent = (tab) => {
        switch (tab) {
            case 'generator':
                return React.createElement(ContentGenerator);
            case 'analyzer':
                return React.createElement(ContentAnalyzer);
            case 'history':
                return React.createElement(GenerationHistory);
            default:
                return React.createElement(ContentGenerator);
        }
    };
    
    // Content Analyzer Component (simplified version)
    const ContentAnalyzer = () => {
        const [content, setContent] = React.useState('');
        const [analysis, setAnalysis] = React.useState(null);
        const [isAnalyzing, setIsAnalyzing] = React.useState(false);
        
        const analyzeContent = async () => {
            if (!content.trim()) return;
            
            setIsAnalyzing(true);
            
            try {
                const response = await WordPressAPI.analyzeContent({
                    content: content,
                    language: window.fluxSeoData?.language || 'en',
                    keywords: ''
                });
                
                if (response.success) {
                    setAnalysis(response.analysis);
                }
            } catch (err) {
                console.error('Analysis error:', err);
            } finally {
                setIsAnalyzing(false);
            }
        };
        
        return React.createElement('div', {
            className: 'flux-seo-analyzer'
        }, [
            React.createElement('h2', { key: 'title' }, '📊 Content Analyzer'),
            React.createElement('textarea', {
                key: 'textarea',
                placeholder: 'Paste your content here for SEO analysis...',
                value: content,
                onChange: (e) => setContent(e.target.value),
                className: 'flux-seo-textarea'
            }),
            React.createElement('button', {
                key: 'analyze-btn',
                onClick: analyzeContent,
                disabled: isAnalyzing || !content.trim(),
                className: 'flux-seo-button primary'
            }, isAnalyzing ? '🔄 Analyzing...' : '🔍 Analyze Content'),
            
            analysis && React.createElement('div', {
                key: 'results',
                className: 'flux-seo-analysis-results'
            }, [
                React.createElement('h3', { key: 'title' }, '📈 Analysis Results'),
                React.createElement('div', {
                    key: 'metrics',
                    className: 'flux-seo-metrics'
                }, [
                    React.createElement('div', { key: 'words' }, `Words: ${analysis.wordCount}`),
                    React.createElement('div', { key: 'seo' }, `SEO Score: ${analysis.seoScore}/100`),
                    React.createElement('div', { key: 'readability' }, `Readability: ${analysis.readabilityScore}/100`)
                ])
            ])
        ]);
    };
    
    // Generation History Component
    const GenerationHistory = () => {
        const [history, setHistory] = React.useState([]);
        const [loading, setLoading] = React.useState(true);
        
        React.useEffect(() => {
            const loadHistory = async () => {
                try {
                    const response = await WordPressAPI.getHistory({ limit: 20 });
                    if (response.success) {
                        setHistory(response.history);
                    }
                } catch (err) {
                    console.error('Failed to load history:', err);
                } finally {
                    setLoading(false);
                }
            };
            
            loadHistory();
        }, []);
        
        if (loading) {
            return React.createElement('div', {
                className: 'flux-seo-loading'
            }, 'Loading generation history...');
        }
        
        return React.createElement('div', {
            className: 'flux-seo-history'
        }, [
            React.createElement('h2', { key: 'title' }, '📚 Generation History'),
            history.length === 0 
                ? React.createElement('p', { key: 'empty' }, 'No generation history found.')
                : React.createElement('div', {
                    key: 'list',
                    className: 'flux-seo-history-list'
                }, history.map((item, index) =>
                    React.createElement('div', {
                        key: index,
                        className: 'flux-seo-history-item'
                    }, [
                        React.createElement('h4', { key: 'topic' }, item.topic),
                        React.createElement('p', { key: 'details' }, [
                            `${item.word_count} words • `,
                            `SEO Score: ${item.seo_score}/100 • `,
                            `${item.language.toUpperCase()} • `,
                            new Date(item.generated_date).toLocaleDateString()
                        ])
                    ])
                ))
        ]);
    };
    
    // Initialize function
    window.FluxSEOApp.init = function(containerId) {
        console.log('🎯 Initializing Enhanced Flux SEO App in container:', containerId);
        
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
            console.log('✅ Enhanced Flux SEO App initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing app:', error);
            container.innerHTML = '<div class="flux-seo-error">Failed to initialize the application. Please refresh the page.</div>';
        }
    };
    
    console.log('🚀 Enhanced Flux SEO WordPress App loaded');
})();
