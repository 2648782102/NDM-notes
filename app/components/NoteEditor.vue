<template>
  <div class="note-editor">
    <!-- 标题和操作栏 -->
    <!-- 顶部固定操作栏 -->
    <header class="note-editor-header">
      <div class="note-editor-actions">
        <!-- 常用操作按钮 - 更突出的位置 -->
        <button
          class="btn-primary btn-save"
          :disabled="saving"
          @click="$emit('save')"
          title="保存笔记"
        >
          <span v-if="saving" class="spinner" />
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
          <span>{{ currentNoteId ? '保存' : '创建' }}</span>
        </button>
        
        <div class="note-editor-view-toggle">
          <button
            :class="{ active: viewMode === 'edit' }"
            @click="setViewMode('edit')"
            title="编辑模式"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            编辑
          </button>
          <button
            :class="{ active: viewMode === 'preview' }"
            @click="setViewMode('preview')"
            title="预览模式"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            预览
          </button>
          <button
            :class="{ active: viewMode === 'split' }"
            @click="setViewMode('split')"
            title="分屏模式"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="3" x2="12" y2="21"></line></svg>
            分屏
          </button>
        </div>
        
        <button
          v-if="currentNoteId"
          class="btn-danger btn-delete"
          @click="$emit('delete')"
          title="删除笔记"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          删除
        </button>
      </div>
    </header>

    <!-- Markdown 工具栏 -->
    <div v-if="viewMode !== 'preview'" class="note-editor-toolbar">
      <div class="toolbar-section">
        <button class="toolbar-btn" @click="insertMarkdown('# ', '标题 1')" title="标题 1">
          <strong>H1</strong>
        </button>
        <button class="toolbar-btn" @click="insertMarkdown('## ', '标题 2')" title="标题 2">
          <strong>H2</strong>
        </button>
        <button class="toolbar-btn" @click="insertMarkdown('### ', '标题 3')" title="标题 3">
          <strong>H3</strong>
        </button>
      </div>
      
      <div class="toolbar-section">
        <button class="toolbar-btn" @click="wrapMarkdown('**', '**')" title="加粗">
          <strong>B</strong>
        </button>
        <button class="toolbar-btn" @click="wrapMarkdown('*', '*')" title="斜体">
          <em>I</em>
        </button>
        <button class="toolbar-btn" @click="wrapMarkdown('`', '`')" title="行内代码">
          <code>`</code>
        </button>
        <button class="toolbar-btn" @click="wrapMarkdown('~~', '~~')" title="删除线">
          <del>S</del>
        </button>
      </div>
      
      <div class="toolbar-section">
        <button class="toolbar-btn" @click="insertMarkdown('- ', '列表项')" title="无序列表">
          <span>• List</span>
        </button>
        <button class="toolbar-btn" @click="insertMarkdown('1. ', '有序列表项')" title="有序列表">
          <span>1. List</span>
        </button>
        <button class="toolbar-btn" @click="insertMarkdown('> ', '引用')" title="引用">
          <span>" Quote</span>
        </button>
        <button class="toolbar-btn" @click="insertMarkdown('---\n\n', '')" title="分隔线">
          <span>—</span>
        </button>
      </div>
      
      <div class="toolbar-section">
        <button class="toolbar-btn" @click="insertLink()" title="链接">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
          链接
        </button>
        <button class="toolbar-btn" @click="insertImage()" title="图片">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          图片
        </button>
        <button class="toolbar-btn" @click="insertCodeBlock()" title="代码块">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
          代码块
        </button>
      </div>
    </div>

    <!-- 整合的内容区域 - 包含标题、工具栏和编辑/预览区域 -->
    <div class="note-editor-content-wrapper">
      <!-- 标题部分 - 与内容整合 -->
      <div class="note-editor-title-section">
        <template v-if="viewMode === 'preview'">
          <h1 v-if="editor.title" class="note-editor-title-display">{{ editor.title }}</h1>
          <input
            v-else
            v-model="editor.title"
            class="note-editor-title-input"
            placeholder="输入标题..."
            @blur="$emit('save')"
          />
        </template>
        <input
          v-else
          v-model="editor.title"
          class="note-editor-title-input"
          placeholder="输入标题..."
        />
        
        <!-- 元数据输入 - 移到标题下方 -->
        <div class="note-editor-meta">
          <input
            v-model="editor.category"
            class="note-editor-meta-input"
            placeholder="分类"
          />
          <input
            v-model="tagInput"
            class="note-editor-meta-input"
            placeholder="标签 + 回车"
            @keyup.enter.prevent="handleAddTag"
          />
        </div>
      </div>

      <!-- 内容编辑/预览区域 -->
      <div class="note-editor-content">
        <!-- 编辑模式 -->
        <div
          v-if="viewMode === 'edit' || viewMode === 'split'"
          class="note-editor-edit"
        >
          <textarea
            ref="editorTextarea"
            v-model="editor.content"
            class="note-editor-textarea"
            placeholder="在这里输入你的技术笔记、想法或 TODO...

支持 Markdown 格式，使用工具栏快速插入格式！"
          />
        </div>
        
        <!-- 预览模式 -->
        <div
          v-if="viewMode === 'preview' || viewMode === 'split'"
          class="note-editor-preview"
          v-html="compiledMarkdown"
        />
      </div>
    </div>

    <!-- 标签区域 -->
    <div v-if="editor.tags.length" class="note-editor-tags">
      <TransitionGroup name="tag" tag="div" class="tags-container">
        <span
          v-for="tag in editor.tags"
          :key="tag"
          class="note-editor-tag"
        >
          {{ tag }}
          <button
            class="note-editor-tag-remove"
            @click="handleRemoveTag(tag)"
            title="移除标签"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </span>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

// 配置 marked
marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  },
  breaks: true,
  gfm: true
})

interface Props {
  editor: {
    title: string
    content: string
    category: string
    tags: string[]
  }
  currentNoteId: string | null
  saving: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  save: []
  delete: []
  'tag-add': [tag: string]
  'tag-remove': [tag: string]
}>()

// 从useEditor中获取viewMode
const { viewMode } = useEditor()

const tagInput = ref('')
// 使用useEditor中的viewMode，而不是组件内部的
const editorTextarea = ref<HTMLTextAreaElement | null>(null)

// 用于修改viewMode的函数
const setViewMode = (mode: 'edit' | 'preview' | 'split') => {
  viewMode.value = mode
}

// 解决移动端键盘遮挡问题
onMounted(() => {
  if (process.client) {
    // 监听键盘显示和隐藏事件
    window.addEventListener('resize', handleResize)
    
    // 监听输入框聚焦事件，滚动到可见位置
    const titleInput = document.querySelector('.note-editor-title-input')
    const contentTextarea = editorTextarea.value
    const tagInputs = document.querySelectorAll('.note-editor-meta-input')
    
    const scrollIntoView = () => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    }
    
    titleInput?.addEventListener('focus', scrollIntoView)
    contentTextarea?.addEventListener('focus', scrollIntoView)
    tagInputs.forEach(input => input.addEventListener('focus', scrollIntoView))
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('resize', handleResize)
  }
})

const handleResize = () => {
  // 当窗口大小改变时（键盘弹出/隐藏），确保编辑器内容可见
  if (process.client) {
    const activeElement = document.activeElement as HTMLElement
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}

const handleAddTag = () => {
  const trimmed = tagInput.value.trim()
  if (trimmed) {
    emit('tag-add', trimmed)
    tagInput.value = ''
  }
}

const handleRemoveTag = (tag: string) => {
  emit('tag-remove', tag)
}

// 计算属性：编译后的 Markdown
const compiledMarkdown = computed(() => {
  return marked(props.editor.content || '')
})

// 插入 Markdown 格式
const insertMarkdown = (prefix: string, placeholder: string = '') => {
  if (!editorTextarea.value) return
  
  const textarea = editorTextarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)
  const replacement = prefix + (selectedText || placeholder)
  
  textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end)
  textarea.focus()
  
  // 将光标定位到合适位置
  if (!selectedText && placeholder) {
    textarea.selectionStart = textarea.selectionEnd = start + prefix.length
  } else {
    textarea.selectionStart = textarea.selectionEnd = start + replacement.length
  }
}

// 包裹选中内容
const wrapMarkdown = (start: string, end: string) => {
  if (!editorTextarea.value) return
  
  const textarea = editorTextarea.value
  const startPos = textarea.selectionStart
  const endPos = textarea.selectionEnd
  const selectedText = textarea.value.substring(startPos, endPos)
  const replacement = start + selectedText + end
  
  textarea.value = textarea.value.substring(0, startPos) + replacement + textarea.value.substring(endPos)
  textarea.focus()
  
  // 将光标定位到包裹内容的末尾
  textarea.selectionStart = textarea.selectionEnd = startPos + replacement.length
}

// 插入链接
const insertLink = () => {
  if (!editorTextarea.value) return
  
  const textarea = editorTextarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)
  const replacement = `[${selectedText || '链接文本'}](https://example.com)`
  
  textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end)
  textarea.focus()
  
  // 将光标定位到链接地址位置
  if (!selectedText) {
    textarea.selectionStart = textarea.selectionEnd = start + 5 // 跳过 [链接文本](
  } else {
    textarea.selectionStart = textarea.selectionEnd = start + replacement.length
  }
}

