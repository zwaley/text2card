import { create } from 'zustand';
import { Card, Template, AIAnalysisResult, InputContent, CreateStep, ViewMode, SortOption, FilterOptions } from '../types';
import { getAllCards, getRecentCards, saveCard, deleteCard, deleteCards, getCardById } from '../utils/storage';
import { getAllTemplates } from '../utils/templates';
import { analyzeContent } from '../utils/aiAnalysis';

// 应用主状态
interface AppState {
  // 卡片相关
  cards: Card[];
  currentCard: Card | null;
  recentCards: Card[];
  
  // 模板相关
  templates: Template[];
  
  // UI状态
  isLoading: boolean;
  error: string | null;
  
  // 操作方法
  loadCards: () => void;
  loadRecentCards: () => void;
  loadTemplates: () => void;
  setCurrentCard: (card: Card | null) => void;
  addCard: (card: Card) => Promise<boolean>;
  updateCard: (id: string, updates: Partial<Card>) => Promise<boolean>;
  removeCard: (id: string) => Promise<boolean>;
  removeCards: (ids: string[]) => Promise<boolean>;
  setError: (error: string | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // 初始状态
  cards: [],
  currentCard: null,
  recentCards: [],
  templates: [],
  isLoading: false,
  error: null,
  
  // 加载卡片
  loadCards: () => {
    try {
      const cards = getAllCards();
      set({ cards });
    } catch (error) {
      console.error('加载卡片失败:', error);
      set({ error: '加载卡片失败' });
    }
  },
  
  // 加载最近卡片
  loadRecentCards: () => {
    try {
      const recentCards = getRecentCards();
      set({ recentCards });
    } catch (error) {
      console.error('加载最近卡片失败:', error);
    }
  },
  
  // 加载模板
  loadTemplates: () => {
    try {
      const templates = getAllTemplates();
      set({ templates });
    } catch (error) {
      console.error('加载模板失败:', error);
      set({ error: '加载模板失败' });
    }
  },
  
  // 设置当前卡片
  setCurrentCard: (card) => {
    set({ currentCard: card });
  },
  
  // 添加卡片
  addCard: async (card) => {
    try {
      const success = saveCard(card);
      if (success) {
        const { cards } = get();
        set({ cards: [...cards, card] });
        get().loadRecentCards(); // 更新最近卡片
        return true;
      }
      return false;
    } catch (error) {
      console.error('添加卡片失败:', error);
      set({ error: '添加卡片失败' });
      return false;
    }
  },
  
  // 更新卡片
  updateCard: async (id, updates) => {
    try {
      const { cards } = get();
      const cardIndex = cards.findIndex(card => card.id === id);
      
      if (cardIndex === -1) {
        set({ error: '卡片不存在' });
        return false;
      }
      
      const updatedCard = {
        ...cards[cardIndex],
        ...updates,
        updatedAt: new Date(),
      };
      
      const success = saveCard(updatedCard);
      if (success) {
        const newCards = [...cards];
        newCards[cardIndex] = updatedCard;
        set({ cards: newCards });
        
        // 如果更新的是当前卡片，也要更新currentCard
        const { currentCard } = get();
        if (currentCard && currentCard.id === id) {
          set({ currentCard: updatedCard });
        }
        
        get().loadRecentCards(); // 更新最近卡片
        return true;
      }
      return false;
    } catch (error) {
      console.error('更新卡片失败:', error);
      set({ error: '更新卡片失败' });
      return false;
    }
  },
  
  // 删除卡片
  removeCard: async (id) => {
    try {
      const success = deleteCard(id);
      if (success) {
        const { cards, currentCard } = get();
        const newCards = cards.filter(card => card.id !== id);
        set({ cards: newCards });
        
        // 如果删除的是当前卡片，清空currentCard
        if (currentCard && currentCard.id === id) {
          set({ currentCard: null });
        }
        
        get().loadRecentCards(); // 更新最近卡片
        return true;
      }
      return false;
    } catch (error) {
      console.error('删除卡片失败:', error);
      set({ error: '删除卡片失败' });
      return false;
    }
  },
  
  // 批量删除卡片
  removeCards: async (ids) => {
    try {
      const success = deleteCards(ids);
      if (success) {
        const { cards, currentCard } = get();
        const newCards = cards.filter(card => !ids.includes(card.id));
        set({ cards: newCards });
        
        // 如果删除的包含当前卡片，清空currentCard
        if (currentCard && ids.includes(currentCard.id)) {
          set({ currentCard: null });
        }
        
        get().loadRecentCards(); // 更新最近卡片
        return true;
      }
      return false;
    } catch (error) {
      console.error('批量删除卡片失败:', error);
      set({ error: '批量删除卡片失败' });
      return false;
    }
  },
  
  // 设置错误
  setError: (error) => {
    set({ error });
  },

  // 清除错误
  clearError: () => {
    set({ error: null });
  },

  // 设置加载状态
  setLoading: (isLoading) => {
    set({ isLoading });
  },
}));

// 创建页面状态
interface CreateState {
  step: CreateStep;
  inputContent: InputContent | null;
  analysisResult: AIAnalysisResult | null;
  selectedTemplate: Template | null;
  previewCard: Card | null;
  isAnalyzing: boolean;
  
