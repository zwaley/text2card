import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCreateStore, useAppStore } from '../store';
import StepIndicator from '../components/StepIndicator';
import CardPreview from '../components/CardPreview';
import { InlineLoading, PageLoading } from '../components/Loading';
import { analyzeContent } from '../utils/aiAnalysis';
import { getAllTemplates, getTemplateById } from '../utils/templates';
import { InputContent, Card, CardStyle } from '../types';

const Create: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addCard } = useAppStore();
  const {
    step: currentStep,
    inputContent,
    analysisResult,
    selectedTemplate,
    previewCard,
    setStep: setCurrentStep,
    setInputContent,
    setAnalysisResult,
    setSelectedTemplate,
    setPreviewCard,
    resetCreate: resetCreateState
  } = useCreateStore();

  // 手动管理isAnalyzing状态，因为store中没有setIsAnalyzing方法
  const [isAnalyzingLocal, setIsAnalyzingLocal] = useState(false);

  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [inputType, setInputType] = useState<'text' | 'url' | 'file'>('text');
  const [isSaving, setIsSaving] = useState(false);

  // 处理内容分析
  const handleAnalyze = useCallback(async (content?: InputContent) => {
    const contentToAnalyze = content || inputContent;
    if (!contentToAnalyze) return;

    setIsAnalyzingLocal(true);
    try {
      const result = await analyzeContent(contentToAnalyze);
      setAnalysisResult(result);
      setCurrentStep('template');
    } catch (error) {
      console.error('分析失败:', error);
      alert('内容分析失败，请重试');
    } finally {
      setIsAnalyzingLocal(false);
    }
  }, [inputContent, setAnalysisResult, setCurrentStep]);

  // 处理从首页传递的初始内容
  useEffect(() => {
    const state = location.state as { inputContent?: InputContent };
    if (state?.inputContent) {
      setInputContent(state.inputContent);
      setTextInput(state.inputContent.content);
      setInputType(state.inputContent.type as 'text' | 'url' | 'file');
      // 自动进行分析
      handleAnalyze(state.inputContent);
    }
  }, [location.state, setInputContent, handleAnalyze]);

  // 处理输入提交
  const handleInputSubmit = () => {
    let content: InputContent;
    
    switch (inputType) {
      case 'text':
        if (!textInput.trim()) {
          alert('请输入文本内容');
          return;
        }
        content = { type: 'text', content: textInput };
        break;
      case 'url':
        if (!urlInput.trim()) {
          alert('请输入URL地址');
          return;
        }
        content = { type: 'url', content: urlInput };
        break;
      case 'file':
        if (!fileInput) {
          alert('请选择文件');
          return;
        }
        content = { type: 'file', content: fileInput.name, file: fileInput };
        break;
      default:
        return;
    }
    
    setInputContent(content);
    handleAnalyze(content);
  };

  // 处理模板选择
  const handleTemplateSelect = (templateId: string) => {
    // 找到对应的模板对象
    const template = getAllTemplates().find(t => t.id === templateId);
    setSelectedTemplate(template || null);
    if (analysisResult) {
      // 创建预览卡片
      const card: Card = {
        id: `card_${Date.now()}`,
        title: analysisResult.title,
        summary: analysisResult.summary,
        content: analysisResult.content,
        keywords: analysisResult.keywords,
        template: templateId,
        style: {
          backgroundColor: getTemplateStyle(templateId).backgroundColor,
          textColor: getTemplateStyle(templateId).textColor,
          titleColor: getTemplateStyle(templateId).titleColor,
          fontSize: getTemplateStyle(templateId).fontSize,
          fontFamily: getTemplateStyle(templateId).fontFamily,
          borderRadius: getTemplateStyle(templateId).borderRadius,
          shadow: getTemplateStyle(templateId).shadow,
          padding: getTemplateStyle(templateId).padding,
          ...(getTemplateStyle(templateId).gradient && { gradient: getTemplateStyle(templateId).gradient }),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setPreviewCard(card);
      setCurrentStep('preview');
    }
  };

  // 获取模板样式
  const getTemplateStyle = (templateId: string): CardStyle & { gradient?: { from: string; to: string; direction: string } } => {
    const template = getTemplateById(templateId);
    if (template) {
      return template.style;
    }
    
    // 默认样式作为后备
    return {
      backgroundColor: '#ffffff',
      textColor: '#374151',
      titleColor: '#111827',
      fontSize: 14,
      fontFamily: 'Inter, sans-serif',
      borderRadius: 8,
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: 20,
    };
  };

  // 处理卡片保存
  const handleSaveCard = async () => {
    if (!previewCard) return;
    
    setIsSaving(true);
    try {
      await addCard(previewCard);
      alert('卡片保存成功！');
      navigate('/portfolio');
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  // 处理重新开始
  const handleRestart = () => {
    resetCreateState();
    setTextInput('');
    setUrlInput('');
    setFileInput(null);
    setInputType('text');
    setIsAnalyzingLocal(false);
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileInput(file);
    }
  };

  // 渲染输入步骤
  const renderInputStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">输入内容</h2>
        
        {/* 输入类型选择 */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setInputType('text')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
              inputType === 'text'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              文本
            </div>
          </button>
          <button
            onClick={() => setInputType('url')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
              inputType === 'url'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              链接
            </div>
          </button>
          <button
            onClick={() => setInputType('file')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
              inputType === 'file'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              文件
            </div>
          </button>
        </div>

        {/* 输入区域 */}
        <div className="mb-6">
          {inputType === 'text' && (
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="请输入您想要转换为卡片的文本内容..."
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          )}
          
          {inputType === 'url' && (
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="请输入网页链接地址..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
          
          {inputType === 'file' && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".txt,.md,.doc,.docx,.pdf"
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-600 mb-2">
                  {fileInput ? fileInput.name : '点击选择文件或拖拽文件到此处'}
                </p>
                <p className="text-sm text-gray-500">
                  支持 TXT、MD、DOC、DOCX、PDF 格式
                </p>
              </label>
            </div>
          )}
        </div>

        {/* 提交按钮 */}
        <button
          onClick={handleInputSubmit}
          disabled={isAnalyzingLocal}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        >
          {isAnalyzingLocal ? (
            <>
              <InlineLoading />
              <span className="ml-2">分析中...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              开始分析
            </>
          )}
        </button>
      </div>
    </div>
  );

  // 渲染分析步骤
  const renderAnalysisStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">AI分析结果</h2>
        
        {analysisResult && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">标题</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{analysisResult.title}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">摘要</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{analysisResult.summary}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">关键词</h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">推荐模板</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{analysisResult.suggestedTemplate}</p>
            </div>
          </div>
        )}
        
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setCurrentStep('input')}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            重新输入
          </button>
          <button
            onClick={() => setCurrentStep('template')}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            选择模板
          </button>
        </div>
      </div>
    </div>
  );

  // 渲染预览保存步骤
  const renderPreviewStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">预览卡片</h2>
        
        {previewCard && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <CardPreview
                card={previewCard}
                className="max-w-md"
              />
            </div>
            
            <div className="text-center text-gray-600">
              <p>卡片预览效果如上所示，您可以选择保存或返回修改。</p>
            </div>
          </div>
        )}
        
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setCurrentStep('template')}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            重选模板
          </button>
          <button
            onClick={handleRestart}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            重新开始
          </button>
          <button
            onClick={handleSaveCard}
            disabled={isSaving}
            className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isSaving ? (
              <>
                <InlineLoading />
                <span className="ml-2">保存中...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                保存卡片
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  if (isAnalyzingLocal && currentStep === 'input') {
    return <PageLoading text="正在分析内容..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">创建卡片</h1>
          <p className="text-gray-600">通过简单几步，将您的内容转换为精美卡片</p>
        </div>

        {/* 步骤指示器 */}
        <div className="mb-8">
          <StepIndicator
            currentStep={currentStep}
            onStepClick={(step) => {
              // 只允许向前跳转到已完成的步骤
              if (step === 'input' || 
                  (step === 'analysis' && analysisResult) ||
                  (step === 'template' && analysisResult) ||
                  (step === 'preview' && previewCard)) {
                setCurrentStep(step);
              }
            }}
          />
        </div>

        {/* 步骤内容 */}
        <div className="mb-8">
          {currentStep === 'input' && renderInputStep()}
          {currentStep === 'analysis' && renderAnalysisStep()}
          {currentStep === 'template' && (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">选择模板</h2>
                
                {analysisResult && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">AI推荐</h3>
                    <p className="text-blue-700">根据您的内容分析，推荐使用：{analysisResult.suggestedTemplate || 'default'} 模板</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {getAllTemplates().map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className={`cursor-pointer p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                        selectedTemplate?.id === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* 使用模板的实际样式预览 - 9:18竖图比例 */}
                      <div 
                        className="aspect-[9/18] rounded-lg mb-3 p-3 text-xs overflow-hidden flex flex-col"
                        style={{
                          backgroundColor: template.style.backgroundColor,
                          color: template.style.textColor,
                          fontFamily: template.style.fontFamily,
                          background: template.style.gradient 
                            ? `linear-gradient(${template.style.gradient.direction}, ${template.style.gradient.from}, ${template.style.gradient.to})`
                            : template.style.backgroundColor,
                          boxShadow: template.style.shadow,
                          borderRadius: `${template.style.borderRadius}px`
                        }}
                      >
                        <div 
                          className="font-bold mb-2"
                          style={{ 
                            color: template.style.titleColor,
                            fontSize: `${Math.max(template.style.fontSize - 2, 10)}px`
                          }}
                        >
                          示例标题
                        </div>
                        <div 
                          className="flex-1 overflow-hidden"
                          style={{ 
                            fontSize: `${Math.max(template.style.fontSize - 4, 8)}px`,
                            lineHeight: '1.3',
                            display: '-webkit-box',
                            WebkitLineClamp: 8,
                            WebkitBoxOrient: 'vertical',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          这是一个模板预览示例，展示了该模板的样式效果。内容会根据竖图比例进行适配，超出部分将以省略号显示。
                        </div>
                        <div className="mt-auto pt-2 text-center opacity-60" style={{ fontSize: '8px' }}>
                          预览效果
                        </div>
                      </div>
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                      <div className="mt-2">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {template.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {currentStep === 'preview' && renderPreviewStep()}
        </div>
      </div>
    </div>
  );
};

export default Create;