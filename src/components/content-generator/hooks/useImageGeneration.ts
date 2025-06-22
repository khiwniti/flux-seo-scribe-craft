
import { useState } from 'react';
import { GeneratedImage } from '../types';

export const useImageGeneration = () => {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const generateImages = (topic: string, tone: string, language: 'en' | 'th') => {
    const images: GeneratedImage[] = [
      { 
        id: 1, 
        url: `https://images.unsplash.com/800x600/?${encodeURIComponent(`${topic} professional illustration`)}`, 
        alt: `${topic} ${language === 'th' ? 'ภาพประกอบ' : 'main illustration'}`, 
        prompt: `Professional high-quality illustration for ${topic}, ${tone} style, ${language === 'th' ? 'Thai context' : 'international context'}`, 
        enhanced: true, 
        quality: 'high', 
        seoOptimized: true 
      },
      { 
        id: 2, 
        url: `https://images.unsplash.com/800x600/?${encodeURIComponent(`${topic} infographic data visualization`)}`, 
        alt: `${topic} ${language === 'th' ? 'อินโฟกราฟิก' : 'infographic'}`, 
        prompt: `Professional infographic showing key concepts of ${topic}, data visualization style`, 
        enhanced: true, 
        quality: 'high', 
        seoOptimized: true 
      }
    ];

    setGeneratedImages(images);
  };

  const downloadImage = (imageUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    generatedImages,
    generateImages,
    downloadImage
  };
};
