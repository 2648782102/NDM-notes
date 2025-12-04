<template>
  <div class="note-list-container">
    <div class="note-list-header">
      <div class="note-list-title">
        <p class="note-list-label">Collections</p>
        <h2 class="note-list-heading">笔记分类</h2>
      </div>
      <button class="btn-primary btn-new-note" @click="$emit('new-note')">
        <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        新建笔记
      </button>
    </div>

    <div class="note-list-panel">
      <div class="category-filter">
        <button
          class="category-tag"
          :class="{ 'category-tag-active': !activeCategory }"
          @click="$emit('filter-change', null)"
        >
          <svg class="category-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          全部
        </button>
        <TransitionGroup name="category" tag="div" class="category-list">
          <button
            v-for="cat in categories"
            :key="cat"
            class="category-tag"
            :class="{ 'category-tag-active': activeCategory === cat }"
            @click="$emit('filter-change', cat)"
          >
            <svg class="category-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
              <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
            </svg>
            {{ cat }}
          </button>
        </TransitionGroup>
      </div>

      <div class="note-list-content">
        <div v-if="loading" class="note-list-loading">
          <div v-for="i in 4" :key="i" class="note-skeleton" />
        </div>

        <TransitionGroup
          v-else
          name="note-item"
          tag="div"
          class="note-list-items"
        >
          <button
            v-for="note in filteredNotes"
            :key="note.id"
            class="note-item"
            :class="{ 'note-item-active': currentId === note.id }"
            @click="$emit('select', note.id)"
            @mouseenter="hoveredNoteId = note.id"
            @mouseleave="hoveredNoteId = null"
          >
            <div class="note-item-header">
              <p class="note-item-title">
                {{ note.title || '未命名笔记' }}
              </p>
              <span class="note-item-time">
                {{ formatTime(note.updatedAt) }}
              </span>
            </div>
            <p class="note-item-preview">
              {{ note.content || '（暂无内容）' }}
            </p>
            <div class="note-item-tags">
              <span v-if="note.category" class="note-tag note-tag-category">
                {{ note.category }}
              </span>
              <TransitionGroup name="note-tag" tag="div" class="note-tags-list">
                <span
                  v-for="tag in note.tags"
                  :key="tag"
                  class="note-tag"
                >
                  # {{ tag }}
                </span>
              </TransitionGroup>
            </div>
            <!-- 悬停效果 - 平滑的阴影变化 -->
            <div class="note-item-hover-effect" v-if="hoveredNoteId === note.id"></div>
          </button>

          <div
            v-if="!filteredNotes.length"
            key="empty"
            class="note-list-empty"
          >
            <div class="empty-state">
              <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <p class="empty-text">暂无笔记，点击右上角「新建笔记」开始记录吧～</p>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Note } from '~/composables/useNotes'

interface Props {
  notes: Note[]
  categories: string[]
  activeCategory: string | null
  currentId: string | null
  loading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'new-note': []
  'filter-change': [category: string | null]
  'select': [id: string]
}>()

const filteredNotes = computed(() => {
  if (!props.activeCategory) return props.notes
  return props.notes.filter((n) => n.category === props.activeCategory)
})

const hoveredNoteId = ref<string | null>(null)

const formatTime = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.note-list-container {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 0 0 360px;
  background: var(--bg-card);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(24px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
}

/* 移动端全屏布局 */
.notes-mobile-layout .note-list-container {
  flex: 1 1 auto;
  width: 100%;
  max-width: 100%;
  margin: 0;
  border-radius: 0;
  border: none;
  min-height: 0;
  height: 100%;
  box-shadow: none;
  background: transparent;
}

/* 移动端隐藏NoteList中的新建按钮，避免冗余 */
.notes-mobile-layout .note-list-header .btn-new-note {
  display: none;
}

/* 笔记列表面板容器 */
.note-list-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 笔记列表内容区域 */
.note-list-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  /* 优化滚动性能 */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  will-change: scroll-position;
  /* 启用硬件加速 */
  transform: translateZ(0);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .note-list-container {
    flex: 1 1 auto;
    width: 100%;
    margin: 0;
  }
  
  .note-list-content {
    padding: 0.5rem;
  }
  
  .note-item {
    padding: 0.875rem;
  }
}

