// 卡片相关类型定义
export interface Card {
  id: string;
  title: string;
  summary: string;
  content: string;
  keywords: string[];
  style: CardStyle;
  template: string;
  createdAt: Date;
  updatedAt: Date;
}

// 卡片样式类型
export interface CardStyle {
  backgroundColor: string;
  textColor: string;
  titleColor: string;
  fontSize: number;
  titleSize?: number;
  fontFamily: string;
  fontWeight?: string | number;
  lineHeight?: number;
  borderRadius: number;
  borderStyle?: string;
  borderColor?: string;
  borderWidth?: number;
  border?: {
    width: number;
    style: string;
    color: string;
  };
  shadow: string;
  padding: number;
  backgroundImage?: string;
  gradient?: {
    from: string;
    to: string;
    direction: string;
  };
}

// 模板类型
export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  style: CardStyle;
  category: string;
}

// AI分析结果类型
export interface AIAnalysisResult {
  title: string;
  summary: string;
  keywords: string[];
  content: string;
  suggestedTemplate?: string;
}

// 输入内容类型
export interface InputContent {
  type: 'text' | 'url' | 'file';
  content: string;
  fileName?: string;
  file?: File;
}

// 创建步骤类型
export type CreateStep = 'input' | 'analysis' | 'template' | 'preview';

// 视图模式类型
export type ViewMode = 'grid' | 'list';

// 排序选项类型
export type SortOption = 'newest' | 'oldest' | 'title' | 'updated';

// 筛选选项类型
export interface FilterOptions {
  search: string;
  template: string;
  dateRange: {
    start?: Date;
    end?: Date;
  };
}

// 导出格式类型
export type ExportFormat = 'json' | 'png' | 'jpg' | 'pdf';

// 按钮组件属性类型
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

// 应用状态类型
export interface AppState {
  cards: Card[];
  currentCard: Card | null;
  recentCards: Card[];
  templates: Template[];
  isLoading: boolean;
  error: string | null;
}

// 创建状态类型
export interface CreateState {
  step: CreateStep;
  inputContent: InputContent | null;
  analysisResult: AIAnalysisResult | null;
  selectedTemplate: Template | null;
  previewCard: Card | null;
}

// 编辑状态类型
export interface EditState {
  card: Card | null;
  isModified: boolean;
  isSaving: boolean;
}

// 作品集状态类型
export interface PortfolioState {
  viewMode: ViewMode;
  sortBy: SortOption;
  filters: FilterOptions;
  selectedCards: string[];
}