import { Template, CardStyle } from '../types';

// 创建基础样式 - 适配9:18竖图比例
const createBaseStyle = (): CardStyle => ({
  backgroundColor: '#ffffff',
  textColor: '#333333',
  titleColor: '#1a1a1a',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 14, // 减小字体以适应竖图
  titleSize: 20, // 减小标题字体
  lineHeight: 1.5, // 调整行高
  padding: 20, // 减小内边距
  borderRadius: 12,
  shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  border: {
    width: 0,
    color: 'transparent',
    style: 'solid',
  },
});

// 预设模板数据
export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'default',
    name: '经典白卡',
    description: '简洁优雅的经典设计，适合正式内容展示',
    category: 'basic',
    preview: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20white%20card%20with%20subtle%20shadow%20minimal%20design&image_size=landscape_4_3',
    style: {
      ...createBaseStyle(),
      backgroundColor: '#ffffff',
      textColor: '#2d3748',
      titleColor: '#1a202c',
      fontFamily: 'Georgia, serif',
      titleSize: 28,
      padding: 32,
      borderRadius: 16,
      shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: {
        width: 1,
        color: '#e2e8f0',
        style: 'solid',
      },
    },
  },
  {
    id: 'modern',
    name: '科技蓝调',
    description: '现代科技感设计，深蓝渐变配色，适合技术和商务内容',
    category: 'business',
    preview: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20tech%20card%20blue%20gradient%20sleek%20design&image_size=landscape_4_3',
    style: {
      ...createBaseStyle(),
      backgroundColor: '#1e40af',
      textColor: '#e0e7ff',
      titleColor: '#ffffff',
      fontFamily: 'SF Pro Display, -apple-system, sans-serif',
      titleSize: 26,
      fontSize: 15,
      gradient: {
        from: '#1e40af',
        to: '#3730a3',
        direction: 'to bottom right',
      },
      borderRadius: 20,
      shadow: '0 20px 40px -12px rgba(30, 64, 175, 0.4), 0 8px 16px -4px rgba(30, 64, 175, 0.2)',
      border: {
        width: 1,
        color: 'rgba(255, 255, 255, 0.1)',
        style: 'solid',
      },
    },
  },
  {
    id: 'colorful',
    name: '彩虹渐变',
    description: '充满活力的彩虹渐变设计，适合创意和艺术内容',
    category: 'creative',
    preview: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=vibrant%20rainbow%20gradient%20card%20creative%20design&image_size=landscape_4_3',
    style: {
      ...createBaseStyle(),
      backgroundColor: '#ff6b6b',
      textColor: '#ffffff',
      titleColor: '#ffffff',
      fontFamily: 'Poppins, sans-serif',
      titleSize: 30,
      fontSize: 16,
      fontWeight: 600,
      gradient: {
        from: '#ff6b6b',
        to: '#4ecdc4',
        direction: 'to bottom right',
      },
      borderRadius: 24,
      shadow: '0 25px 50px -12px rgba(255, 107, 107, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      border: {
        width: 2,
        color: 'rgba(255, 255, 255, 0.2)',
        style: 'solid',
      },
    },
  },
  {
    id: 'dark',
    name: '暗夜精英',
    description: '高端深色主题，金色点缀，适合专业和高端内容',
    category: 'dark',
    preview: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20dark%20card%20gold%20accents%20premium%20design&image_size=landscape_4_3',
    style: {
      ...createBaseStyle(),
      backgroundColor: '#0f172a',
      textColor: '#cbd5e1',
      titleColor: '#fbbf24',
      fontFamily: 'Playfair Display, serif',
      titleSize: 32,
      fontSize: 16,
      gradient: {
        from: '#0f172a',
        to: '#1e293b',
        direction: 'to bottom right',
      },
      borderRadius: 18,
      shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(251, 191, 36, 0.1)',
      border: {
        width: 1,
        color: 'rgba(251, 191, 36, 0.3)',
        style: 'solid',
      },
    },
  },
  {
    id: 'elegant',
    name: '香槟优雅',
    description: '奢华香槟色调，优雅衬线字体，适合高端和文艺内容',
    category: 'elegant',
    preview: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20champagne%20elegant%20card%20serif%20typography&image_size=landscape_4_3',
    style: {
      ...createBaseStyle(),
      backgroundColor: '#fef7ed',
      textColor: '#78716c',
      titleColor: '#a16207',
      fontFamily: 'Cormorant Garamond, serif',
      titleSize: 34,
      fontSize: 17,
      lineHeight: 1.8,
      gradient: {
        from: '#fef7ed',
        to: '#fed7aa',
        direction: 'to bottom right',
      },
      borderRadius: 12,
      shadow: '0 20px 40px -12px rgba(161, 98, 7, 0.15), 0 8px 16px -4px rgba(161, 98, 7, 0.1)',
      padding: 40,
      border: {
        width: 2,
        color: '#d97706',
        style: 'solid',
      },
    },
  },
  {
    id: 'tech',
    name: '赛博朋克',
    description: '未来科技风格，霓虹色彩，适合科技和游戏内容',
    category: 'tech',
    preview: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=cyberpunk%20neon%20tech%20card%20futuristic%20design&image_size=landscape_4_3',
    style: {
      ...createBaseStyle(),
      backgroundColor: '#0a0a0a',
      textColor: '#00ff88',
      titleColor: '#ff0080',
      fontFamily: 'Orbitron, monospace',
      titleSize: 28,
      fontSize: 15,
      fontWeight: 700,
      gradient: {
        from: '#0a0a0a',
        to: '#1a1a2e',
        direction: 'to bottom right',
      },
      borderRadius: 8,
      shadow: '0 0 30px rgba(255, 0, 128, 0.5), 0 0 60px rgba(0, 255, 136, 0.2)',
      border: {
        width: 2,
        color: '#00ff88',
        style: 'solid',
      },
    },
  },
  {
    id: 'nature',
    name: '森林晨曦',
    description: '自然绿色渐变，有机曲线设计，适合环保和健康内容',
    category: 'nature',
    preview: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=forest%20morning%20green%20gradient%20organic%20card%20design&image_size=landscape_4_3',
    style: {
      ...createBaseStyle(),
      backgroundColor: '#065f46',
      textColor: '#d1fae5',
      titleColor: '#ffffff',
      fontFamily: 'Nunito, sans-serif',
      titleSize: 29,
      fontSize: 16,
      gradient: {
        from: '#065f46',
        to: '#059669',
        direction: 'to bottom right',
      },
      borderRadius: 28,
      shadow: '0 25px 50px -12px rgba(6, 95, 70, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      border: {
        width: 3,
        color: 'rgba(255, 255, 255, 0.2)',
        style: 'solid',
      },
    },
  },
  {
    id: 'vintage',
    name: '复古牛皮纸',
    description: '怀旧牛皮纸质感，复古印刷风格，适合历史和文化内容',
    category: 'vintage',
    preview: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=vintage%20kraft%20paper%20retro%20typography%20aged%20design&image_size=landscape_4_3',
    style: {
      ...createBaseStyle(),
      backgroundColor: '#d2b48c',
      textColor: '#5d4037',
      titleColor: '#3e2723',
      fontFamily: 'Crimson Text, serif',
      titleSize: 31,
      fontSize: 17,
      lineHeight: 1.7,
      gradient: {
        from: '#d2b48c',
        to: '#ddbf94',
        direction: 'to bottom right',
      },
      borderRadius: 6,
      shadow: '0 8px 16px -4px rgba(93, 64, 55, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      padding: 36,
      border: {
        width: 3,
        color: '#8d6e63',
        style: 'double',
      },
    },
  },
  {
    id: 'neon',
    name: '霓虹夜景',
    description: '炫酷霓虹灯效果，适合音乐和娱乐内容',
    category: 'creative',
    preview: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=neon%20lights%20card%20design%20purple%20pink%20glow&image_size=landscape_4_3',
    style: {
      ...createBaseStyle(),
      backgroundColor: '#1a0033',
      textColor: '#ff00ff',
      titleColor: '#00ffff',
      fontFamily: 'Audiowide, cursive',
      titleSize: 30,
      fontSize: 16,
      fontWeight: 600,
      gradient: {
        from: '#1a0033',
        to: '#330066',
        direction: 'to bottom right',
      },
      borderRadius: 15,
      shadow: '0 0 40px rgba(255, 0, 255, 0.6), 0 0 80px rgba(0, 255, 255, 0.3)',
      border: {
        width: 2,
        color: '#ff00ff',
        style: 'solid',
      },
    },
  },
  {
    id: 'minimalist',
    name: '极简主义',
    description: '纯净极简设计，大量留白，适合设计和艺术内容',
    category: 'elegant',
    preview: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=minimalist%20clean%20white%20space%20simple%20typography&image_size=landscape_4_3',
    style: {
      ...createBaseStyle(),
      backgroundColor: '#fafafa',
      textColor: '#424242',
      titleColor: '#212121',
      fontFamily: 'Helvetica Neue, sans-serif',
      titleSize: 36,
      fontSize: 14,
      lineHeight: 2.0,
      borderRadius: 0,
      shadow: 'none',
      padding: 60,
      border: {
        width: 1,
        color: '#e0e0e0',
        style: 'solid',
      },
    },
  },
  {
    id: 'watercolor',
    name: '水彩艺术',
    description: '柔和水彩渐变效果，适合艺术和创意内容',
    category: 'creative',
    preview: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=watercolor%20soft%20gradient%20artistic%20card%20design&image_size=landscape_4_3',
    style: {
      ...createBaseStyle(),
      backgroundColor: '#fce4ec',
      textColor: '#4a148c',
      titleColor: '#6a1b9a',
      fontFamily: 'Dancing Script, cursive',
      titleSize: 32,
      fontSize: 16,
      gradient: {
        from: '#fce4ec',
        to: '#f8bbd9',
        direction: 'to bottom right',
      },
      borderRadius: 25,
      shadow: '0 15px 35px -10px rgba(106, 27, 154, 0.2)',
      border: {
        width: 0,
        color: 'transparent',
        style: 'solid',
      },
    },
  },
  {
    id: 'industrial',
    name: '工业金属',
    description: '硬朗工业风格，金属质感，适合机械和工程内容',
    category: 'tech',
    preview: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%20metal%20steel%20card%20design%20mechanical&image_size=landscape_4_3',
    style: {
      ...createBaseStyle(),
      backgroundColor: '#37474f',
      textColor: '#cfd8dc',
      titleColor: '#ff6f00',
      fontFamily: 'Roboto Condensed, sans-serif',
      titleSize: 28,
      fontSize: 15,
      fontWeight: 700,
      gradient: {
        from: '#37474f',
        to: '#455a64',
        direction: 'to bottom right',
      },
      borderRadius: 4,
      shadow: '0 8px 16px -4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      border: {
        width: 3,
        color: '#ff6f00',
        style: 'solid',
      },
    },
  },
];

