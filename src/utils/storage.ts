import { Card } from '../types';

// 存储键名常量
const STORAGE_KEYS = {
  CARDS: 'text2card_cards',
  RECENT_CARDS: 'text2card_recent_cards',
  SETTINGS: 'text2card_settings',
} as const;

// 最大最近卡片数量
const MAX_RECENT_CARDS = 10;

// 序列化卡片数据（处理Date对象）
const serializeCard = (card: Card): Record<string, unknown> => {
  return {
    ...card,
    createdAt: card.createdAt.toISOString(),
    updatedAt: card.updatedAt.toISOString(),
  };
};

// 反序列化卡片数据（恢复Date对象）
const deserializeCard = (cardData: Record<string, unknown>): Card => {
  return {
    ...cardData,
    createdAt: new Date(cardData.createdAt as string),
    updatedAt: new Date(cardData.updatedAt as string),
  } as Card;
};

// 保存单个卡片
export const saveCard = (card: Card): boolean => {
  try {
    const cards = getAllCards();
    const existingIndex = cards.findIndex(c => c.id === card.id);
    
    if (existingIndex >= 0) {
      // 更新现有卡片
      cards[existingIndex] = card;
    } else {
      // 添加新卡片
      cards.push(card);
    }
    
    // 保存到localStorage
    const serializedCards = cards.map(serializeCard);
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(serializedCards));
    
    // 更新最近卡片列表
    updateRecentCards(card);
    
    return true;
  } catch (error) {
    console.error('保存卡片失败:', error);
    return false;
  }
};

// 获取所有卡片
export const getAllCards = (): Card[] => {
  try {
    const cardsData = localStorage.getItem(STORAGE_KEYS.CARDS);
    if (!cardsData) return [];
    
    const serializedCards = JSON.parse(cardsData);
    return serializedCards.map(deserializeCard);
  } catch (error) {
    console.error('获取卡片失败:', error);
    return [];
  }
};

// 根据ID获取卡片
export const getCardById = (id: string): Card | null => {
  try {
    const cards = getAllCards();
    return cards.find(card => card.id === id) || null;
  } catch (error) {
    console.error('获取卡片失败:', error);
    return null;
  }
};

// 删除卡片
export const deleteCard = (id: string): boolean => {
  try {
    const cards = getAllCards();
    const filteredCards = cards.filter(card => card.id !== id);
    
    const serializedCards = filteredCards.map(serializeCard);
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(serializedCards));
    
    // 从最近卡片中移除
    removeFromRecentCards(id);
    
    return true;
  } catch (error) {
    console.error('删除卡片失败:', error);
    return false;
  }
};

// 批量删除卡片
export const deleteCards = (ids: string[]): boolean => {
  try {
    const cards = getAllCards();
    const filteredCards = cards.filter(card => !ids.includes(card.id));
    
    const serializedCards = filteredCards.map(serializeCard);
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(serializedCards));
    
    // 从最近卡片中移除
    ids.forEach(removeFromRecentCards);
    
    return true;
  } catch (error) {
    console.error('批量删除卡片失败:', error);
    return false;
  }
};

// 获取最近卡片
export const getRecentCards = (): Card[] => {
  try {
    const recentData = localStorage.getItem(STORAGE_KEYS.RECENT_CARDS);
    if (!recentData) return [];
    
    const recentIds = JSON.parse(recentData);
    const allCards = getAllCards();
    
    // 根据ID顺序返回卡片，过滤掉不存在的卡片
    return recentIds
      .map((id: string) => allCards.find(card => card.id === id))
      .filter((card: Card | undefined): card is Card => card !== undefined);
  } catch (error) {
    console.error('获取最近卡片失败:', error);
    return [];
  }
};