@media (max-width: 768px) {
  .note-list-container {
    margin: 0;
    border-radius: 0;
  }
  
  .note-list-header {
    padding: 0.75rem 0.875rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .note-list-title {
    flex: 1 1 auto;
  }
  
  .btn-new-note {
    flex: 1 1 auto;
    justify-content: center;
  }
  
  .note-list-content {
    padding: 0.375rem;
  }
  
  .category-filter {
    padding: 0.625rem 0.875rem;
    gap: 0.375rem;
  }
  
  .category-list {
    gap: 0.375rem;
  }
  
  .category-tag {
    padding: 0.3125rem 0.75rem;
    font-size: 0.7rem;
  }
  
  .note-item {
    padding: 0.75rem;
    gap: 0.25rem;
  }
  
  .note-item-header {
    gap: 0.5rem;
  }
  
  .note-item-title {
    font-size: 0.8125rem;
  }
  
  .note-item-time {
    font-size: 0.65rem;
  }
  
  .note-item-preview {
    font-size: 0.7rem;
    -webkit-line-clamp: 1;
  }
  
  .note-item-tags {
    margin-top: 0.125rem;
    gap: 0.375rem;
  }
  
  .note-tags-list {
    gap: 0.375rem;
  }
  
  .note-tag {
    padding: 0.2125rem 0.625rem;
    font-size: 0.65rem;
  }
}

@media (max-width: 480px) {
  .note-list-content {
    /* max-height: 25vh; */
  }
  
  .note-item {
    padding: 0.625rem;
  }
  
  .note-item-preview {
    font-size: 0.6875rem;
  }
}

/* 移动端触摸反馈 */
@media (hover: none) and (pointer: coarse) {
  /* 按钮按下效果 */
  .btn-new-note:active,
  .category-tag:active,
  .note-item:active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }
  
  /* 按钮触摸高亮 */
  .btn-new-note,
  .category-tag,
  .note-item {
    -webkit-tap-highlight-color: rgba(99, 102, 241, 0.2);
    touch-action: manipulation;
  }
  
  /* 平滑滚动 */
  .note-list-content,
  .category-filter {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
  
  /* 优化点击区域 */
  .btn-new-note,
  .category-tag {
    min-height: 2.5rem;
  }
  
  /* 优化列表项触摸体验 */
  .note-item {
    cursor: pointer;
    min-height: 2.5rem;
    margin-bottom: 0.375rem;
  }
  
  /* 隐藏悬停效果 */
  .note-item:hover::before {
    left: -100%;
  }
  
  .note-item:hover .note-item-actions {
    display: none;
  }
  
  .note-item-active {
    box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.5), 0 2px 8px rgba(99, 102, 241, 0.15);
  }
}

.note-list-container:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.note-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  gap: 0.75rem;
  background: var(--bg-secondary);
}

.note-list-title {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.note-list-label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.note-list-container:hover .note-list-label {
  color: var(--accent-secondary);
}

.note-list-heading {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  transition: color 0.2s ease;
}

.note-list-container:hover .note-list-heading {
  color: var(--accent-tertiary);
}

/* 新建笔记按钮 */
.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 2.25rem;
  padding: 0 1rem;
  font-size: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid #6366f1;
  background-color: #6366f1;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.btn-primary:hover {
  background-color: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.btn-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.btn-primary:hover .btn-icon {
  transform: scale(1.1);
}

.note-list-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

.category-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.category-filter::-webkit-scrollbar {
  display: none;
}

.category-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  border-radius: 9999px;
  background-color: var(--bg-card);
  padding: 0.375rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  /* 确保触摸区域足够大 */
  min-height: 2rem;
  touch-action: manipulation;
}