// 模板分类
export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: '全部模板', count: DEFAULT_TEMPLATES.length },
  { id: 'basic', name: '基础模板', count: DEFAULT_TEMPLATES.filter(t => t.category === 'basic').length },
  { id: 'business', name: '商务风格', count: DEFAULT_TEMPLATES.filter(t => t.category === 'business').length },
  { id: 'creative', name: '创意风格', count: DEFAULT_TEMPLATES.filter(t => t.category === 'creative').length },
  { id: 'dark', name: '深色主题', count: DEFAULT_TEMPLATES.filter(t => t.category === 'dark').length },
  { id: 'elegant', name: '优雅风格', count: DEFAULT_TEMPLATES.filter(t => t.category === 'elegant').length },
  { id: 'tech', name: '科技风格', count: DEFAULT_TEMPLATES.filter(t => t.category === 'tech').length },
  { id: 'nature', name: '自然风格', count: DEFAULT_TEMPLATES.filter(t => t.category === 'nature').length },
  { id: 'vintage', name: '复古风格', count: DEFAULT_TEMPLATES.filter(t => t.category === 'vintage').length },
];

// 获取所有模板
export const getAllTemplates = (): Template[] => {
  return DEFAULT_TEMPLATES;
};

// 根据ID获取模板
export const getTemplateById = (id: string): Template | null => {
  return DEFAULT_TEMPLATES.find(template => template.id === id) || null;
};

