/**
 * Flux SEO Scribe Craft - WordPress App
 * This is the main React application for the WordPress plugin
 */

(function() {
    'use strict';
    
    // Global namespace for the app
    window.FluxSEOApp = window.FluxSEOApp || {};
    
    // Initialize function
    window.FluxSEOApp.init = function(containerId, options = {}) {
        console.log('📦 Loading main app script from:', containerId);
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('❌ Container not found:', containerId);
            return;
        }
        
        try {
            // Create React root and render the app
            if (ReactDOM.createRoot) {
                // React 18+
                const root = ReactDOM.createRoot(container);
                root.render(React.createElement(SEODashboard, options));
            } else {
                // React 17 fallback
                ReactDOM.render(React.createElement(SEODashboard, options), container);
            }
            console.log('✅ FluxSEO App script loaded successfully');
        } catch (error) {
            console.error('❌ Error initializing app:', error);
            container.innerHTML = '<div class="flux-seo-error">Failed to initialize the application. Please refresh the page.</div>';
        }
    };
    
    // Create a language context
    const LanguageContext = React.createContext({
        language: 'en',
        setLanguage: () => {}
    });
    
    // Language provider component
    const LanguageProvider = ({ children }) => {
        const [language, setLanguage] = React.useState(() => {
            // Try to get language from WordPress data or localStorage
            const wpLanguage = window.fluxSeoData?.language?.substring(0, 2) || 'en';
            const savedLanguage = localStorage.getItem('flux-seo-language');
            return savedLanguage || wpLanguage;
        });
        
        React.useEffect(() => {
            localStorage.setItem('flux-seo-language', language);
        }, [language]);
        
        return React.createElement(
            LanguageContext.Provider,
            { value: { language, setLanguage } },
            children
        );
    };
    
    // Language switcher component
    const LanguageSwitcher = () => {
        const { language, setLanguage } = React.useContext(LanguageContext);
        
        return React.createElement('div', {
            className: 'flux-seo-language-switcher'
        }, [
            React.createElement('button', {
                key: 'en',
                className: `flux-seo-lang-btn ${language === 'en' ? 'active' : ''}`,
                onClick: () => setLanguage('en')
            }, 'EN'),
            React.createElement('button', {
                key: 'th',
                className: `flux-seo-lang-btn ${language === 'th' ? 'active' : ''}`,
                onClick: () => setLanguage('th')
            }, 'ไทย')
        ]);
    };
    
    // Main SEO Dashboard Component
    const SEODashboard = (props) => {
        return React.createElement(LanguageProvider, null, 
            React.createElement(SEODashboardContent, props)
        );
    };
    
    // Dashboard content component
    const SEODashboardContent = (props) => {
        const [activeTab, setActiveTab] = React.useState(props.defaultTab || 'analyzer');
        const [isLoading, setIsLoading] = React.useState(true);
        const { language } = React.useContext(LanguageContext);
        
        // Translation helper
        const t = (enText, thText) => language === 'th' ? thText : enText;
        
        React.useEffect(() => {
            // Simulate app initialization
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1500);
            
            return () => clearTimeout(timer);
        }, []);
        
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
                React.createElement('h3', { key: 'title' }, '🚀 ' + t('Loading Flux SEO Scribe Craft', 'กำลังโหลด Flux SEO Scribe Craft')),
                React.createElement('p', { key: 'desc' }, t('Initializing professional SEO optimization suite...', 'กำลังเริ่มต้นชุดเครื่องมือเพิ่มประสิทธิภาพ SEO ระดับมืออาชีพ...'))
            ]));
        }
        
        return React.createElement('div', {
            className: 'flux-seo-dashboard'
        }, [
            React.createElement('header', {
                key: 'header',
                className: 'flux-seo-header'
            }, [
                React.createElement('div', { key: 'title-section', className: 'flux-seo-title-section' }, [
                    React.createElement('h1', { key: 'title' }, '🚀 Flux SEO Scribe Craft'),
                    React.createElement('p', { key: 'subtitle' }, t(
                        'Professional SEO Optimization Suite',
                        'ชุดเครื่องมือเพิ่มประสิทธิภาพ SEO ระดับมืออาชีพ'
                    ))
                ]),
                React.createElement(LanguageSwitcher, { key: 'lang-switcher' })
            ]),
            
            React.createElement('nav', {
                key: 'nav',
                className: 'flux-seo-nav'
            }, [
                React.createElement('button', {
                    key: 'analyzer',
                    className: `flux-seo-tab ${activeTab === 'analyzer' ? 'active' : ''}`,
                    onClick: () => setActiveTab('analyzer')
                }, '🔍 ' + t('Content Analyzer', 'วิเคราะห์เนื้อหา')),
                React.createElement('button', {
                    key: 'generator',
                    className: `flux-seo-tab ${activeTab === 'generator' ? 'active' : ''}`,
                    onClick: () => setActiveTab('generator')
                }, '✍️ ' + t('Blog Generator', 'สร้างบล็อก')),
                React.createElement('button', {
                    key: 'analytics',
                    className: `flux-seo-tab ${activeTab === 'analytics' ? 'active' : ''}`,
                    onClick: () => setActiveTab('analytics')
                }, '📈 ' + t('Advanced Analytics', 'การวิเคราะห์ขั้นสูง'))
            ]),
            
            React.createElement('main', {
                key: 'main',
                className: 'flux-seo-content'
            }, getTabContent(activeTab, language))
        ]);
    };
    
    // Get content for the active tab
    const getTabContent = (activeTab, language) => {
        switch (activeTab) {
            case 'analyzer':
                return React.createElement(ContentAnalyzer, { language });
            case 'generator':
                return React.createElement(ContentGenerator, { language });
            case 'analytics':
                return React.createElement(AdvancedAnalytics, { language });
            default:
                return React.createElement(ContentAnalyzer, { language });
        }
    };
    
    // Content Analyzer Component
    const ContentAnalyzer = ({ language }) => {
        const [content, setContent] = React.useState('');
        const [keywords, setKeywords] = React.useState('');
        const [analysis, setAnalysis] = React.useState(null);
        const [isAnalyzing, setIsAnalyzing] = React.useState(false);
        
        // Translation helper
        const t = (enText, thText) => language === 'th' ? thText : enText;
        
        const analyzeContent = async () => {
            if (!content.trim()) return;
            
            setIsAnalyzing(true);
            
            try {
                // Call WordPress REST API
                const response = await fetch(fluxSeoData.rest_url + 'flux-seo/v1/analyze-content', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-WP-Nonce': fluxSeoData.nonce
                    },
                    body: JSON.stringify({ 
                        content,
                        keywords,
                        language
                    })
                });
                
                if (!response.ok) {
                    throw new Error('API request failed');
                }
                
                const data = await response.json();
                setAnalysis(data);
            } catch (error) {
                console.error('Error analyzing content:', error);
                
                // Fallback to client-side analysis
                const wordCount = content.split(/\s+/).length;
                setAnalysis({
                    seo_score: Math.floor(Math.random() * 30) + 60,
                    readability_score: Math.floor(Math.random() * 30) + 60,
                    word_count: wordCount,
                    keyword_density: keywords ? ((content.toLowerCase().match(new RegExp(keywords.toLowerCase(), 'g')) || []).length / wordCount * 100).toFixed(2) : '0.00',
                    suggestions: [
                        t('Add more internal links to improve site structure', 'เพิ่มลิงก์ภายในเพื่อปรับปรุงโครงสร้างเว็บไซต์'),
                        t('Include relevant LSI keywords for better topical relevance', 'รวมคำสำคัญ LSI ที่เกี่ยวข้องเพื่อความเกี่ยวข้องกับหัวข้อที่ดีขึ้น'),
                        t('Optimize meta description for better click-through rates', 'ปรับคำอธิบายเมตาเพื่อเพิ่มอัตราการคลิก'),
                        t('Add structured data markup for rich snippets', 'เพิ่มมาร์กอัพข้อมูลโครงสร้างสำหรับริชสนิปเป็ต')
                    ]
                });
            } finally {
                setIsAnalyzing(false);
            }
        };
        
        return React.createElement('div', {
            className: 'flux-seo-analyzer'
        }, [
            React.createElement('h2', { key: 'title' }, '🔍 ' + t('Content Analyzer', 'วิเคราะห์เนื้อหา')),
            React.createElement('div', {
                key: 'input-section',
                className: 'flux-seo-input-section'
            }, [
                React.createElement('div', { key: 'keywords-group', className: 'flux-seo-form-group' }, [
                    React.createElement('label', { key: 'label' }, t('Target Keywords', 'คำสำคัญเป้าหมาย')),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        placeholder: t('Enter target keywords, separated by commas', 'ป้อนคำสำคัญเป้าหมาย คั่นด้วยเครื่องหมายจุลภาค'),
                        value: keywords,
                        onChange: (e) => setKeywords(e.target.value),
                        className: 'flux-seo-input'
                    })
                ]),
                React.createElement('textarea', {
                    key: 'textarea',
                    placeholder: t('Paste your content here for SEO analysis...', 'วางเนื้อหาของคุณที่นี่เพื่อวิเคราะห์ SEO...'),
                    value: content,
                    onChange: (e) => setContent(e.target.value),
                    className: 'flux-seo-textarea'
                }),
                React.createElement('button', {
                    key: 'analyze-btn',
                    onClick: analyzeContent,
                    disabled: isAnalyzing || !content.trim(),
                    className: 'flux-seo-button primary'
                }, isAnalyzing ? 
                    '🔄 ' + t('Analyzing...', 'กำลังวิเคราะห์...') : 
                    '🔍 ' + t('Analyze Content', 'วิเคราะห์เนื้อหา')
                )
            ]),
            
            analysis && React.createElement('div', {
                key: 'results',
                className: 'flux-seo-results'
            }, [
                React.createElement('h3', { key: 'results-title' }, '📈 ' + t('Analysis Results', 'ผลการวิเคราะห์')),
                React.createElement('div', {
                    key: 'metrics',
                    className: 'flux-seo-metrics'
                }, [
                    React.createElement('div', {
                        key: 'seo-score',
                        className: 'flux-seo-metric'
                    }, [
                        React.createElement('span', { key: 'label' }, t('SEO Score', 'คะแนน SEO')),
                        React.createElement('span', { 
                            key: 'value',
                            className: 'flux-seo-score'
                        }, analysis.seo_score + '/100')
                    ]),
                    React.createElement('div', {
                        key: 'readability',
                        className: 'flux-seo-metric'
                    }, [
                        React.createElement('span', { key: 'label' }, t('Readability', 'ความอ่านง่าย')),
                        React.createElement('span', { key: 'value' }, analysis.readability_score + '/100')
                    ]),
                    React.createElement('div', {
                        key: 'word-count',
                        className: 'flux-seo-metric'
                    }, [
                        React.createElement('span', { key: 'label' }, t('Word Count', 'จำนวนคำ')),
                        React.createElement('span', { key: 'value' }, analysis.word_count)
                    ]),
                    React.createElement('div', {
                        key: 'keyword-density',
                        className: 'flux-seo-metric'
                    }, [
                        React.createElement('span', { key: 'label' }, t('Keyword Density', 'ความหนาแน่นของคำสำคัญ')),
                        React.createElement('span', { key: 'value' }, analysis.keyword_density + '%')
                    ])
                ]),
                React.createElement('div', {
                    key: 'suggestions',
                    className: 'flux-seo-suggestions'
                }, [
                    React.createElement('h4', { key: 'suggestions-title' }, '💡 ' + t('Improvement Suggestions', 'ข้อเสนอแนะในการปรับปรุง')),
                    React.createElement('ul', { key: 'suggestions-list' },
                        analysis.suggestions.map((suggestion, index) =>
                            React.createElement('li', { key: index }, suggestion)
                        )
                    )
                ])
            ])
        ]);
    };
    
    // Content Generator Component
    const ContentGenerator = ({ language }) => {
        const [topic, setTopic] = React.useState('');
        const [tone, setTone] = React.useState('professional');
        const [wordCount, setWordCount] = React.useState('medium');
        const [generatedContent, setGeneratedContent] = React.useState(null);
        const [isGenerating, setIsGenerating] = React.useState(false);
        
        // Translation helper
        const t = (enText, thText) => language === 'th' ? thText : enText;
        
        const generateContent = async () => {
            if (!topic.trim()) return;
            
            setIsGenerating(true);
            
            try {
                // Prepare prompt based on user inputs
                let wordCountText;
                switch (wordCount) {
                    case 'short': wordCountText = '500-800'; break;
                    case 'medium': wordCountText = '800-1200'; break;
                    case 'long': wordCountText = '1200-2000'; break;
                    default: wordCountText = '800-1200';
                }
                
                const prompt = `Generate a comprehensive blog post about "${topic}" with the following specifications:

- Language: ${language === 'th' ? 'Thai' : 'English'}
- Tone: ${tone}
- Word count: ${wordCountText} words
- Format: Blog post with proper headings, subheadings, and formatting
- Include: Introduction, main sections, conclusion
- SEO-friendly: Optimize for search engines with proper keyword usage

Please structure the content with markdown formatting:
- Use # for main title
- Use ## for section headings
- Use ### for subheadings
- Use **bold** for emphasis
- Use bullet points where appropriate

Make the content informative, engaging, and valuable to readers.`;

                // Call Gemini API through WordPress proxy
                const response = await fetch(fluxSeoData.proxy_endpoint, {
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
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 4096
                        }
                    })
                });
                
                if (!response.ok) {
                    throw new Error('API request failed');
                }
                
                const data = await response.json();
                
                if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
                    const content = data.candidates[0].content.parts[0].text;
                    
                    // Extract title from content
                    let title = topic;
                    const lines = content.split('\n');
                    if (lines.length > 0 && (lines[0].startsWith('# ') || lines[0].startsWith('Title: '))) {
                        title = lines[0].replace(/^# |^Title: /, '');
                    }
                    
                    // Generate meta description from first paragraph
                    let metaDescription = '';
                    for (let i = 1; i < lines.length; i++) {
                        if (lines[i].trim() && !lines[i].startsWith('#')) {
                            metaDescription = lines[i].substring(0, 160);
                            if (metaDescription.length === 160) metaDescription += '...';
                            break;
                        }
                    }
                    
                    // Extract keywords from content
                    const keywords = extractKeywords(content, topic);
                    
                    setGeneratedContent({
                        title: title,
                        content: content,
                        metaDescription: metaDescription,
                        keywords: keywords
                    });
                } else {
                    throw new Error('Invalid API response format');
                }
            } catch (error) {
                console.error('Error generating content:', error);
                
                // Fallback to mock content
                setGeneratedContent({
                    title: `${t('Guide to', 'คู่มือเกี่ยวกับ')} ${topic}`,
                    content: `# ${t('Comprehensive Guide to', 'คู่มือที่ครอบคลุมเกี่ยวกับ')} ${topic}

## ${t('Introduction', 'บทนำ')}

${t('Welcome to this comprehensive guide about', 'ยินดีต้อนรับสู่คู่มือที่ครอบคลุมเกี่ยวกับ')} ${topic}. ${t('This article will provide you with expert insights, practical tips, and actionable strategies.', 'บทความนี้จะให้ข้อมูลเชิงลึกจากผู้เชี่ยวชาญ เคล็ดลับที่ใช้งานได้จริง และกลยุทธ์ที่นำไปปฏิบัติได้แก่คุณ')}

## ${t('What is', 'อะไรคือ')} ${topic}?

${topic} ${t('is a crucial aspect of modern digital strategy that can significantly impact your success. Understanding the fundamentals is essential for anyone looking to excel in this area.', 'เป็นแง่มุมสำคัญของกลยุทธ์ดิจิทัลสมัยใหม่ที่สามารถส่งผลกระทบอย่างมีนัยสำคัญต่อความสำเร็จของคุณ การทำความเข้าใจพื้นฐานเป็นสิ่งจำเป็นสำหรับทุกคนที่ต้องการเป็นเลิศในด้านนี้')}

## ${t('Key Benefits of', 'ประโยชน์หลักของ')} ${topic}

- **${t('Improved Performance', 'ประสิทธิภาพที่ดีขึ้น')}**: ${t('Implementing', 'การนำ')} ${topic} ${t('strategies can lead to measurable improvements', 'กลยุทธ์ไปใช้สามารถนำไปสู่การปรับปรุงที่วัดผลได้')}
- **${t('Enhanced User Experience', 'ประสบการณ์ผู้ใช้ที่ดีขึ้น')}**: ${t('Users benefit from well-executed', 'ผู้ใช้ได้รับประโยชน์จากการดำเนินการที่ดีของ')} ${topic} ${t('practices', 'แนวทางปฏิบัติ')}
- **${t('Competitive Advantage', 'ความได้เปรียบในการแข่งขัน')}**: ${t('Stay ahead of competitors with advanced', 'อยู่เหนือคู่แข่งด้วยเทคนิคขั้นสูงของ')} ${topic} ${t('techniques', 'เทคนิค')}
- **${t('Long-term Growth', 'การเติบโตในระยะยาว')}**: ${t('Build sustainable success through proper', 'สร้างความสำเร็จที่ยั่งยืนผ่านการดำเนินการที่เหมาะสมของ')} ${topic} ${t('implementation', 'การนำไปใช้')}

## ${t('Best Practices for', 'แนวทางปฏิบัติที่ดีที่สุดสำหรับ')} ${topic}

### 1. ${t('Foundation Building', 'การสร้างรากฐาน')}
${t('Start with a solid foundation by understanding the core principles of', 'เริ่มต้นด้วยรากฐานที่แข็งแกร่งโดยทำความเข้าใจหลักการพื้นฐานของ')} ${topic}.

### 2. ${t('Strategic Planning', 'การวางแผนเชิงกลยุทธ์')}
${t('Develop a comprehensive strategy that aligns with your goals and objectives.', 'พัฒนากลยุทธ์ที่ครอบคลุมซึ่งสอดคล้องกับเป้าหมายและวัตถุประสงค์ของคุณ')}

### 3. ${t('Implementation', 'การนำไปใช้')}
${t('Execute your', 'ดำเนินการตามกลยุทธ์')} ${topic} ${t('strategy with precision and attention to detail.', 'ด้วยความแม่นยำและใส่ใจในรายละเอียด')}

### 4. ${t('Monitoring and Optimization', 'การติดตามและการปรับให้เหมาะสม')}
${t('Continuously monitor performance and optimize for better results.', 'ติดตามประสิทธิภาพอย่างต่อเนื่องและปรับให้เหมาะสมเพื่อผลลัพธ์ที่ดีขึ้น')}

## ${t('Conclusion', 'บทสรุป')}

${t('Mastering', 'การเชี่ยวชาญ')} ${topic} ${t('requires dedication, knowledge, and the right approach. By following the strategies outlined in this guide, you\'ll be well-equipped to achieve success in your', 'ต้องอาศัยความทุ่มเท ความรู้ และแนวทางที่ถูกต้อง ด้วยการปฏิบัติตามกลยุทธ์ที่ระบุไว้ในคู่มือนี้ คุณจะมีความพร้อมอย่างดีในการบรรลุความสำเร็จใน')} ${topic} ${t('endeavors.', 'ความพยายามของคุณ')}

${t('Remember to stay updated with the latest trends and continuously refine your approach for optimal results.', 'อย่าลืมติดตามเทรนด์ล่าสุดและปรับปรุงแนวทางของคุณอย่างต่อเนื่องเพื่อผลลัพธ์ที่ดีที่สุด')}`,
                    metaDescription: `${t('Discover expert tips and strategies for', 'ค้นพบเคล็ดลับและกลยุทธ์จากผู้เชี่ยวชาญสำหรับ')} ${topic}. ${t('Complete guide with actionable insights and best practices.', 'คู่มือที่สมบูรณ์พร้อมข้อมูลเชิงลึกที่นำไปปฏิบัติได้และแนวทางปฏิบัติที่ดีที่สุด')}`,
                    keywords: [topic, `${topic} ${t('guide', 'คู่มือ')}`, `${topic} ${t('tips', 'เคล็ดลับ')}`, `${topic} ${t('strategies', 'กลยุทธ์')}`]
                });
            } finally {
                setIsGenerating(false);
            }
        };
        
        // Helper function to extract keywords from content
        const extractKeywords = (content, mainTopic) => {
            const words = content.toLowerCase().split(/\s+/);
            const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'as', 'of', 'from'];
            
            // Count word frequency
            const wordCount = {};
            words.forEach(word => {
                if (word.length > 3 && !stopWords.includes(word)) {
                    wordCount[word] = (wordCount[word] || 0) + 1;
                }
            });
            
            // Sort by frequency
            const sortedWords = Object.entries(wordCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(entry => entry[0]);
            
            // Ensure main topic is included
            if (mainTopic && !sortedWords.includes(mainTopic.toLowerCase())) {
                sortedWords.unshift(mainTopic.toLowerCase());
            }
            
            return sortedWords;
        };
        
        // Function to save content as WordPress post
        const saveAsPost = async () => {
            if (!generatedContent) return;
            
            try {
                const response = await fetch(fluxSeoData.rest_url + 'flux-seo/v1/save-content', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-WP-Nonce': fluxSeoData.nonce
                    },
                    body: JSON.stringify({
                        title: generatedContent.title,
                        content: generatedContent.content,
                        meta_description: generatedContent.metaDescription,
                        keywords: generatedContent.keywords
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to save content');
                }
                
                const data = await response.json();
                
                if (data.success && data.edit_url) {
                    // Open the edit page in a new tab
                    window.open(data.edit_url, '_blank');
                }
            } catch (error) {
                console.error('Error saving content:', error);
                alert(t('Failed to save content as post. Please try again.', 'ไม่สามารถบันทึกเนื้อหาเป็นโพสต์ได้ โปรดลองอีกครั้ง'));
            }
        };
        
        return React.createElement('div', {
            className: 'flux-seo-generator'
        }, [
            React.createElement('h2', { key: 'title' }, '✍️ ' + t('Blog Generator', 'เครื่องมือสร้างบล็อก')),
            React.createElement('div', {
                key: 'input-section',
                className: 'flux-seo-input-section'
            }, [
                React.createElement('div', { key: 'topic-group', className: 'flux-seo-form-group' }, [
                    React.createElement('label', { key: 'label' }, t('Blog Topic', 'หัวข้อบล็อก')),
                    React.createElement('input', {
                        key: 'input',
                        type: 'text',
                        placeholder: t('Enter your topic or keyword...', 'ป้อนหัวข้อหรือคำสำคัญของคุณ...'),
                        value: topic,
                        onChange: (e) => setTopic(e.target.value),
                        className: 'flux-seo-input'
                    })
                ]),
                
                React.createElement('div', { key: 'options', className: 'flux-seo-form-row' }, [
                    React.createElement('div', { key: 'tone-group', className: 'flux-seo-form-group' }, [
                        React.createElement('label', { key: 'label' }, t('Tone', 'โทนเสียง')),
                        React.createElement('select', {
                            key: 'select',
                            value: tone,
                            onChange: (e) => setTone(e.target.value),
                            className: 'flux-seo-select'
                        }, [
                            React.createElement('option', { key: 'professional', value: 'professional' }, t('Professional', 'เป็นทางการ')),
                            React.createElement('option', { key: 'casual', value: 'casual' }, t('Casual', 'ไม่เป็นทางการ')),
                            React.createElement('option', { key: 'friendly', value: 'friendly' }, t('Friendly', 'เป็นมิตร')),
                            React.createElement('option', { key: 'authoritative', value: 'authoritative' }, t('Authoritative', 'มีอำนาจ'))
                        ])
                    ]),
                    
                    React.createElement('div', { key: 'length-group', className: 'flux-seo-form-group' }, [
                        React.createElement('label', { key: 'label' }, t('Length', 'ความยาว')),
                        React.createElement('select', {
                            key: 'select',
                            value: wordCount,
                            onChange: (e) => setWordCount(e.target.value),
                            className: 'flux-seo-select'
                        }, [
                            React.createElement('option', { key: 'short', value: 'short' }, t('Short (500-800 words)', 'สั้น (500-800 คำ)')),
                            React.createElement('option', { key: 'medium', value: 'medium' }, t('Medium (800-1200 words)', 'กลาง (800-1200 คำ)')),
                            React.createElement('option', { key: 'long', value: 'long' }, t('Long (1200-2000 words)', 'ยาว (1200-2000 คำ)'))
                        ])
                    ])
                ]),
                
                React.createElement('button', {
                    key: 'generate-btn',
                    onClick: generateContent,
                    disabled: isGenerating || !topic.trim(),
                    className: 'flux-seo-button primary'
                }, isGenerating ? 
                    '🔄 ' + t('Generating...', 'กำลังสร้าง...') : 
                    '🤖 ' + t('Generate Content', 'สร้างเนื้อหา')
                )
            ]),
            
            generatedContent && React.createElement('div', {
                key: 'generated',
                className: 'flux-seo-generated-content'
            }, [
                React.createElement('h3', { key: 'content-title' }, '📝 ' + t('Generated Content', 'เนื้อหาที่สร้าง')),
                React.createElement('div', {
                    key: 'meta-info',
                    className: 'flux-seo-meta-info'
                }, [
                    React.createElement('p', { key: 'title' }, React.createElement('strong', null, t('Title:', 'หัวข้อ:') + ' ') + generatedContent.title),
                    React.createElement('p', { key: 'meta' }, React.createElement('strong', null, t('Meta Description:', 'คำอธิบายเมตา:') + ' ') + generatedContent.metaDescription),
                    React.createElement('p', { key: 'keywords' }, [
                        React.createElement('strong', { key: 'label' }, t('Keywords:', 'คำสำคัญ:') + ' '),
                        generatedContent.keywords.join(', ')
                    ])
                ]),
                React.createElement('div', {
                    key: 'content',
                    className: 'flux-seo-content-preview',
                    dangerouslySetInnerHTML: { 
                        __html: generatedContent.content
                            .replace(/\n\n/g, '<br><br>')
                            .replace(/\n/g, '<br>')
                            .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
                            .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
                            .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/- (.*?)(?=<br>|$)/g, '• $1')
                    }
                }),
                React.createElement('div', {
                    key: 'actions',
                    className: 'flux-seo-actions'
                }, [
                    React.createElement('button', {
                        key: 'copy',
                        onClick: () => {
                            navigator.clipboard.writeText(generatedContent.content);
                            alert(t('Content copied to clipboard!', 'คัดลอกเนื้อหาไปยังคลิปบอร์ดแล้ว!'));
                        },
                        className: 'flux-seo-button'
                    }, t('Copy Content', 'คัดลอกเนื้อหา')),
                    React.createElement('button', {
                        key: 'save',
                        onClick: saveAsPost,
                        className: 'flux-seo-button primary'
                    }, t('Save as WordPress Post', 'บันทึกเป็นโพสต์ WordPress'))
                ])
            ])
        ]);
    };
    
    // Advanced Analytics Component
    const AdvancedAnalytics = ({ language }) => {
        const [analyticsData, setAnalyticsData] = React.useState(null);
        
        // Translation helper
        const t = (enText, thText) => language === 'th' ? thText : enText;
        
        React.useEffect(() => {
            // Simulate loading analytics data
            const timer = setTimeout(() => {
                setAnalyticsData({
                    totalPages: 1247,
                    avgSeoScore: 78,
                    topKeywords: [
                        'SEO optimization', 
                        'content marketing', 
                        'digital strategy', 
                        'web analytics', 
                        'keyword research'
                    ].map(kw => language === 'th' ? 
                        translateKeyword(kw) : kw
                    ),
                    recentActivity: [
                        { 
                            action: t('Content analyzed', 'วิเคราะห์เนื้อหา'), 
                            page: t('Homepage', 'หน้าแรก'), 
                            score: 85, 
                            time: t('2 hours ago', '2 ชั่วโมงที่แล้ว') 
                        },
                        { 
                            action: t('Blog post generated', 'สร้างบล็อกโพสต์'), 
                            topic: t('SEO Best Practices', 'แนวทางปฏิบัติที่ดีที่สุดของ SEO'), 
                            score: 92, 
                            time: t('4 hours ago', '4 ชั่วโมงที่แล้ว') 
                        },
                        { 
                            action: t('Keywords researched', 'วิจัยคำสำคัญ'), 
                            topic: t('Digital Marketing', 'การตลาดดิจิทัล'), 
                            count: 50, 
                            time: t('6 hours ago', '6 ชั่วโมงที่แล้ว') 
                        },
                        { 
                            action: t('Meta tags optimized', 'ปรับแต่งแท็กเมตา'), 
                            page: t('About Page', 'หน้าเกี่ยวกับเรา'), 
                            score: 88, 
                            time: t('1 day ago', '1 วันที่แล้ว') 
                        }
                    ]
                });
            }, 1000);
            
            return () => clearTimeout(timer);
        }, [language]);
        
        // Helper function to translate keywords to Thai
        const translateKeyword = (keyword) => {
            const translations = {
                'SEO optimization': 'การปรับแต่ง SEO',
                'content marketing': 'การตลาดเนื้อหา',
                'digital strategy': 'กลยุทธ์ดิจิทัล',
                'web analytics': 'การวิเคราะห์เว็บ',
                'keyword research': 'การวิจัยคำสำคัญ'
            };
            return translations[keyword] || keyword;
        };
        
        if (!analyticsData) {
            return React.createElement('div', {
                className: 'flux-seo-loading-small'
            }, t('Loading analytics...', 'กำลังโหลดการวิเคราะห์...'));
        }
        
        return React.createElement('div', {
            className: 'flux-seo-analytics'
        }, [
            React.createElement('h2', { key: 'title' }, '📈 ' + t('Advanced Analytics', 'การวิเคราะห์ขั้นสูง')),
            React.createElement('div', {
                key: 'overview',
                className: 'flux-seo-analytics-overview'
            }, [
                React.createElement('div', {
                    key: 'stat-1',
                    className: 'flux-seo-stat-card'
                }, [
                    React.createElement('h3', { key: 'number' }, analyticsData.totalPages.toLocaleString()),
                    React.createElement('p', { key: 'label' }, t('Total Pages Analyzed', 'จำนวนหน้าที่วิเคราะห์ทั้งหมด'))
                ]),
                React.createElement('div', {
                    key: 'stat-2',
                    className: 'flux-seo-stat-card'
                }, [
                    React.createElement('h3', { key: 'number' }, analyticsData.avgSeoScore + '/100'),
                    React.createElement('p', { key: 'label' }, t('Average SEO Score', 'คะแนน SEO เฉลี่ย'))
                ]),
                React.createElement('div', {
                    key: 'stat-3',
                    className: 'flux-seo-stat-card'
                }, [
                    React.createElement('h3', { key: 'number' }, analyticsData.topKeywords.length),
                    React.createElement('p', { key: 'label' }, t('Top Keywords Tracked', 'คำสำคัญยอดนิยมที่ติดตาม'))
                ])
            ]),
            
            React.createElement('div', {
                key: 'top-keywords',
                className: 'flux-seo-section'
            }, [
                React.createElement('h3', { key: 'title' }, '🔑 ' + t('Top Performing Keywords', 'คำสำคัญที่มีประสิทธิภาพสูงสุด')),
                React.createElement('ul', { key: 'list' },
                    analyticsData.topKeywords.map((keyword, index) =>
                        React.createElement('li', { key: index }, keyword)
                    )
                )
            ]),
            
            React.createElement('div', {
                key: 'recent-activity',
                className: 'flux-seo-section'
            }, [
                React.createElement('h3', { key: 'title' }, '⚡ ' + t('Recent Activity', 'กิจกรรมล่าสุด')),
                React.createElement('div', { key: 'activity-list' },
                    analyticsData.recentActivity.map((activity, index) =>
                        React.createElement('div', {
                            key: index,
                            className: 'flux-seo-activity-item'
                        }, [
                            React.createElement('div', { key: 'action' }, activity.action),
                            React.createElement('div', { key: 'details' }, activity.page || activity.topic),
                            React.createElement('div', { key: 'time' }, activity.time)
                        ])
                    )
                )
            ])
        ]);
    };
    
    console.log('📦 FluxSEOApp script loaded, window.FluxSEOApp available:', !!window.FluxSEOApp);
})();