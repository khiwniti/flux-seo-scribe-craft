
export const extractKeywordsFromTopic = (topicText: string): string[] => {
  const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  return topicText
    .toLowerCase()
    .split(' ')
    .filter(word => word.length > 3 && !commonWords.includes(word))
    .slice(0, 5);
};

export const detectToneFromTopic = (topicText: string): string => {
  if (topicText.includes('guide') || topicText.includes('how to')) return 'professional';
  if (topicText.includes('tips') || topicText.includes('tricks')) return 'casual';
  if (topicText.includes('strategy') || topicText.includes('analysis')) return 'authoritative';
  return 'conversational';
};

export const detectAudienceFromTopic = (topicText: string): string => {
  if (topicText.includes('beginner') || topicText.includes('basic')) return 'beginners';
  if (topicText.includes('advanced') || topicText.includes('expert')) return 'experts';
  if (topicText.includes('business') || topicText.includes('enterprise')) return 'professionals';
  return 'general';
};

export const detectContentTypeFromTopic = (topicText: string): string => {
  if (topicText.includes('how to') || topicText.includes('guide')) return 'how-to';
  if (topicText.includes('best') || topicText.includes('top')) return 'listicle';
  if (topicText.includes('vs') || topicText.includes('compare')) return 'comparison';
  return 'blog';
};