// 根据分类获取模板
export const getTemplatesByCategory = (category: string): Template[] => {
  if (category === 'all') {
    return DEFAULT_TEMPLATES;
  }
  return DEFAULT_TEMPLATES.filter(template => template.category === category);
};

// 搜索模板
export const searchTemplates = (query: string): Template[] => {
  if (!query.trim()) {
    return DEFAULT_TEMPLATES;
  }
  
  const searchTerm = query.toLowerCase();
  return DEFAULT_TEMPLATES.filter(
    template =>
      template.name.toLowerCase().includes(searchTerm) ||
      template.description.toLowerCase().includes(searchTerm) ||
      template.category.toLowerCase().includes(searchTerm)
  );
};

// 获取推荐模板（基于内容类型）
export const getRecommendedTemplates = (contentType?: string): Template[] => {
  const recommendations: Record<string, string[]> = {
    tutorial: ['modern', 'tech', 'default'],
    quote: ['elegant', 'vintage', 'default'],
    data: ['tech', 'modern', 'default'],
    news: ['modern', 'default', 'dark'],
    creative: ['colorful', 'nature', 'elegant'],
    business: ['modern', 'elegant', 'default'],
  };
  
  const templateIds = recommendations[contentType || 'default'] || ['default', 'modern', 'elegant'];
  
  return templateIds
    .map(id => getTemplateById(id))
    .filter((template): template is Template => template !== null);
};

