import { AIAnalysisResult, InputContent } from '../types';

// 模拟AI分析延迟
const ANALYSIS_DELAY = 2000;

// 关键词提取的停用词列表
const STOP_WORDS = new Set([
  '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '那', '它', '他', '她', '们', '这个', '那个', '什么', '怎么', '为什么', '因为', '所以', '但是', '然后', '如果', '虽然', '可以', '应该', '能够', '可能', '或者', '而且', '不过', '只是', '还是', '已经', '正在', '将要'
]);

// 提取关键词
const extractKeywords = (text: string, maxKeywords: number = 5): string[] => {
  // 简单的关键词提取算法
  const words = text
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, ' ') // 保留中文、英文、数字
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOP_WORDS.has(word))
    .map(word => word.toLowerCase());

  // 统计词频
  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  // 按频率排序并返回前N个
  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
};

// 生成摘要
const generateSummary = (text: string, maxLength: number = 200): string => {
  // 简单的摘要生成：取前几句话
  const sentences = text
    .split(/[。！？.!?]\s*/)
    .filter(sentence => sentence.trim().length > 10);

  let summary = '';
  for (const sentence of sentences) {
    if (summary.length + sentence.length > maxLength) {
      break;
    }
    summary += sentence + '。';
  }

  return summary || text.slice(0, maxLength) + '...';
};

// 生成标题
const generateTitle = (text: string): string => {
  // 尝试从第一句话生成标题
  const firstSentence = text.split(/[。！？.!?]/)[0].trim();
  
  if (firstSentence.length > 0 && firstSentence.length <= 50) {
    return firstSentence;
  }
  
  // 如果第一句话太长或太短，从关键词生成标题
  const keywords = extractKeywords(text, 3);
  if (keywords.length > 0) {
    return keywords.slice(0, 2).join(' ');
  }
  
  // 默认标题
  return '新建卡片';
};

// 建议模板
const suggestTemplate = (text: string): string => {
  const content = text.toLowerCase();
  
  // 根据内容特征建议模板
  if (content.includes('步骤') || content.includes('方法') || content.includes('如何')) {
    return 'tutorial';
  }
  
  if (content.includes('引用') || content.includes('说过') || content.includes('"')) {
    return 'quote';
  }
  
  if (content.includes('数据') || content.includes('统计') || content.includes('%')) {
    return 'data';
  }
  
  if (content.includes('新闻') || content.includes('报道') || content.includes('发布')) {
    return 'news';
  }
  
  return 'default';
};

// 分析文本内容
export const analyzeText = async (content: string): Promise<AIAnalysisResult> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, ANALYSIS_DELAY));
  
  if (!content.trim()) {
    throw new Error('内容不能为空');
  }
  
  const title = generateTitle(content);
  const summary = generateSummary(content);
  const keywords = extractKeywords(content);
  const suggestedTemplate = suggestTemplate(content);
  
  return {
    title,
    summary,
    keywords,
    content: content.trim(),
    suggestedTemplate,
  };
};

// 分析URL内容
export const analyzeUrl = async (url: string): Promise<AIAnalysisResult> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, ANALYSIS_DELAY));
  
  // 验证URL格式
  try {
    new URL(url);
  } catch {
    throw new Error('无效的URL格式');
  }
  
  // 模拟网页内容提取（实际应用中需要调用后端API）
  const mockContent = `这是从网页 ${url} 提取的内容。\n\n网页标题：示例网页标题\n\n网页内容：这里是网页的主要内容，包含了重要的信息和数据。通过AI分析，我们可以提取出关键信息并生成结构化的卡片内容。\n\n这个功能在实际应用中需要调用专门的网页内容提取服务。`;
  
  return analyzeText(mockContent);
};

// 分析文件内容
export const analyzeFile = async (file: File): Promise<AIAnalysisResult> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, ANALYSIS_DELAY));
  
  // 检查文件类型
  const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|pdf|doc|docx)$/i)) {
    throw new Error('不支持的文件类型。请上传 TXT、PDF 或 Word 文档。');
  }
  
  // 检查文件大小（限制为10MB）
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('文件大小不能超过10MB');
  }
  
  try {
    let content: string;
    
    if (file.type === 'text/plain') {
      // 读取文本文件
      content = await file.text();
    } else {
      // 对于PDF和Word文件，这里模拟内容提取
      // 实际应用中需要使用专门的文档解析库或服务
      content = `这是从文件 "${file.name}" 提取的内容。\n\n文件类型：${file.type}\n文件大小：${(file.size / 1024).toFixed(2)} KB\n\n模拟提取的文档内容：这里是文档的主要内容，包含了重要的信息和数据。通过AI分析，我们可以提取出关键信息并生成结构化的卡片内容。\n\n在实际应用中，这里会调用专门的文档解析服务来提取真实的文档内容。`;
    }
    
    if (!content.trim()) {
      throw new Error('文件内容为空');
    }
    
    return analyzeText(content);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('文件读取失败');
  }
};

// 根据输入内容类型进行分析
export const analyzeContent = async (inputContent: InputContent): Promise<AIAnalysisResult> => {
  switch (inputContent.type) {
    case 'text':
      return analyzeText(inputContent.content);
    
    case 'url':
      return analyzeUrl(inputContent.content);
    
    case 'file':
      // 对于文件类型，content字段包含文件内容，这里需要特殊处理
      // 在实际应用中，文件分析应该在文件上传时进行
      return analyzeText(inputContent.content);
    
    default:
      throw new Error('不支持的内容类型');
  }
};

// 重新分析内容（用于编辑时的内容更新）
export const reanalyzeContent = async (content: string, preserveTitle: boolean = false): Promise<Partial<AIAnalysisResult>> => {
  const result = await analyzeText(content);
  
  if (preserveTitle) {
    // 如果保留标题，只返回其他分析结果
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { title, ...rest } = result;
    return rest;
  }
  
  return result;
};

// 验证分析结果
export const validateAnalysisResult = (result: AIAnalysisResult): string[] => {
  const errors: string[] = [];
  
  if (!result.title?.trim()) {
    errors.push('标题不能为空');
  }
  
  if (!result.summary?.trim()) {
    errors.push('摘要不能为空');
  }
  
  if (!result.content?.trim()) {
    errors.push('内容不能为空');
  }
  
  if (result.title && result.title.length > 100) {
    errors.push('标题长度不能超过100个字符');
  }
  
  if (result.summary && result.summary.length > 500) {
    errors.push('摘要长度不能超过500个字符');
  }
  
  return errors;
};