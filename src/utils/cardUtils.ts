import { Card, CardStyle, Template } from '../types';
import html2canvas from 'html2canvas';

// 生成唯一ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 创建默认卡片样式
export const createDefaultStyle = (): CardStyle => ({
  backgroundColor: '#ffffff',
  textColor: '#374151',
  titleColor: '#1f2937',
  fontSize: 16,
  fontFamily: 'Inter, system-ui, sans-serif',
  borderRadius: 12,
  shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  padding: 24,
});

// 创建新卡片
export const createCard = (
  title: string,
  summary: string,
  content: string,
  keywords: string[] = [],
  template: string = 'default',
  style?: Partial<CardStyle>
): Card => {
  const now = new Date();
  return {
    id: generateId(),
    title,
    summary,
    content,
    keywords,
    template,
    style: { ...createDefaultStyle(), ...style },
    createdAt: now,
    updatedAt: now,
  };
};

// 更新卡片
export const updateCard = (card: Card, updates: Partial<Card>): Card => ({
  ...card,
  ...updates,
  updatedAt: new Date(),
});

// 应用模板到卡片
export const applyTemplate = (card: Card, template: Template): Card => ({
  ...card,
  template: template.id,
  style: { ...template.style },
  updatedAt: new Date(),
});

// 验证卡片数据
export const validateCard = (card: Partial<Card>): string[] => {
  const errors: string[] = [];
  
  if (!card.title?.trim()) {
    errors.push('标题不能为空');
  }
  
  if (!card.summary?.trim()) {
    errors.push('摘要不能为空');
  }
  
  if (!card.content?.trim()) {
    errors.push('内容不能为空');
  }
  
  if (card.title && card.title.length > 100) {
    errors.push('标题长度不能超过100个字符');
  }
  
  if (card.summary && card.summary.length > 300) {
    errors.push('摘要长度不能超过300个字符');
  }
  
  return errors;
};

// 格式化日期
export const formatDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes <= 1 ? '刚刚' : `${minutes}分钟前`;
    }
    return `${hours}小时前`;
  }
  
  if (days === 1) return '昨天';
  if (days < 7) return `${days}天前`;
  
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// 截取文本
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// 生成卡片预览图片URL（模拟）
export const generateCardPreviewUrl = (card: Card): string => {
  // 这里应该调用实际的图片生成服务
  // 现在返回一个占位符URL
  return `https://via.placeholder.com/400x300/3B82F6/ffffff?text=${encodeURIComponent(card.title)}`;
};

// 显示下载进度的回调函数类型
type ProgressCallback = (progress: number, message: string) => void;

// 显示成功提示的回调函数类型
type SuccessCallback = (message: string, filePath?: string) => void;

// 将卡片导出为图片（改进版）
export const exportCardAsImage = async (
  cardElement: HTMLElement, 
  card: Card,
  onProgress?: ProgressCallback,
  onSuccess?: SuccessCallback
): Promise<void> => {
  try {
    // 步骤1：开始导出
    onProgress?.(10, '正在准备导出...');
    
    // 使用已导入的html2canvas
    onProgress?.(20, '正在加载图片生成库...');
    
    // 步骤2：生成canvas
    onProgress?.(30, '正在生成图片...');
    const canvas = await html2canvas(cardElement, {
      backgroundColor: null,
      scale: 2, // 提高图片质量
      useCORS: true,
      allowTaint: true,
      width: cardElement.offsetWidth,
      height: cardElement.offsetHeight,
    });
    
    onProgress?.(70, '图片生成完成，正在处理...');
    
    // 步骤3：转换为blob并下载
    canvas.toBlob((blob) => {
      if (blob) {
        onProgress?.(90, '正在下载图片...');
        
        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const fileName = `${card.title || 'card'}_${new Date().getTime()}.png`;
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // 完成提示
        onProgress?.(100, '导出完成！');
        onSuccess?.(`图片已成功保存为 "${fileName}"`, fileName);
      }
    }, 'image/png', 0.95);
  } catch (error) {
    console.error('导出图片失败:', error);
    throw new Error('导出图片失败，请重试');
  }
};