.category-tag:hover {
  background-color: var(--bg-hover);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  transform: translateY(-1px);
}

.category-tag-active {
  background-color: var(--bg-hover);
  color: var(--accent-primary);
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.category-icon {
  width: 14px;
  height: 14px;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.category-tag:hover .category-icon,
.category-tag-active .category-icon {
  opacity: 1;
}

.note-list-content {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
  background: var(--bg-secondary);
  min-height: 0;
}

/* 滚动条样式 */
.note-list-content::-webkit-scrollbar {
  width: 8px;
}

.note-list-content::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.4);
  border-radius: 4px;
  margin: 0.5rem 0;
}

.note-list-content::-webkit-scrollbar-thumb {
  background: rgba(79, 70, 229, 0.4);
  border-radius: 4px;
  transition: background 0.2s ease;
}

.note-list-content::-webkit-scrollbar-thumb:hover {
  background: rgba(79, 70, 229, 0.6);
}

.note-list-loading {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.25rem;
}

.note-skeleton {
  height: 5rem;
  border-radius: 0.75rem;
  background: linear-gradient(90deg, rgba(30, 41, 59, 0.6) 25%, rgba(51, 65, 85, 0.6) 50%, rgba(30, 41, 59, 0.6) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.note-list-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* 笔记项动画 */
.note-item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
  padding: 0.875rem 1rem;
  text-align: left;
  border-radius: 0.75rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.note-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
  transition: left 0.5s ease;
}

.note-item:hover::before {
  left: 100%;
}

.note-item:hover {
  background-color: var(--bg-hover);
  border-color: var(--accent-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.note-item-active {
  background-color: var(--bg-hover);
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-accent);
}

/* 悬停效果 */
.note-item-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.05), transparent);
  pointer-events: none;
  animation: hoverShine 1.5s ease-in-out infinite;
}

@keyframes hoverShine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.note-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.note-item-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.note-item:hover .note-item-title,
.note-item-active .note-item-title {
  color: var(--accent-primary);
}

.note-item-time {
  font-size: 0.6875rem;
  color: var(--text-muted);
  white-space: nowrap;
  transition: color 0.2s ease;
}

.note-item:hover .note-item-time {
  color: var(--text-secondary);
}

.note-item-preview {
  font-size: 0.75rem;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.5;
  transition: color 0.2s ease;
}

.note-item:hover .note-item-preview {
  color: var(--text-secondary);
}

.note-item-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.note-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.note-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  border-radius: 9999px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.25rem 0.75rem;
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.note-tag:hover {
  background-color: var(--bg-hover);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

.note-tag-category {
  background-color: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.3);
  color: var(--success-color);
}

.note-tag-category:hover {
  background-color: rgba(16, 185, 129, 0.25);
  border-color: var(--success-color);
  color: var(--success-color);
}

/* 笔记项操作提示 */
.note-item-actions {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.note-item:hover .note-item-actions {
  opacity: 1;
}

.note-action-indicator {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: rgba(99, 102, 241, 0.2);
  color: #c7d2fe;
  font-size: 0.625rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(99, 102, 241, 0.4);
}

/* 空状态 */
.note-list-empty {
  margin: 2rem 0;
  padding: 2rem;
  text-align: center;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 1rem;
  border: 1px dashed rgba(79, 70, 229, 0.3);
  transition: all 0.2s ease;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon {
  color: #64748b;
  opacity: 0.5;
  transition: all 0.2s ease;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.empty-text {
  font-size: 0.875rem;
  color: #94a3b8;
  line-height: 1.5;
}

/* 过渡动画 */

/* 笔记项动画 */
.note-item-enter-active,
.note-item-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.note-item-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.note-item-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.note-item-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 分类标签动画 */
.category-enter-active,
.category-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(5px);
}

.category-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-5px);
}

.category-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 标签动画 */
.note-tag-enter-active,
.note-tag-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.note-tag-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.note-tag-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.note-tag-move {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