// 插入图片
const insertImage = () => {
  if (!editorTextarea.value) return
  
  const textarea = editorTextarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const replacement = `![图片描述](https://example.com/image.jpg)`
  
  textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end)
  textarea.focus()
  textarea.selectionStart = textarea.selectionEnd = start + 7 // 跳过 ![图片描述](
}

// 插入代码块
const insertCodeBlock = () => {
  if (!editorTextarea.value) return
  
  const textarea = editorTextarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)
  const replacement = `\`\`\`javascript\n${selectedText || '// 在这里输入代码'}\n\`\`\``
  
  textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end)
  textarea.focus()
  
  // 将光标定位到代码块内部
  if (!selectedText) {
    textarea.selectionStart = textarea.selectionEnd = start + 13 // 跳过 ```javascript
  } else {
    textarea.selectionStart = textarea.selectionEnd = start + replacement.length
  }
}
</script>

<style scoped>
.note-editor {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 70vh;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.72);
  border-radius: 1rem;
  border: 1px solid rgba(51, 65, 85, 0.85);
  backdrop-filter: blur(24px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 移动端编辑器全屏布局 */
.mobile-editor-content .note-editor {
  flex: 1 1 auto;
  border-radius: 0;
  border: none;
  min-height: calc(100vh - 5rem);
  box-shadow: none;
  overflow: auto;
}

/* 确保编辑器内容区域在移动端正确显示 */
.mobile-editor-content .note-editor-content-wrapper {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 移动端编辑区域自适应高度 */
.mobile-editor-content .note-editor-content {
  flex: 1;
  min-height: 0;
}

.note-editor:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: rgba(79, 70, 229, 0.5);
}

.note-editor-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid rgba(51, 65, 85, 0.8);
  background: rgba(8, 14, 30, 0.6);
  backdrop-filter: blur(12px);
  z-index: 10;
}

