
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateBlogContent } from '@/lib/geminiService';

interface ContentGenerationRequest {
  topic: string;
  keywords: string;
  tone: string;
  wordCount: string;
  contentType: string;
  writingStyle: string;
  targetAudience: string;
  industryFocus: string;
  language: 'en' | 'th';
}

export class LanguageAwareContentGenerator {
  private static getLanguageSpecificPrompt(request: ContentGenerationRequest): string {
    const { topic, keywords, tone, wordCount, contentType, writingStyle, targetAudience, industryFocus, language } = request;
    
    if (language === 'th') {
      return this.getThaiPrompt(request);
    } else {
      return this.getEnglishPrompt(request);
    }
  }

  private static getThaiPrompt(request: ContentGenerationRequest): string {
    const { topic, keywords, tone, wordCount, contentType, writingStyle, targetAudience, industryFocus } = request;
    
    const toneMapping = {
      'professional': 'เป็นทางการและมืออาชีพ',
      'casual': 'สบายๆ และเป็นกันเอง',
      'authoritative': 'มีอำนาจและน่าเชื่อถือ',
      'conversational': 'เสมือนการสนทนา'
    };

    const wordCountMapping = {
      'short': '500-800 คำ',
      'medium': '800-1200 คำ',
      'long': '1200-2000 คำ'
    };

    return `สร้างเนื้อหา${contentType}เรื่อง "${topic}" ในภาษาไทยที่มีคุณภาพระดับมืออาชีพ

**ข้อกำหนด:**
- ความยาว: ${wordCountMapping[wordCount as keyof typeof wordCountMapping] || '1000-1500 คำ'}
- โทนการเขียน: ${toneMapping[tone as keyof typeof toneMapping] || 'เป็นทางการ'}
- กลุ่มเป้าหมาย: ${targetAudience}
- อุตสาหกรรม: ${industryFocus}
- คำสำคัญที่ต้องใช้: ${keywords}
- รูปแบบการเขียน: ${writingStyle}

**โครงสร้างเนื้อหา:**
1. หัวข้อที่น่าสนใจและดึงดูดความสนใจ
2. บทนำที่เกี่ยวข้องกับผู้อ่าน
3. เนื้อหาหลักแบ่งเป็นหัวข้อย่อยที่ชัดเจน
4. ข้อมูลเชิงลึกและตัวอย่างที่เป็นประโยชน์
5. บทสรุปพร้อมข้อเสนอแนะ

**คุณภาพที่ต้องการ:**
- เขียนด้วยภาษาไทยที่ถูกต้องและเป็นธรรมชาติ
- ใช้ศัพท์เทคนิคที่เหมาะสมกับกลุ่มเป้าหมาย
- มีการอ้างอิงข้อมูลที่น่าเชื่อถือ
- เนื้อหาเป็นประโยชน์และปฏิบัติได้จริง
- เหมาะสำหรับการทำ SEO

เขียนเนื้อหาที่สมบูรณ์และพร้อมใช้งานระดับมืออาชีพ`;
  }

  private static getEnglishPrompt(request: ContentGenerationRequest): string {
    const { topic, keywords, tone, wordCount, contentType, writingStyle, targetAudience, industryFocus } = request;
    
    const wordCountMapping = {
      'short': '500-800 words',
      'medium': '800-1200 words', 
      'long': '1200-2000 words'
    };

    return `Create a professional-grade ${contentType} about "${topic}" in native English.

**Requirements:**
- Word Count: ${wordCountMapping[wordCount as keyof typeof wordCountMapping] || '1000-1500 words'}
- Tone: ${tone}
- Target Audience: ${targetAudience}
- Industry Focus: ${industryFocus}
- Target Keywords: ${keywords}
- Writing Style: ${writingStyle}

**Content Structure:**
1. Compelling, SEO-optimized headline
2. Engaging introduction that hooks the reader
3. Well-structured main content with clear subheadings
4. Actionable insights and practical examples
5. Strong conclusion with clear call-to-action

**Quality Standards:**
- Native English writing, grammatically perfect
- Industry-appropriate terminology and expertise
- Data-driven insights and credible references
- Actionable advice and practical value
- SEO-optimized without keyword stuffing
- Engaging and readable for the target audience

**Professional Elements:**
- Executive summary or key takeaways
- Statistical data and industry insights
- Best practices and proven strategies
- Case studies or real-world examples
- Future trends and recommendations

Write complete, publication-ready content that demonstrates subject matter expertise.`;
  }

  public static async generateContent(request: ContentGenerationRequest): Promise<string> {
    const prompt = this.getLanguageSpecificPrompt(request);
    
    try {
      const content = await generateBlogContent(prompt);
      return this.enhanceContentQuality(content, request);
    } catch (error) {
      throw new Error(`Content generation failed: ${error}`);
    }
  }

  private static enhanceContentQuality(content: string, request: ContentGenerationRequest): string {
    // Add language-specific enhancements
    if (request.language === 'th') {
      return this.enhanceThaiContent(content);
    } else {
      return this.enhanceEnglishContent(content);
    }
  }

  private static enhanceThaiContent(content: string): string {
    // Add Thai-specific formatting and enhancements
    let enhanced = content;
    
    // Ensure proper Thai formatting
    enhanced = enhanced.replace(/\s+/g, ' '); // Clean up spacing
    enhanced = enhanced.replace(/([ก-๙])\s+([.,!?])/g, '$1$2'); // Fix punctuation spacing
    
    return enhanced;
  }

  private static enhanceEnglishContent(content: string): string {
    // Add English-specific formatting and enhancements
    let enhanced = content;
    
    // Ensure proper English formatting
    enhanced = enhanced.replace(/\s+/g, ' '); // Clean up spacing
    enhanced = enhanced.replace(/\s+([.,!?])/g, '$1'); // Fix punctuation spacing
    
    return enhanced;
  }
}

export default LanguageAwareContentGenerator;
