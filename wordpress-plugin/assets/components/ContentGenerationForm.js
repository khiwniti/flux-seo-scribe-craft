
// Content Generation Form Component
const ContentGenerationForm = ({
  formData,
  setFormData,
  onGenerate,
  isGenerating,
  error
}) => {
  const { language } = React.useContext(LanguageContext);

  const t = (enText, thText) => {
    return language === 'th' ? thText : enText;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return React.createElement('div', {
    className: 'flux-seo-form'
  }, [
    React.createElement('h3', { key: 'title' }, [
      React.createElement('span', { key: 'icon' }, '🤖 '),
      t('AI Content Generator', 'เครื่องมือสร้างเนื้อหา AI')
    ]),
    
    React.createElement('div', {
      key: 'form-group-topic',
      className: 'flux-seo-form-group'
    }, [
      React.createElement('label', { key: 'label' }, t('Topic *', 'หัวข้อ *')),
      React.createElement('input', {
        key: 'input',
        type: 'text',
        value: formData.topic || '',
        onChange: (e) => handleInputChange('topic', e.target.value),
        placeholder: t('Enter your topic...', 'กรอกหัวข้อของคุณ...'),
        className: 'flux-seo-input'
      })
    ]),

    React.createElement('div', {
      key: 'form-row',
      className: 'flux-seo-form-row'
    }, [
      React.createElement('div', {
        key: 'keywords-group',
        className: 'flux-seo-form-group'
      }, [
        React.createElement('label', { key: 'label' }, t('Keywords', 'คีย์เวิร์ด')),
        React.createElement('input', {
          key: 'input',
          type: 'text',
          value: formData.keywords || '',
          onChange: (e) => handleInputChange('keywords', e.target.value),
          placeholder: t('Enter keywords...', 'กรอกคีย์เวิร์ด...'),
          className: 'flux-seo-input'
        })
      ]),

      React.createElement('div', {
        key: 'tone-group',
        className: 'flux-seo-form-group'
      }, [
        React.createElement('label', { key: 'label' }, t('Tone', 'ลักษณะ')),
        React.createElement('select', {
          key: 'select',
          value: formData.tone || 'professional',
          onChange: (e) => handleInputChange('tone', e.target.value),
          className: 'flux-seo-select'
        }, [
          React.createElement('option', { key: 'professional', value: 'professional' }, 
            t('Professional', 'เป็นทางการ')),
          React.createElement('option', { key: 'casual', value: 'casual' }, 
            t('Casual', 'เป็นกันเอง')),
          React.createElement('option', { key: 'authoritative', value: 'authoritative' }, 
            t('Authoritative', 'น่าเชื่อถือ'))
        ])
      ])
    ]),

    React.createElement('div', {
      key: 'form-row-2',
      className: 'flux-seo-form-row'
    }, [
      React.createElement('div', {
        key: 'word-count-group',
        className: 'flux-seo-form-group'
      }, [
        React.createElement('label', { key: 'label' }, t('Word Count', 'จำนวนคำ')),
        React.createElement('select', {
          key: 'select',
          value: formData.wordCount || 'medium',
          onChange: (e) => handleInputChange('wordCount', e.target.value),
          className: 'flux-seo-select'
        }, [
          React.createElement('option', { key: 'short', value: 'short' }, 
            t('Short (500-800)', 'สั้น (500-800)')),
          React.createElement('option', { key: 'medium', value: 'medium' }, 
            t('Medium (800-1200)', 'ปานกลาง (800-1200)')),
          React.createElement('option', { key: 'long', value: 'long' }, 
            t('Long (1200-2000)', 'ยาว (1200-2000)'))
        ])
      ]),

      React.createElement('div', {
        key: 'language-group',
        className: 'flux-seo-form-group'
      }, [
        React.createElement('label', { key: 'label' }, t('Language', 'ภาษา')),
        React.createElement('select', {
          key: 'select',
          value: formData.language || 'en',
          onChange: (e) => handleInputChange('language', e.target.value),
          className: 'flux-seo-select'
        }, [
          React.createElement('option', { key: 'en', value: 'en' }, 'English'),
          React.createElement('option', { key: 'th', value: 'th' }, 'ไทย')
        ])
      ])
    ]),

    error && React.createElement('div', {
      key: 'error',
      className: 'flux-seo-error'
    }, error),

    React.createElement('button', {
      key: 'generate-btn',
      onClick: onGenerate,
      disabled: isGenerating || !formData.topic,
      className: 'flux-seo-button primary'
    }, isGenerating ? [
      React.createElement('span', { key: 'spinner', className: 'flux-seo-spinner' }),
      ' ',
      t('Generating...', 'กำลังสร้าง...')
    ] : [
      React.createElement('span', { key: 'icon' }, '✨ '),
      t('Generate Content', 'สร้างเนื้อหา')
    ])
  ]);
};

window.FluxSEOComponents = window.FluxSEOComponents || {};
window.FluxSEOComponents.ContentGenerationForm = ContentGenerationForm;