.note-editor-title-input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #f9fafb;
  outline: none;
  transition: color 0.2s ease;
}

.note-editor-title-input:focus {
  color: #c7d2fe;
}

.note-editor-title-input::placeholder {
  color: #64748b;
}

/* 标题显示样式 */
.note-editor-title-display {
  margin: 0;
  padding: 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #c7d2fe;
  line-height: 1.3;
  transition: color 0.2s ease;
}

.note-editor-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* 确保所有按钮文本水平排列 */
.note-editor-actions button {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.note-editor-meta-input {
  width: 7rem;
  height: 2rem;
  border: 1px solid rgba(79, 70, 229, 0.3);
  background-color: rgba(15, 23, 42, 0.6);
  padding: 0 0.75rem;
  font-size: 0.75rem;
  border-radius: 0.5rem;
  color: #e2e8f0;
  outline: none;
  transition: all 0.2s ease;
}

.note-editor-meta-input:focus {
  border-color: #6366f1;
  background-color: rgba(15, 23, 42, 0.8);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.note-editor-meta-input::placeholder {
  color: #64748b;
}

/* 视图切换按钮 */
.note-editor-view-toggle {
  display: flex;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 0.5rem;
  padding: 0.25rem;
  gap: 0.25rem;
}

.note-editor-view-toggle button {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  border: none;
  background: transparent;
  color: #94a3b8;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.note-editor-view-toggle button:hover {
  background: rgba(79, 70, 229, 0.2);
  color: #c7d2fe;
}

.note-editor-view-toggle button.active {
  background: #6366f1;
  color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.btn-delete, .btn-danger {
  height: 2.5rem;
  border: 1px solid rgba(239, 68, 68, 0.4);
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.2));
  color: #fca5a5;
  padding: 0 1.25rem;
  font-size: 0.875rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.15);
}

