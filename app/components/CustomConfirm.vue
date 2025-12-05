<template>
  <Transition name="fade">
    <div v-if="isVisible" class="custom-confirm-overlay" @click="handleOverlayClick">
      <div class="custom-confirm-container" @click.stop>
        <!-- 弹窗头部 -->
        <div class="custom-confirm-header">
          <h3 class="custom-confirm-title">{{ title }}</h3>
        </div>
        
        <!-- 弹窗内容 -->
        <div class="custom-confirm-content">
          <p class="custom-confirm-message">{{ message }}</p>
        </div>
        
        <!-- 弹窗按钮 -->
        <div class="custom-confirm-actions">
          <button 
            class="custom-confirm-btn custom-confirm-btn-cancel" 
            @click="handleCancel"
          >
            {{ cancelText }}
          </button>
          <button 
            class="custom-confirm-btn custom-confirm-btn-confirm" 
            @click="handleConfirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
// 定义组件属性
const props = defineProps<{
  isVisible: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}>()

// 定义事件
const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

// 处理确认按钮点击
const handleConfirm = () => {
  emit('confirm')
}

// 处理取消按钮点击
const handleCancel = () => {
  emit('cancel')
}

// 处理点击遮罩层
const handleOverlayClick = () => {
  emit('cancel')
}
</script>

<style scoped>
/* 淡入淡出过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 遮罩层 */
.custom-confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
  padding: 1rem;
}

/* 弹窗容器 */
.custom-confirm-container {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-xl), 0 20px 40px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  overflow: hidden;
  transition: transform 0.2s ease;
  animation: scaleIn 0.2s ease-out;
}

/* 缩放进入动画 */
@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 弹窗头部 */
.custom-confirm-header {
  padding: 1.5rem 1.5rem 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.custom-confirm-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
}

/* 弹窗内容 */
.custom-confirm-content {
  padding: 1.5rem;
}

.custom-confirm-message {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* 弹窗按钮 */
.custom-confirm-actions {
  display: flex;
  gap: 0.75rem;
  padding: 0 1.5rem 1.5rem;
  justify-content: flex-end;
}

.custom-confirm-btn {
  padding: 0.625rem 1.5rem;
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border-color);
  outline: none;
  min-height: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* 取消按钮样式 */
.custom-confirm-btn-cancel {
  background: var(--bg-card);
  color: var(--text-secondary);
}

.custom-confirm-btn-cancel:hover {
  background: var(--bg-hover);
  border-color: var(--accent-primary);
  color: var(--accent-tertiary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 确认按钮样式 */
.custom-confirm-btn-confirm {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  border-color: var(--accent-primary);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.custom-confirm-btn-confirm:hover {
  background: linear-gradient(135deg, var(--accent-secondary), var(--accent-tertiary));
  border-color: var(--accent-secondary);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(129, 140, 248, 0.4);
}

/* 按钮:active 状态 */
.custom-confirm-btn:active {
  transform: translateY(0);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .custom-confirm-container {
    border-radius: var(--radius-lg);
  }
  
  .custom-confirm-header {
    padding: 1.25rem 1.25rem 0.75rem;
  }
  
  .custom-confirm-content {
    padding: 1.25rem;
  }
  
  .custom-confirm-actions {
    padding: 0 1.25rem 1.25rem;
    gap: 0.5rem;
  }
  
  .custom-confirm-btn {
    padding: 0.5rem 1.25rem;
    font-size: 0.8125rem;
  }
  
  .custom-confirm-title {
    font-size: 1rem;
  }
  
  .custom-confirm-message {
    font-size: 0.8125rem;
  }
}

/* 深色主题优化 */
:deep(.dark) .custom-confirm-container {
  background: var(--bg-card);
  border-color: var(--border-color);
}

:deep(.dark) .custom-confirm-btn-cancel {
  background: var(--bg-card);
  color: var(--text-secondary);
}

:deep(.dark) .custom-confirm-btn-cancel:hover {
  background: var(--bg-hover);
  border-color: var(--accent-primary);
  color: var(--accent-tertiary);
}
</style>