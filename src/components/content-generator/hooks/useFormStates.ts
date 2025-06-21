
import { useState } from 'react';

export const useFormStates = () => {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('');
  const [wordCount, setWordCount] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [contentType, setContentType] = useState('');
  const [writingStyle, setWritingStyle] = useState('');
  const [industryFocus, setIndustryFocus] = useState('');
  const [contentTemplate, setContentTemplate] = useState('');

  return {
    topic,
    setTopic,
    keywords,
    setKeywords,
    tone,
    setTone,
    wordCount,
    setWordCount,
    targetAudience,
    setTargetAudience,
    contentType,
    setContentType,
    writingStyle,
    setWritingStyle,
    industryFocus,
    setIndustryFocus,
    contentTemplate,
    setContentTemplate
  };
};