.btn-delete:hover, .btn-danger:hover {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.3));
  color: #fecdd3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-delete:active, .btn-danger:active {
  transform: translateY(0);
}

.btn-primary {
  height: 2.5rem;
  padding: 0 1.25rem;
  font-size: 0.875rem;
  border-radius: 0.75rem;
  border: 1px solid #6366f1;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #818cf8, #6366f1);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(129, 140, 248, 0.4);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 操作栏布局优化 */
.note-editor-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  width: 100%;
}

/* 元数据输入区域优化 */
.note-editor-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  width: 100%;
}

.note-editor-meta-input {
  flex: 1;
  min-width: 120px;
}

/* 视图切换按钮优化 */
.note-editor-view-toggle {
  display: flex;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 0.75rem;
  padding: 0.25rem;
  gap: 0.25rem;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(51, 65, 85, 0.5);
}

.note-editor-view-toggle button {
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  border: none;
  background: transparent;
  color: #94a3b8;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.note-editor-view-toggle button:hover {
  background: rgba(79, 70, 229, 0.2);
  color: #c7d2fe;
  transform: translateY(-1px);
}

.note-editor-view-toggle button.active {
  background: #6366f1;
  color: white;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
  transform: translateY(-1px);
}

.spinner {
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  border: 2px solid rgba(199, 210, 254, 0.3);
  border-top-color: #c7d2fe;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 编辑器内容区域 */
/* Markdown 工具栏 */
.note-editor-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid rgba(51, 65, 85, 0.6);
  background: rgba(8, 14, 30, 0.3);
  flex-wrap: wrap;
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem;
  border-radius: 0.5rem;
  background: rgba(15, 23, 42, 0.5);
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.375rem 0.5rem;
  border: 1px solid rgba(79, 70, 229, 0.3);
  background: transparent;
  color: #cbd5e1;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 2.5rem;
  /* 确保触摸区域足够大 */
  min-height: 2.5rem;
  touch-action: manipulation;
}

.toolbar-btn:hover {
  background: rgba(79, 70, 229, 0.2);
  border-color: rgba(99, 102, 241, 0.5);
  color: #c7d2fe;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 内容编辑区域包装器 */
.note-editor-content-wrapper {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: rgba(8, 14, 30, 0.4);
  padding: 1rem;
  gap: 1rem;
}

/* 标题部分样式 */
.note-editor-title-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 0.5rem;
  border: 1px solid rgba(51, 65, 85, 0.6);
  transition: all 0.2s ease;
}

.note-editor-content {
  flex: 1;
  display: flex;
  gap: 0.75rem;
  overflow: hidden;
}

/* 编辑模式 */
.note-editor-edit {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 0.5rem;
  border: 1px solid rgba(51, 65, 85, 0.6);
  transition: all 0.2s ease;
  /* 优化滚动性能 */
  will-change: contents;
}

.note-editor-textarea {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.7;
  color: #f1f5f9;
  resize: none;
  outline: none;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  transition: all 0.2s ease;
  overflow-y: auto;
  /* 优化滚动性能 */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  will-change: scroll-position;
  /* 启用硬件加速 */
  transform: translateZ(0);
}

.note-editor-textarea:focus {
  color: #c7d2fe;
}

