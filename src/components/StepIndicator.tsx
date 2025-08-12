import React from 'react';
import { CreateStep } from '../types';

interface StepIndicatorProps {
  currentStep: CreateStep;
  onStepClick?: (step: CreateStep) => void;
  className?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onStepClick,
  className = '',
}) => {
  const steps = [
    {
      id: 'input' as CreateStep,
      name: '输入内容',
      description: '输入文本、链接或上传文件',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      id: 'analysis' as CreateStep,
      name: 'AI分析',
      description: '智能提取关键信息',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      id: 'template' as CreateStep,
      name: '选择模板',
      description: '选择合适的卡片样式',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
    },
    {
      id: 'preview' as CreateStep,
      name: '预览保存',
      description: '预览效果并保存卡片',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className={`w-full ${className}`}>
      {/* 桌面端水平布局 */}
      <div className="hidden md:block">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, stepIdx) => {
              const isCompleted = stepIdx < currentStepIndex;
              const isCurrent = stepIdx === currentStepIndex;
              const isClickable = onStepClick && (isCompleted || isCurrent);

              return (
                <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                  {/* 连接线 */}
                  {stepIdx !== steps.length - 1 && (
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className={`h-0.5 w-full ${isCompleted ? 'bg-blue-600' : 'bg-gray-200'}`} />
                    </div>
                  )}

                  {/* 步骤圆圈 */}
                  <div
                    className={`
                      relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200
                      ${
                        isCompleted
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : isCurrent
                          ? 'border-2 border-blue-600 bg-white'
                          : 'border-2 border-gray-300 bg-white hover:border-gray-400'
                      }
                      ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                    `}
                    onClick={() => isClickable && onStepClick(step.id)}
                  >
                    {isCompleted ? (
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <div className={`${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}>
                        {step.icon}
                      </div>
                    )}
                  </div>

                  {/* 步骤信息 */}
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center">
                    <div
                      className={`
                        text-sm font-medium
                        ${
                          isCompleted || isCurrent
                            ? 'text-blue-600'
                            : 'text-gray-500'
                        }
                      `}
                    >
                      {step.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 max-w-24">
                      {step.description}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* 移动端垂直布局 */}
      <div className="md:hidden">
        <nav aria-label="Progress">
          <ol className="space-y-4">
            {steps.map((step, stepIdx) => {
              const isCompleted = stepIdx < currentStepIndex;
              const isCurrent = stepIdx === currentStepIndex;
              const isClickable = onStepClick && (isCompleted || isCurrent);

              return (
                <li key={step.id} className="relative">
                  <div
                    className={`
                      flex items-center p-3 rounded-lg transition-all duration-200
                      ${
                        isCurrent
                          ? 'bg-blue-50 border border-blue-200'
                          : isCompleted
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50 border border-gray-200'
                      }
                      ${isClickable ? 'cursor-pointer hover:shadow-md' : 'cursor-default'}
                    `}
                    onClick={() => isClickable && onStepClick(step.id)}
                  >
                    {/* 步骤图标 */}
                    <div
                      className={`
                        flex h-8 w-8 items-center justify-center rounded-full mr-3
                        ${
                          isCompleted
                            ? 'bg-green-600'
                            : isCurrent
                            ? 'bg-blue-600'
                            : 'bg-gray-400'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="text-white">
                          {step.icon}
                        </div>
                      )}
                    </div>

                    {/* 步骤信息 */}
                    <div className="flex-1">
                      <div
                        className={`
                          text-sm font-medium
                          ${
                            isCurrent
                              ? 'text-blue-900'
                              : isCompleted
                              ? 'text-green-900'
                              : 'text-gray-900'
                          }
                        `}
                      >
                        {step.name}
                      </div>
                      <div
                        className={`
                          text-xs mt-1
                          ${
                            isCurrent
                              ? 'text-blue-700'
                              : isCompleted
                              ? 'text-green-700'
                              : 'text-gray-500'
                          }
                        `}
                      >
                        {step.description}
                      </div>
                    </div>

                    {/* 状态指示器 */}
                    {isCurrent && (
                      <div className="ml-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>

                  {/* 连接线（移动端） */}
                  {stepIdx !== steps.length - 1 && (
                    <div className="absolute left-6 top-14 w-0.5 h-4 bg-gray-200"></div>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default StepIndicator;