// 创建自定义模板
export const createCustomTemplate = (
  name: string,
  description: string,
  style: CardStyle,
  category: string = 'custom'
): Template => {
  return {
    id: `custom_${Date.now()}`,
    name,
    description,
    category,
    preview: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=custom%20card%20template%20design&image_size=landscape_4_3',
    style,
  };
};

// 验证模板数据
export const validateTemplate = (template: Partial<Template>): string[] => {
  const errors: string[] = [];
  
  if (!template.name?.trim()) {
    errors.push('模板名称不能为空');
  }
  
  if (!template.description?.trim()) {
    errors.push('模板描述不能为空');
  }
  
  if (!template.style) {
    errors.push('模板样式不能为空');
  } else {
    if (!template.style.backgroundColor) {
      errors.push('背景颜色不能为空');
    }
    if (!template.style.textColor) {
      errors.push('文本颜色不能为空');
    }
    if (!template.style.titleColor) {
      errors.push('标题颜色不能为空');
    }
  }
  
  if (template.name && template.name.length > 50) {
    errors.push('模板名称长度不能超过50个字符');
  }
  
  if (template.description && template.description.length > 200) {
    errors.push('模板描述长度不能超过200个字符');
  }
  
  return errors;
};

// 复制模板
export const duplicateTemplate = (template: Template, newName?: string): Template => {
  return {
    ...template,
    id: `copy_${Date.now()}`,
    name: newName || `${template.name} 副本`,
    category: 'custom',
  };
};

// 导出模板
export const exportTemplate = (template: Template): string => {
  return JSON.stringify({
    version: '1.0',
    exportDate: new Date().toISOString(),
    template,
  }, null, 2);
};

// 导入模板
export const importTemplate = (jsonData: string): Template | null => {
  try {
    const data = JSON.parse(jsonData);
    
    if (!data.template) {
      return null;
    }
    
    const template = data.template;
    
    // 验证必要字段
    if (!template.name || !template.style) {
      return null;
    }
    
    // 生成新ID
    return {
      ...template,
      id: `imported_${Date.now()}`,
      category: 'custom',
    };
  } catch {
    return null;
  }
};