/* 预览模式 */
.note-editor-preview {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.7;
  color: #f1f5f9;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 0.5rem;
  border: 1px solid rgba(51, 65, 85, 0.6);
  transition: all 0.2s ease;
  /* 优化滚动性能 */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  will-change: scroll-position;
  /* 启用硬件加速 */
  transform: translateZ(0);
}

/* 分屏模式 */
.note-editor-content:has(.note-editor-edit):has(.note-editor-preview) {
  flex-direction: row;
}

/* Markdown 预览样式 */
.note-editor-preview :deep(h1),
.note-editor-preview :deep(h2),
.note-editor-preview :deep(h3),
.note-editor-preview :deep(h4),
.note-editor-preview :deep(h5),
.note-editor-preview :deep(h6) {
  margin: 1.5rem 0 0.75rem;
  font-weight: 600;
  line-height: 1.25;
  color: #c7d2fe;
}

.note-editor-preview :deep(h1) {
  font-size: 1.875rem;
  border-bottom: 2px solid rgba(79, 70, 229, 0.3);
  padding-bottom: 0.5rem;
}

.note-editor-preview :deep(h2) {
  font-size: 1.5rem;
  border-bottom: 1px solid rgba(79, 70, 229, 0.2);
  padding-bottom: 0.5rem;
}

.note-editor-preview :deep(h3) {
  font-size: 1.25rem;
}

.note-editor-preview :deep(p) {
  margin: 0.75rem 0;
  color: #e2e8f0;
}

.note-editor-preview :deep(ul),
.note-editor-preview :deep(ol) {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
  color: #e2e8f0;
}

.note-editor-preview :deep(li) {
  margin: 0.25rem 0;
}

.note-editor-preview :deep(ul li) {
  list-style-type: disc;
}

.note-editor-preview :deep(ol li) {
  list-style-type: decimal;
}

.note-editor-preview :deep(a) {
  color: #60a5fa;
  text-decoration: none;
  transition: color 0.2s ease;
}

.note-editor-preview :deep(a:hover) {
  color: #3b82f6;
  text-decoration: underline;
}

.note-editor-preview :deep(strong) {
  font-weight: 600;
  color: #c7d2fe;
}

.note-editor-preview :deep(em) {
  font-style: italic;
  color: #fcd34d;
}

.note-editor-preview :deep(code) {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-size: 0.875em;
  padding: 0.125rem 0.375rem;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(51, 65, 85, 0.8);
  border-radius: 0.375rem;
  color: #f87171;
}

.note-editor-preview :deep(pre) {
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(8, 14, 30, 0.8);
  border: 1px solid rgba(51, 65, 85, 0.8);
  border-radius: 0.5rem;
  overflow-x: auto;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}

.note-editor-preview :deep(pre code) {
  background: transparent;
  border: none;
  padding: 0;
  color: inherit;
}

.note-editor-preview :deep(blockquote) {
  margin: 1rem 0;
  padding: 0 1rem;
  border-left: 4px solid #6366f1;
  color: #94a3b8;
  font-style: italic;
}

.note-editor-preview :deep(hr) {
  margin: 1.5rem 0;
  border: none;
  border-top: 1px solid rgba(51, 65, 85, 0.8);
}

/* 标签样式 */
.note-editor-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid rgba(51, 65, 85, 0.5);
  background: rgba(8, 14, 30, 0.3);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  width: 100%;
}

.note-editor-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  border-radius: 9999px;
  background-color: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(79, 70, 229, 0.2);
  padding: 0.375rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #e5e7eb;
  transition: all 0.2s ease;
  animation: tagSlideIn 0.3s ease;
}

.note-editor-tag:hover {
  background-color: rgba(79, 70, 229, 0.2);
  border-color: #6366f1;
  transform: translateY(-1px);
}

.note-editor-tag-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.125rem;
  height: 1.125rem;
  margin-left: 0.125rem;
  border: none;
  background: rgba(244, 63, 94, 0.2);
  color: #f87171;
  font-size: 0.875rem;
  line-height: 1;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.note-editor-tag-remove:hover {
  background: rgba(244, 63, 94, 0.4);
  color: #ef4444;
  transform: scale(1.1);
}

