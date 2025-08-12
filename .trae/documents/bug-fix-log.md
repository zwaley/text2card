# Bug修复日志

## 2024年图片导出功能修复

### 问题描述
用户反馈在主应用（localhost:5175）中无法看到图片导出按钮，导出功能无法使用。但在独立测试页面（test-image-export.html）中功能正常。

### 问题分析
1. **根本原因**: CardPreview组件中的导出按钮使用了`opacity-0 group-hover:opacity-100`的CSS类
2. **具体问题**: 
   - 按钮默认完全透明（opacity-0）
   - 只有在hover到父级group元素时才显示
   - 用户很难发现这些隐藏的按钮

### 解决方案
1. **修改CardPreview.tsx**:
   - 将`opacity-0 group-hover:opacity-100`改为`opacity-80 hover:opacity-100`
   - 让按钮默认半透明显示，hover时完全显示

2. **修改Home.tsx**:
   - 移除group类的依赖
   - 将`group-hover:scale-105`改为`hover:scale-105`
   - 简化hover效果的实现

### 修复文件
- `src/components/CardPreview.tsx`: 修改按钮显示逻辑
- `src/pages/Home.tsx`: 移除group类依赖

### 测试验证
- 开发服务器运行在: http://localhost:5175/
- 导出按钮现在默认可见（半透明状态）
- hover时按钮变为完全不透明
- 图片导出功能正常工作

### 经验总结
1. **UI可见性**: 重要功能的按钮不应该完全隐藏，至少要有视觉提示
2. **用户体验**: 用户不应该需要"发现"功能，功能应该是显而易见的
3. **测试方法**: 独立测试页面有助于隔离问题，确定是UI显示问题还是功能逻辑问题

### 预防措施
- 在设计UI时考虑功能的可发现性
- 重要操作按钮应该有明显的视觉提示
- 定期进行用户体验测试
