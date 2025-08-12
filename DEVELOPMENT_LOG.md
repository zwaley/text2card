# Text2Card 开发日志

## 2024年12月19日 - 卡片保存功能问题分析与重写

### 问题描述
用户反馈卡片保存功能存在严重问题：
1. 预览时卡片显示正常，但保存后跳转到编辑页面时效果完全不同
2. 保存后总是回到首页，没有正确跳转到编辑页面
3. 没有提供保存路径选择功能

### 问题分析

#### 1. 数据流分析
- **Create页面预览**：使用`previewCard`状态，通过`CardPreview`组件渲染
- **保存过程**：`handleSaveToStorage`函数将数据保存到localStorage并跳转到编辑页面
- **CardEdit页面加载**：从localStorage或currentCard加载数据，进行数据规范化处理

#### 2. 潜在问题点

**A. 数据序列化/反序列化问题**
```typescript
// Create页面保存时
const cardToSave: Card = {
  ...previewCard,
  createdAt: new Date(),
  updatedAt: new Date(),
  style: {
    backgroundColor: previewCard.style.backgroundColor || '#ffffff',
    // ... 其他样式属性
  }
};

// CardEdit页面加载时
const normalizedCard: Card = {
  ...foundCard,
  createdAt: new Date(foundCard.createdAt), // 日期反序列化
  updatedAt: new Date(foundCard.updatedAt),
  style: {
    backgroundColor: foundCard.style?.backgroundColor || '#ffffff',
    // ... 样式对象重建
  }
};
```

**B. 样式对象处理不一致**
- Create页面：直接使用模板样式或默认值
- CardEdit页面：从localStorage加载后重新构建样式对象
- CardPreview组件：再次应用默认值逻辑

**C. 状态管理问题**
- `currentCard`状态可能与localStorage数据不同步
- 页面跳转时状态传递可能丢失

#### 3. 根本原因
1. **多层默认值处理**：Create页面、CardEdit页面、CardPreview组件都有各自的默认值逻辑，可能导致不一致
2. **数据格式不统一**：JSON序列化后Date对象变成字符串，需要手动转换
3. **样式对象结构变化**：保存和加载过程中样式对象可能被重构，导致引用丢失

### 解决方案

#### 1. 统一数据处理
- 创建统一的数据规范化函数
- 确保所有页面使用相同的默认值逻辑
- 统一处理日期序列化/反序列化

#### 2. 重写保存功能
- 简化保存逻辑，减少数据转换步骤
- 确保保存的数据格式与加载时期望的格式完全一致
- 添加数据完整性验证

#### 3. 优化页面跳转
- 确保跳转前数据已正确保存
- 优化状态传递机制
- 添加错误处理和回退机制

### 实施计划
1. 创建数据规范化工具函数
2. 重写Create页面保存逻辑
3. 优化CardEdit页面加载逻辑
4. 统一CardPreview组件样式处理
5. 添加完整的错误处理和用户反馈
6. 测试验证修复效果