@keyframes tagSlideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 滚动条样式 */
.note-editor-preview::-webkit-scrollbar,
.note-editor-textarea::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.note-editor-preview::-webkit-scrollbar-track,
.note-editor-textarea::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.4);
  border-radius: 4px;
}

.note-editor-preview::-webkit-scrollbar-thumb,
.note-editor-textarea::-webkit-scrollbar-thumb {
  background: rgba(79, 70, 229, 0.4);
  border-radius: 4px;
  transition: background 0.2s ease;
}

.note-editor-preview::-webkit-scrollbar-thumb:hover,
.note-editor-textarea::-webkit-scrollbar-thumb:hover {
  background: rgba(79, 70, 229, 0.6);
}

/* 移动端优化 */
@media (max-width: 768px) {
  /* 隐藏顶部的保存和删除按钮，移动端使用单独的操作栏 */
  .note-editor-header .btn-save,
  .note-editor-header .btn-delete {
    display: none;
  }
  
  /* 优化标题栏的标签和分类输入框 */
  .note-editor-title-section {
    gap: 0.75rem;
  }
  
  .note-editor-meta {
    flex-direction: row;
    gap: 0.75rem;
  }
  
  .note-editor-meta-input {
    flex: 1;
    min-width: 0;
    height: 2.5rem;
    font-size: 0.875rem;
    padding: 0 0.875rem;
  }
}