  setStep: (step: CreateStep) => void;
  setInputContent: (content: InputContent | null) => void;
  setAnalysisResult: (result: AIAnalysisResult | null) => void;
  setSelectedTemplate: (template: Template | null) => void;
  setPreviewCard: (card: Card | null) => void;
  analyzeInput: () => Promise<boolean>;
  resetCreate: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const useCreateStore = create<CreateState>((set, get) => ({
  step: 'input',
  inputContent: null,
  analysisResult: null,
  selectedTemplate: null,
  previewCard: null,
  isAnalyzing: false,
  
  setStep: (step) => set({ step }),
  
  setInputContent: (inputContent) => set({ inputContent }),
  
  setAnalysisResult: (analysisResult) => set({ analysisResult }),
  
  setSelectedTemplate: (selectedTemplate) => {
    set({ selectedTemplate });
    
    // 如果有分析结果和选中的模板，生成预览卡片
    const { analysisResult } = get();
    if (analysisResult && selectedTemplate) {
      const previewCard: Card = {
        id: 'preview',
        title: analysisResult.title,
        summary: analysisResult.summary,
        content: analysisResult.content,
        keywords: analysisResult.keywords,
        template: selectedTemplate.id,
        style: { ...selectedTemplate.style },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      set({ previewCard });
    }
  },
  
  setPreviewCard: (previewCard) => set({ previewCard }),
  
  analyzeInput: async () => {
    const { inputContent } = get();
    if (!inputContent) {
      return false;
    }
    
    set({ isAnalyzing: true });
    
    try {
      const result = await analyzeContent(inputContent);
      set({ analysisResult: result, isAnalyzing: false });
      return true;
    } catch (error) {
      console.error('分析失败:', error);
      set({ isAnalyzing: false });
      useAppStore.getState().setError(error instanceof Error ? error.message : '分析失败');
      return false;
    }
  },
  
  resetCreate: () => {
    set({
      step: 'input',
      inputContent: null,
      analysisResult: null,
      selectedTemplate: null,
      previewCard: null,
      isAnalyzing: false,
    });
  },
  
  nextStep: () => {
    const { step } = get();
    const steps: CreateStep[] = ['input', 'analysis', 'template', 'preview'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      set({ step: steps[currentIndex + 1] });
    }
  },
  
  prevStep: () => {
    const { step } = get();
    const steps: CreateStep[] = ['input', 'analysis', 'template', 'preview'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      set({ step: steps[currentIndex - 1] });
    }
  },
}));

// 编辑页面状态
interface EditState {
  card: Card | null;
  originalCard: Card | null;
  isModified: boolean;
  isSaving: boolean;
  
  setCard: (card: Card | null) => void;
  updateCardField: (field: keyof Card, value: string | string[] | Date) => void;
  updateCardStyle: (styleUpdates: Partial<Card['style']>) => void;
  saveChanges: () => Promise<boolean>;
  discardChanges: () => void;
  loadCard: (id: string) => boolean;
}

export const useEditStore = create<EditState>((set, get) => ({
  card: null,
  originalCard: null,
  isModified: false,
  isSaving: false,
  
  setCard: (card) => {
    set({ 
      card, 
      originalCard: card ? { ...card } : null, 
      isModified: false 
    });
  },
  
  updateCardField: (field, value) => {
    const { card } = get();
    if (!card) return;
    
    const updatedCard = { ...card, [field]: value };
    set({ card: updatedCard, isModified: true });
  },
  
  updateCardStyle: (styleUpdates) => {
    const { card } = get();
    if (!card) return;
    
    const updatedCard = {
      ...card,
      style: { ...card.style, ...styleUpdates },
    };
    set({ card: updatedCard, isModified: true });
  },
  
  saveChanges: async () => {
    const { card } = get();
    if (!card) return false;
    
    set({ isSaving: true });
    
    try {
      const success = await useAppStore.getState().updateCard(card.id, card);
      if (success) {
        set({ 
          originalCard: { ...card }, 
          isModified: false, 
          isSaving: false 
        });
        return true;
      }
      set({ isSaving: false });
      return false;
    } catch (error) {
      console.error('保存失败:', error);
      set({ isSaving: false });
      return false;
    }
  },
  
  discardChanges: () => {
    const { originalCard } = get();
    if (originalCard) {
      set({ 
        card: { ...originalCard }, 
        isModified: false 
      });
    }
  },
  
  loadCard: (id) => {
    try {
      const card = getCardById(id);
      if (card) {
        get().setCard(card);
        return true;
      }
      return false;
    } catch (error) {
      console.error('加载卡片失败:', error);
      return false;
    }
  },
}));

// 作品集页面状态
interface PortfolioState {
  viewMode: ViewMode;
  sortBy: SortOption;
  filters: FilterOptions;
  selectedCards: string[];
  
  setViewMode: (mode: ViewMode) => void;
  setSortBy: (sort: SortOption) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  setSelectedCards: (ids: string[]) => void;
  toggleCardSelection: (id: string) => void;
  selectAllCards: (cardIds: string[]) => void;
  clearSelection: () => void;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  viewMode: 'grid',
  sortBy: 'newest',
  filters: {
    search: '',
    template: '',
    dateRange: {},
  },
  selectedCards: [],
  
  setViewMode: (viewMode) => set({ viewMode }),
  
  setSortBy: (sortBy) => set({ sortBy }),
  
  setFilters: (filterUpdates) => {
    const { filters } = get();
    set({ filters: { ...filters, ...filterUpdates } });
  },
  
  setSelectedCards: (selectedCards) => set({ selectedCards }),
  
  toggleCardSelection: (id) => {
    const { selectedCards } = get();
    const newSelection = selectedCards.includes(id)
      ? selectedCards.filter(cardId => cardId !== id)
      : [...selectedCards, id];
    set({ selectedCards: newSelection });
  },
  
  selectAllCards: (cardIds) => {
    set({ selectedCards: [...cardIds] });
  },
  
  clearSelection: () => {
    set({ selectedCards: [] });
  },
}));