// 检测下载权限的函数
const checkDownloadPermission = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // 创建一个测试用的小文件
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    const testUrl = URL.createObjectURL(testBlob);
    const testLink = document.createElement('a');
    testLink.href = testUrl;
    testLink.download = 'test.txt';
    testLink.style.display = 'none';
    
    // 监听下载事件
    let downloadStarted = false;
    
    const cleanup = () => {
      try {
        if (document.body.contains(testLink)) {
          document.body.removeChild(testLink);
        }
        URL.revokeObjectURL(testUrl);
      } catch (e) {
        console.warn('清理测试资源失败:', e);
      }
    };
    
    // 监听点击事件
    testLink.addEventListener('click', () => {
      downloadStarted = true;
    });
    
    document.body.appendChild(testLink);
    testLink.click();
    
    // 短暂延迟后检查结果
    setTimeout(() => {
      cleanup();
      resolve(downloadStarted);
    }, 100);
  });
};

// 显示下载指导的函数
const showDownloadGuidance = (fileName: string, blob: Blob): void => {
  const url = URL.createObjectURL(blob);
  
  // 创建指导界面
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    padding: 24px;
    border-radius: 12px;
    max-width: 500px;
    margin: 20px;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  `;
  
  content.innerHTML = `
    <div style="margin-bottom: 20px;">
      <div style="width: 60px; height: 60px; background: #3B82F6; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
        <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #1F2937;">图片已准备就绪</h3>
      <p style="margin: 0; color: #6B7280; font-size: 14px;">请选择下载方式</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <button id="directDownload" style="
        width: 100%;
        padding: 12px 20px;
        background: #3B82F6;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        margin-bottom: 12px;
        transition: background 0.2s;
      ">📥 直接下载 (推荐)</button>
      
      <button id="rightClickSave" style="
        width: 100%;
        padding: 12px 20px;
        background: #F3F4F6;
        color: #374151;
        border: 1px solid #D1D5DB;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        margin-bottom: 12px;
        transition: background 0.2s;
      ">🖱️ 右键保存图片</button>
    </div>
    
    <div style="font-size: 12px; color: #6B7280; line-height: 1.4;">
      <p style="margin: 0 0 8px 0;">💡 <strong>提示：</strong></p>
      <p style="margin: 0 0 4px 0;">• 如果直接下载被阻止，请允许此网站下载文件</p>
      <p style="margin: 0 0 4px 0;">• 或者使用右键保存的方式</p>
      <p style="margin: 0;">• 文件名：${fileName}</p>
    </div>
    
    <button id="closeModal" style="
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #9CA3AF;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    ">×</button>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // 事件处理
  const directDownloadBtn = content.querySelector('#directDownload') as HTMLButtonElement;
  const rightClickSaveBtn = content.querySelector('#rightClickSave') as HTMLButtonElement;
  const closeBtn = content.querySelector('#closeModal') as HTMLButtonElement;
  
  // 直接下载
  directDownloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 更新按钮状态
    directDownloadBtn.innerHTML = '✅ 下载已启动';
    directDownloadBtn.style.background = '#10B981';
    directDownloadBtn.disabled = true;
    
    setTimeout(() => {
      closeModal();
    }, 2000);
  });
  
  // 右键保存
  rightClickSaveBtn.addEventListener('click', () => {
    // 创建图片预览
    const img = document.createElement('img');
    img.src = url;
    img.style.cssText = `
      max-width: 100%;
      max-height: 400px;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      margin: 16px 0;
    `;
    
    // 替换内容
    content.innerHTML = `
      <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1F2937;">右键保存图片</h3>
      <p style="margin: 0 0 16px 0; color: #6B7280; font-size: 14px;">在下方图片上右键，选择"图片另存为"</p>
      <div style="text-align: center;"></div>
      <button id="backBtn" style="
        margin-top: 16px;
        padding: 8px 16px;
        background: #F3F4F6;
        color: #374151;
        border: 1px solid #D1D5DB;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
      ">← 返回</button>
      <button id="closeModal2" style="
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #9CA3AF;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
      ">×</button>
    `;
    
    const imgContainer = content.querySelector('div');
    imgContainer?.appendChild(img);
    
    // 重新绑定事件
    content.querySelector('#backBtn')?.addEventListener('click', () => {
      location.reload(); // 简单重新加载
    });
    
    content.querySelector('#closeModal2')?.addEventListener('click', closeModal);
  });
  
  // 关闭模态框
  const closeModal = () => {
    try {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn('清理模态框资源失败:', e);
    }
  };
  
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // ESC键关闭
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
};