// 更新最近卡片列表
const updateRecentCards = (card: Card): void => {
  try {
    let recentIds = getRecentCardIds();
    
    // 移除已存在的ID
    recentIds = recentIds.filter(id => id !== card.id);
    
    // 添加到开头
    recentIds.unshift(card.id);
    
    // 限制数量
    recentIds = recentIds.slice(0, MAX_RECENT_CARDS);
    
    localStorage.setItem(STORAGE_KEYS.RECENT_CARDS, JSON.stringify(recentIds));
  } catch (error) {
    console.error('更新最近卡片失败:', error);
  }
};

// 从最近卡片中移除
const removeFromRecentCards = (cardId: string): void => {
  try {
    let recentIds = getRecentCardIds();
    recentIds = recentIds.filter(id => id !== cardId);
    localStorage.setItem(STORAGE_KEYS.RECENT_CARDS, JSON.stringify(recentIds));
  } catch (error) {
    console.error('从最近卡片中移除失败:', error);
  }
};

// 获取最近卡片ID列表
const getRecentCardIds = (): string[] => {
  try {
    const recentData = localStorage.getItem(STORAGE_KEYS.RECENT_CARDS);
    return recentData ? JSON.parse(recentData) : [];
  } catch (error) {
    console.error('获取最近卡片ID失败:', error);
    return [];
  }
};

// 导出所有卡片数据
export const exportAllCards = (): string => {
  const cards = getAllCards();
  return JSON.stringify({
    version: '1.0',
    exportDate: new Date().toISOString(),
    cards: cards.map(card => ({
      ...card,
      createdAt: card.createdAt.toISOString(),
      updatedAt: card.updatedAt.toISOString(),
    })),
  }, null, 2);
};

// 导入卡片数据
export const importCards = (jsonData: string): { success: boolean; imported: number; errors: string[] } => {
  const result = {
    success: false,
    imported: 0,
    errors: [] as string[],
  };
  
  try {
    const data = JSON.parse(jsonData);
    
    if (!data.cards || !Array.isArray(data.cards)) {
      result.errors.push('无效的数据格式');
      return result;
    }
    
    const existingCards = getAllCards();
    const existingIds = new Set(existingCards.map(card => card.id));
    
    for (const cardData of data.cards) {
      try {
        // 验证必要字段
        if (!cardData.id || !cardData.title || !cardData.content) {
          result.errors.push(`卡片数据不完整: ${cardData.title || '未知标题'}`);
          continue;
        }
        
        // 如果ID已存在，生成新ID
        if (existingIds.has(cardData.id)) {
          cardData.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        }
        
        const card = deserializeCard(cardData);
        
        if (saveCard(card)) {
          result.imported++;
          existingIds.add(card.id);
        } else {
          result.errors.push(`保存卡片失败: ${card.title}`);
        }
      } catch {
        result.errors.push(`处理卡片失败: ${cardData.title || '未知标题'}`);
      }
    }
    
    result.success = result.imported > 0;
    return result;
  } catch {
    result.errors.push('解析JSON数据失败');
    return result;
  }
};

// 清空所有数据
export const clearAllData = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CARDS);
    localStorage.removeItem(STORAGE_KEYS.RECENT_CARDS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    return true;
  } catch (error) {
    console.error('清空数据失败:', error);
    return false;
  }
};

// 获取存储使用情况
export const getStorageInfo = () => {
  try {
    const cards = getAllCards();
    const cardsSize = new Blob([localStorage.getItem(STORAGE_KEYS.CARDS) || '']).size;
    const recentSize = new Blob([localStorage.getItem(STORAGE_KEYS.RECENT_CARDS) || '']).size;
    const settingsSize = new Blob([localStorage.getItem(STORAGE_KEYS.SETTINGS) || '']).size;
    
    return {
      totalCards: cards.length,
      storageSize: {
        cards: cardsSize,
        recent: recentSize,
        settings: settingsSize,
        total: cardsSize + recentSize + settingsSize,
      },
    };
  } catch (error) {
    console.error('获取存储信息失败:', error);
    return {
      totalCards: 0,
      storageSize: {
        cards: 0,
        recent: 0,
        settings: 0,
        total: 0,
      },
    };
  }
};