/* 移动端触摸反馈 */
@media (hover: none) and (pointer: coarse) {
  /* 按钮按下效果 */
  .note-editor-view-toggle button:active,
  .btn-primary:active,
  .btn-delete:active,
  .toolbar-btn:active,
  .note-editor-tag-remove:active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }
  
  /* 按钮触摸高亮 */
  .note-editor-view-toggle button,
  .btn-primary,
  .btn-delete,
  .toolbar-btn,
  .note-editor-tag-remove {
    -webkit-tap-highlight-color: rgba(99, 102, 241, 0.2);
  }
  
  /* 平滑滚动 */
  .note-editor-content,
  .note-editor-preview,
  .note-editor-textarea {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
  
  /* 优化点击区域 */
  .toolbar-btn {
    min-height: 2rem;
    min-width: 2rem;
  }
  
  /* 避免键盘遮挡 */
  .note-editor {
    overflow: hidden;
  }
  
  /* 优化文本输入 */
  .note-editor-textarea {
    font-size: 1rem;
    line-height: 1.6;
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .note-editor-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .note-editor-title-input {
    font-size: 1rem;
  }
  
  .note-editor-actions {
    justify-content: space-between;
  }
  
  .note-editor-meta-input {
    width: auto;
    flex: 1;
    min-width: 6rem;
  }
}

@media (max-width: 768px) {
  .note-editor {
    margin: 0;
    border-radius: 0;
    min-height: calc(100vh - 1rem);
    border: none;
    box-shadow: none;
  }
  
  .note-editor-header {
    padding: 0.5rem 0.75rem;
    gap: 0.5rem;
    flex-direction: column;
    align-items: stretch;
    background: rgba(8, 14, 30, 0.9);
  }
  
  .note-editor-actions {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .note-editor-view-toggle {
    order: -1;
    width: 100%;
    justify-content: space-around;
    background: rgba(15, 23, 42, 0.8);
    padding: 0.375rem;
  }
  
  .note-editor-view-toggle button {
    flex: 1;
    justify-content: center;
    padding: 0.375rem 0.5rem;
  }
  
  /* 移动端标题区域 */
  .note-editor-title-section {
    padding: 0.5rem 0.75rem;
    gap: 0.5rem;
  }
  
  .note-editor-title-input {
    font-size: 1rem;
    padding: 0.625rem 0;
  }
  
  .note-editor-title-display {
    font-size: 1rem;
    padding: 0.5rem 0;
  }
  
  /* 移动端元数据输入 */
  .note-editor-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .note-editor-meta-input {
    width: 100%;
    background: rgba(15, 23, 42, 0.8);
  }
  
  /* 移动端工具栏 */
.note-editor-toolbar {
  padding: 0.5rem 0.75rem;
  gap: 0.5rem;
  background: rgba(8, 14, 30, 0.8);
  border-bottom: 1px solid rgba(51, 65, 85, 0.4);
  overflow-x: auto;
  flex-wrap: nowrap;
  /* 优化滚动体验 */
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  scroll-behavior: smooth;
  position: sticky;
  top: 0;
  z-index: 10;
}

.note-editor-toolbar::-webkit-scrollbar {
  display: none;
}

.toolbar-section {
  gap: 0.25rem;
  background: rgba(15, 23, 42, 0.8);
  padding: 0.25rem;
  flex-shrink: 0;
  border-radius: 0.5rem;
}

.toolbar-btn {
  padding: 0.3125rem 0.5rem;
  font-size: 0.7rem;
  min-width: 2rem;
  gap: 0.25rem;
  border-radius: 0.375rem;
}

/* 工具栏提示文字优化 */
@media (max-width: 768px) {
  .toolbar-btn span {
    display: none;
  }
  
  .toolbar-btn {
    min-width: 2.25rem;
    min-height: 2.25rem;
    padding: 0.5rem;
  }
  
  .toolbar-section {
    gap: 0.375rem;
  }
}
  
  /* 移动端内容区域 */
  .note-editor-content-wrapper {
    flex: 1;
    padding: 0.5rem;
    gap: 0.75rem;
  }
  
  .note-editor-content {
    flex-direction: column;
    height: 100%;
    gap: 0.5rem;
  }
  
  /* 分屏模式在移动端改为垂直排列 */
  .note-editor-content:has(.note-editor-edit):has(.note-editor-preview) {
    flex-direction: column;
  }
  
  .note-editor-edit,
  .note-editor-preview {
    height: calc(50% - 0.25rem);
    min-height: 250px;
  }
  
  .note-editor-textarea,
  .note-editor-preview {
    font-size: 0.875rem;
    line-height: 1.6;
    padding: 0.875rem;
  }
  
  .note-editor-tags {
    padding: 0.75rem 0.875rem;
    background: rgba(8, 14, 30, 0.6);
    border-top: 1px solid rgba(51, 65, 85, 0.4);
  }
  
  .tags-container {
    gap: 0.375rem;
  }
  
  .note-editor-tag {
    padding: 0.3125rem 0.75rem;
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .note-editor {
    min-height: calc(100vh - 0.5rem);
  }
  
  .note-editor-header {
    padding: 0.5rem 0.75rem;
    gap: 0.375rem;
  }
  
  .note-editor-title-input {
    font-size: 0.9375rem;
    padding: 0.5rem 0;
  }
  
  .note-editor-view-toggle {
    padding: 0.25rem;
  }
  
  .note-editor-view-toggle button {
    padding: 0.375rem 0.5rem;
    font-size: 0.7rem;
  }
  
  .note-editor-toolbar {
    padding: 0.375rem 0.5rem;
    overflow-x: auto;
    flex-wrap: nowrap;
    justify-content: flex-start;
    gap: 0.375rem;
  }
  
  .toolbar-section {
    flex-shrink: 0;
    gap: 0.1875rem;
    padding: 0.1875rem;
  }
  
  .toolbar-btn {
    padding: 0.25rem 0.375rem;
    font-size: 0.65rem;
    min-width: 2.25rem;
  }
  
  .note-editor-content {
    padding: 0.375rem;
  }
  
  .note-editor-textarea,
  .note-editor-preview {
    font-size: 0.8125rem;
    line-height: 1.5;
    padding: 0.75rem;
  }
  
  .note-editor-edit,
  .note-editor-preview {
    min-height: 200px;
  }
  
  .note-editor-tags {
    padding: 0.625rem 0.75rem;
  }
  
  .note-editor-tag {
    padding: 0.25rem 0.625rem;
    font-size: 0.65rem;
  }
  
  .btn-delete,
  .btn-save {
    height: 2.25rem;
    font-size: 0.8125rem;
    justify-content: center;
  }
}
</style>