// 真实的图片导出函数 - 带下载确认机制
export const exportCardAsImageWithDialog = async (
  cardElement: HTMLElement, 
  card: Card,
  onProgress?: ProgressCallback,
  onSuccess?: SuccessCallback
): Promise<void> => {
  console.log('=== 开始真实图片导出 ===');
  console.log('卡片标题:', card?.title);
  
  try {
    // 基本检查
    if (!cardElement) {
      throw new Error('卡片元素不存在');
    }
    
    onProgress?.(10, '正在生成图片...');
    
    // 生成图片
    const canvas = await html2canvas(cardElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: false,
      width: cardElement.offsetWidth,
      height: cardElement.offsetHeight
    });
    
    onProgress?.(50, '正在处理图片...');
    
    // 生成文件名
    const fileName = `${(card.title || 'card').replace(/[^\w\u4e00-\u9fa5\-]/g, '_')}_${Date.now()}.png`;
    
    onProgress?.(70, '正在准备下载...');
    
    // 转换为blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        try {
          if (!blob) {
            reject(new Error('图片生成失败'));
            return;
          }
          
          onProgress?.(90, '正在检测下载权限...');
          
          // 检测下载权限
          const hasPermission = await checkDownloadPermission();
          
          onProgress?.(100, '准备下载选项...');
          
          if (hasPermission) {
            // 有权限，直接尝试下载
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = fileName;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            
            // 短暂延迟后清理并显示指导
            setTimeout(() => {
              try {
                if (document.body.contains(link)) {
                  document.body.removeChild(link);
                }
                URL.revokeObjectURL(url);
              } catch (e) {
                console.warn('清理下载链接失败:', e);
              }
              
              // 显示下载指导界面
              showDownloadGuidance(fileName, blob);
            }, 500);
          } else {
            // 没有权限，直接显示指导界面
            showDownloadGuidance(fileName, blob);
          }
          
          // 不再显示虚假的成功提示
          // 让用户通过指导界面确认下载
          resolve();
          
        } catch (error) {
          console.error('下载过程中出错:', error);
          reject(error);
        }
      }, 'image/png', 0.95);
    });
    
  } catch (error) {
    console.error('导出过程失败:', error);
    throw new Error(`导出失败: ${error.message || '未知错误，请重试'}`);
  }
};

// 导出卡片为JSON
export const exportCardAsJSON = (card: Card): string => {
  return JSON.stringify(card, null, 2);
};

// 从JSON导入卡片
export const importCardFromJSON = (jsonString: string): Card | null => {
  try {
    const data = JSON.parse(jsonString);
    
    // 验证必要字段
    if (!data.id || !data.title || !data.content) {
      return null;
    }
    
    // 确保日期字段是Date对象
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      style: { ...createDefaultStyle(), ...data.style },
    };
  } catch {
    return null;
  }
};

// 搜索卡片
export const searchCards = (
  cards: Card[],
  query: string,
  filters?: {
    template?: string;
    dateRange?: { start?: Date; end?: Date };
  }
): Card[] => {
  let filtered = cards;
  
  // 文本搜索
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filtered = filtered.filter(
      (card) =>
        card.title.toLowerCase().includes(searchTerm) ||
        card.summary.toLowerCase().includes(searchTerm) ||
        card.content.toLowerCase().includes(searchTerm) ||
        card.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm))
    );
  }
  
  // 模板筛选
  if (filters?.template) {
    filtered = filtered.filter((card) => card.template === filters.template);
  }
  
  // 日期范围筛选
  if (filters?.dateRange) {
    const { start, end } = filters.dateRange;
    if (start) {
      filtered = filtered.filter((card) => card.createdAt >= start);
    }
    if (end) {
      filtered = filtered.filter((card) => card.createdAt <= end);
    }
  }
  
  return filtered;
};

// 排序卡片
export const sortCards = (cards: Card[], sortBy: string): Card[] => {
  const sorted = [...cards];
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    case 'oldest':
      return sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
    case 'updated':
      return sorted.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    default:
      return sorted;
  }
};