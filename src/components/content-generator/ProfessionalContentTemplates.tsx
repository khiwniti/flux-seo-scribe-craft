
import React from 'react';

export interface ContentTemplate {
  id: string;
  name: string;
  nameEn: string;
  nameTh: string;
  description: string;
  descriptionEn: string;
  descriptionTh: string;
  structure: string[];
  structureEn: string[];
  structureTh: string[];
  seoElements: string[];
  targetWordCount: number;
  industry: string[];
}

export const PROFESSIONAL_TEMPLATES: ContentTemplate[] = [
  {
    id: 'comprehensive-guide',
    name: 'Comprehensive Guide',
    nameEn: 'Comprehensive Guide',
    nameTh: 'คู่มือฉบับสมบูรณ์',
    description: 'In-depth guide covering all aspects of a topic',
    descriptionEn: 'In-depth guide covering all aspects of a topic',
    descriptionTh: 'คู่มือเชิงลึกที่ครอบคลุมทุกด้านของหัวข้อ',
    structure: [
      'Executive Summary',
      'Introduction & Problem Statement',
      'Core Concepts & Definitions',
      'Step-by-Step Implementation',
      'Best Practices & Expert Tips',
      'Common Pitfalls & Solutions',
      'Tools & Resources',
      'Case Studies',
      'Future Trends',
      'Conclusion & Next Steps'
    ],
    structureEn: [
      'Executive Summary',
      'Introduction & Problem Statement',
      'Core Concepts & Definitions',
      'Step-by-Step Implementation',
      'Best Practices & Expert Tips',
      'Common Pitfalls & Solutions',
      'Tools & Resources',
      'Case Studies',
      'Future Trends',
      'Conclusion & Next Steps'
    ],
    structureTh: [
      'สรุปสำหรับผู้บริหาร',
      'บทนำและการระบุปัญหา',
      'แนวคิดหลักและคำจำกัดความ',
      'การดำเนินการทีละขั้นตอน',
      'แนวปฏิบัติที่ดีที่สุดและเทคนิคจากผู้เชี่ยวชาญ',
      'ข้อผิดพลาดที่พบบ่อยและวิธีแก้ไข',
      'เครื่องมือและทรัพยากร',
      'กรณีศึกษา',
      'แนวโน้มในอนาคต',
      'บทสรุปและขั้นตอนต่อไป'
    ],
    seoElements: ['H1-H6 hierarchy', 'Internal linking', 'Featured snippet optimization', 'Schema markup'],
    targetWordCount: 2000,
    industry: ['technology', 'business', 'marketing', 'education']
  },
  {
    id: 'industry-analysis',
    name: 'Industry Analysis',
    nameEn: 'Industry Analysis',
    nameTh: 'การวิเคราะห์อุตสาหกรรม',
    description: 'Professional industry analysis and market insights',
    descriptionEn: 'Professional industry analysis and market insights',
    descriptionTh: 'การวิเคราะห์อุตสาหกรรมและข้อมูลเชิงลึกของตลาดอย่างมืออาชีพ',
    structure: [
      'Market Overview',
      'Key Players Analysis',
      'Market Trends & Drivers',
      'Challenges & Opportunities',
      'Competitive Landscape',
      'Financial Performance',
      'Regulatory Environment',
      'Technology Impact',
      'Future Outlook',
      'Strategic Recommendations'
    ],
    structureEn: [
      'Market Overview',
      'Key Players Analysis',
      'Market Trends & Drivers',
      'Challenges & Opportunities',
      'Competitive Landscape',
      'Financial Performance',
      'Regulatory Environment',
      'Technology Impact',
      'Future Outlook',
      'Strategic Recommendations'
    ],
    structureTh: [
      'ภาพรวมตลาด',
      'การวิเคราะห์ผู้เล่นหลัก',
      'แนวโน้มและปัจจัยขับเคลื่อนตลาด',
      'ความท้าทายและโอกาส',
      'ภูมิทัศน์การแข่งขัน',
      'ผลการดำเนินงานทางการเงิน',
      'สภาพแวดล้อมด้านกฎระเบียบ',
      'ผลกระทบของเทคโนโลยี',
      'แนวโน้มในอนาคต',
      'ข้อเสนอแนะเชิงกลยุทธ์'
    ],
    seoElements: ['Data visualization', 'Statistics integration', 'Industry keywords', 'Authority building'],
    targetWordCount: 1800,
    industry: ['finance', 'technology', 'healthcare', 'manufacturing']
  },
  {
    id: 'how-to-tutorial',
    name: 'How-to Tutorial',
    nameEn: 'How-to Tutorial',
    nameTh: 'บทแนะนำวิธีการ',
    description: 'Step-by-step tutorial with practical implementation',
    descriptionEn: 'Step-by-step tutorial with practical implementation',
    descriptionTh: 'บทแนะนำทีละขั้นตอนพร้อมการปฏิบัติจริง',
    structure: [
      'Overview & Objectives',
      'Prerequisites & Requirements',
      'Tools & Materials Needed',
      'Step-by-Step Instructions',
      'Screenshots & Examples',
      'Troubleshooting Common Issues',
      'Advanced Tips & Variations',
      'Testing & Validation',
      'Maintenance & Updates',
      'Additional Resources'
    ],
    structureEn: [
      'Overview & Objectives',
      'Prerequisites & Requirements',
      'Tools & Materials Needed',
      'Step-by-Step Instructions',
      'Screenshots & Examples',
      'Troubleshooting Common Issues',
      'Advanced Tips & Variations',
      'Testing & Validation',
      'Maintenance & Updates',
      'Additional Resources'
    ],
    structureTh: [
      'ภาพรวมและวัตถุประสงค์',
      'ข้อกำหนดเบื้องต้นและความต้องการ',
      'เครื่องมือและวัสดุที่จำเป็น',
      'คำแนะนำทีละขั้นตอน',
      'ภาพหน้าจอและตัวอย่าง',
      'การแก้ไขปัญหาที่พบบ่อย',
      'เทคนิคขั้นสูงและการปรับเปลี่ยน',
      'การทดสอบและการตรวจสอบ',
      'การบำรุงรักษาและการอัปเดต',
      'ทรัพยากรเพิ่มเติม'
    ],
    seoElements: ['Process schema', 'FAQ section', 'Video embedding', 'Step numbering'],
    targetWordCount: 1200,
    industry: ['technology', 'diy', 'education', 'software']
  }
];

export const getTemplateByLanguage = (templateId: string, language: 'en' | 'th'): ContentTemplate | undefined => {
  const template = PROFESSIONAL_TEMPLATES.find(t => t.id === templateId);
  if (!template) return undefined;
  
  return {
    ...template,
    name: language === 'th' ? template.nameTh : template.nameEn,
    description: language === 'th' ? template.descriptionTh : template.descriptionEn,
    structure: language === 'th' ? template.structureTh : template.structureEn
  };
};
