
// Content Analyzer Component
const ContentAnalyzer = () => {
  const [content, setContent] = React.useState('');
  const [analysis, setAnalysis] = React.useState(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const { language } = React.useContext(LanguageContext);

  const t = (enText, thText) => {
    return language === 'th' ? thText : enText;
  };

  const analyzeContent = async () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('action', 'flux_seo_proxy');
      formData.append('flux_action', 'analyze_content');
      formData.append('data', JSON.stringify({ content, language }));
      formData.append('nonce', fluxSeoData.nonce);

      const response = await fetch(fluxSeoData.ajaxurl, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        setAnalysis(result.data);
      } else {
        console.error('Analysis failed:', result.data);
      }
    } catch (error) {
      console.error('Error analyzing content:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return React.createElement('div', {
    className: 'flux-seo-content-analyzer'
  }, [
    React.createElement('h2', { key: 'title' }, [
      React.createElement('span', { key: 'icon' }, '📊 '),
      t('Content Analyzer', 'เครื่องมือวิเคราะห์เนื้อหา')
    ]),

    React.createElement('div', {
      key: 'analyzer-form',
      className: 'flux-seo-form'
    }, [
      React.createElement('div', {
        key: 'content-group',
        className: 'flux-seo-form-group'
      }, [
        React.createElement('label', { key: 'label' }, t('Content to Analyze', 'เนื้อหาที่ต้องการวิเคราะห์')),
        React.createElement('textarea', {
          key: 'textarea',
          value: content,
          onChange: (e) => setContent(e.target.value),
          placeholder: t('Paste your content here...', 'วางเนื้อหาของคุณที่นี่...'),
          className: 'flux-seo-textarea',
          rows: 8
        })
      ]),

      React.createElement('button', {
        key: 'analyze-btn',
        onClick: analyzeContent,
        disabled: isAnalyzing || !content.trim(),
        className: 'flux-seo-button primary'
      }, isAnalyzing ? [
        React.createElement('span', { key: 'spinner', className: 'flux-seo-spinner' }),
        ' ',
        t('Analyzing...', 'กำลังวิเคราะห์...')
      ] : [
        React.createElement('span', { key: 'icon' }, '🔍 '),
        t('Analyze Content', 'วิเคราะห์เนื้อหา')
      ])
    ]),

    analysis && React.createElement('div', {
      key: 'analysis-results',
      className: 'flux-seo-analysis'
    }, [
      React.createElement('h3', { key: 'results-title' }, 
        t('Analysis Results', 'ผลการวิเคราะห์')),

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
          React.createElement('span', { key: 'value' }, analysis.readability + '/100')
        ]),

        React.createElement('div', {
          key: 'keyword-density',
          className: 'flux-seo-metric'
        }, [
          React.createElement('span', { key: 'label' }, t('Keyword Density', 'ความหนาแน่นคีย์เวิร์ด')),
          React.createElement('span', { key: 'value' }, analysis.keyword_density)
        ])
      ]),

      analysis.suggestions && analysis.suggestions.length > 0 && React.createElement('div', {
        key: 'suggestions',
        className: 'flux-seo-suggestions'
      }, [
        React.createElement('h4', { key: 'suggestions-title' }, 
          t('Improvement Suggestions', 'ข้อแนะนำการปรับปรุง')),
        React.createElement('ul', { key: 'suggestions-list' },
          analysis.suggestions.map((suggestion, index) =>
            React.createElement('li', { key: index }, suggestion)
          )
        )
      ])
    ])
  ]);
};

window.FluxSEOComponents = window.FluxSEOComponents || {};
window.FluxSEOComponents.ContentAnalyzer = ContentAnalyzer;
