<template>
  <div class="note-editor">
    <!-- Markdown 工具栏 - 只在编辑模式显示 -->
    <div v-if="isEditing" class="note-editor-toolbar">
      <!-- 保存和删除按钮 -->
      <div class="toolbar-section">
        <button
          class="toolbar-btn btn-save"
          :disabled="saving"
          @click="$emit('save')"
          title="保存笔记"
        >
          <span v-if="saving" class="spinner-small" />
          <FontAwesomeIcon icon="save" size="sm" />
          <span>{{ currentNoteId ? '保存' : '创建' }}</span>
        </button>
        
        <button
          v-if="currentNoteId"
          class="toolbar-btn btn-delete"
          @click="$emit('delete')"
          title="删除笔记"
        >
          <FontAwesomeIcon icon="trash" size="sm" />
          删除
        </button>
      </div>
      
      <!-- 标题格式工具栏 -->
      <div class="toolbar-section">
        <button class="toolbar-btn" @click="insertMarkdown('# ', '标题 1')" title="标题 1">
          <FontAwesomeIcon icon="heading" size="sm" />
        </button>
        <button class="toolbar-btn" @click="insertMarkdown('## ', '标题 2')" title="标题 2">
          <FontAwesomeIcon icon="heading" size="sm" />
        </button>
        <button class="toolbar-btn" @click="insertMarkdown('### ', '标题 3')" title="标题 3">
          <FontAwesomeIcon icon="heading" size="sm" />
        </button>
      </div>
      
      <div class="toolbar-section">
        <button class="toolbar-btn" @click="wrapMarkdown('**', '**')" title="加粗">
          <FontAwesomeIcon icon="bold" size="sm" />
        </button>
        <button class="toolbar-btn" @click="wrapMarkdown('*', '*')" title="斜体">
          <FontAwesomeIcon icon="italic" size="sm" />
        </button>
        <button class="toolbar-btn" @click="wrapMarkdown('`', '`')" title="行内代码">
          <FontAwesomeIcon icon="code" size="sm" />
        </button>
        <button class="toolbar-btn" @click="wrapMarkdown('~~', '~~')" title="删除线">
          <FontAwesomeIcon icon="strikethrough" size="sm" />
        </button>
      </div>
      
      <div class="toolbar-section">
        <button class="toolbar-btn" @click="insertMarkdown('- ', '列表项')" title="无序列表">
          <FontAwesomeIcon icon="list" size="sm" />
        </button>
        <button class="toolbar-btn" @click="insertMarkdown('1. ', '有序列表项')" title="有序列表">
          <FontAwesomeIcon icon="list-ol" size="sm" />
        </button>
        <button class="toolbar-btn" @click="insertMarkdown('- [ ] ', '任务列表项')" title="任务列表">
          <FontAwesomeIcon icon="list-check" size="sm" />
        </button>
        <button class="toolbar-btn" @click="insertMarkdown('> ', '引用')" title="引用">
          <FontAwesomeIcon icon="quote-right" size="sm" />
        </button>
      </div>
      
      <div class="toolbar-section">
        <button class="toolbar-btn" @click="insertTable()" title="表格">
          <FontAwesomeIcon icon="table" size="sm" />
        </button>
        <button class="toolbar-btn" @click="insertMarkdown('---\n\n', '')" title="分隔线">
          <FontAwesomeIcon icon="minus" size="sm" />
        </button>
        <button class="toolbar-btn" @click="insertMarkdown('^[脚注内容]\n\n', '')" title="脚注">
          <FontAwesomeIcon icon="asterisk" size="sm" />
        </button>
        <button class="toolbar-btn" @click="wrapMarkdown('==', '==')" title="高亮文本">
          <FontAwesomeIcon icon="highlighter" size="sm" />
        </button>
      </div>
      
      <div class="toolbar-section">
        <button class="toolbar-btn" @click="wrapMarkdown('<sup>', '</sup>')" title="上标">
          <FontAwesomeIcon icon="superscript" size="sm" />
        </button>
        <button class="toolbar-btn" @click="wrapMarkdown('<sub>', '</sub>')" title="下标">
          <FontAwesomeIcon icon="subscript" size="sm" />
        </button>
        <button class="toolbar-btn" @click="insertLink()" title="链接">
          <FontAwesomeIcon icon="link" size="sm" />
        </button>
        <button class="toolbar-btn" @click="insertImage()" title="图片">
          <FontAwesomeIcon icon="image" size="sm" />
        </button>
        <button class="toolbar-btn" @click="insertCodeBlock()" title="代码块">
          <FontAwesomeIcon icon="code" size="sm" />
        </button>
      </div>
    </div>

    <!-- 整合的内容区域 - 包含标题、工具栏和编辑/预览区域 -->
    <div class="note-editor-content-wrapper">
      <!-- 标题部分 - 与内容整合 -->
      <div class="note-editor-title-section">
        <!-- 编辑模式下直接显示输入框，预览模式下显示标题文本 -->
        <div class="title-with-edit">
          <h1 
            v-if="editor.title && !isEditing" 
            class="note-editor-title-display"
            @dblclick="startEditingTitle"
          >{{ editor.title }}</h1>
          <input
            v-else
            v-model="editor.title"
            class="note-editor-title-input"
            placeholder="输入标题..."
            ref="titleInput"
          />
          <!-- 添加编辑按钮，适合移动端用户 -->
        <button 
          v-if="!isEditing" 
          class="note-editor-edit-btn"
          @click="startEditing"
          title="编辑笔记"
        >
          <FontAwesomeIcon icon="edit" size="sm" />
          编辑
        </button>
        </div>
        
        <!-- 元数据输入 - 只在编辑模式显示 -->
        <div v-if="isEditing" class="note-editor-meta">
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

      <!-- 内容区域 - 根据isEditing状态切换 -->
      <div class="note-editor-content">
        <!-- 使用Transition组件添加切换动画 -->
        <Transition name="editor-mode" mode="out-in">
          <!-- 默认预览模式 - 完整高度 -->
          <div 
            v-if="!isEditing" 
            key="preview"
            class="note-editor-preview-full"
            @dblclick="startEditing"
            v-html="compiledMarkdown"
          />
          
          <!-- 编辑模式 - 分屏显示 -->
          <div 
            v-else
            key="edit"
            class="note-editor-edit-container"
          >
            <!-- 编辑区域 -->
            <div class="note-editor-edit">
              <textarea
                ref="editorTextarea"
                v-model="editor.content"
                class="note-editor-textarea"
                placeholder="在这里输入你的技术笔记、想法或 TODO...

支持 Markdown 格式，使用工具栏快速插入格式！"
              />
            </div>
            
            <!-- 预览区域 -->
            <div
              class="note-editor-preview"
              v-html="compiledMarkdown"
            />
          </div>
        </Transition>
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
            <FontAwesomeIcon icon="xmark" size="sm" />
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
  gfm: true,
  // 启用表格和任务列表
  tables: true,
  // 启用脚注
  footnotes: true,
  // 启用表情符号
  emoji: true,
  // 启用标题锚点
  headerIds: true,
  // 启用智能列表
  smartLists: true,
  // 启用智能标点
  smartypants: true,
  // 安全配置
  mangle: true, // 混淆邮件地址
  sanitize: true, // 启用HTML净化
  silent: true, // 忽略解析错误
  baseUrl: undefined, // 不允许相对URL
  // 确保不执行不安全的HTML
  allowHtml: false,
  // 不暴露URL
  exposeUrl: false
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
  isEditing: boolean // 通过props传递编辑状态
}

const props = defineProps<Props>()

const emit = defineEmits<{
  save: []
  delete: []
  'tag-add': [tag: string]
  'tag-remove': [tag: string]
  'update:isEditing': [value: boolean] // 添加更新编辑状态的事件
}>()

const tagInput = ref('')
const editorTextarea = ref<HTMLTextAreaElement | null>(null)
const titleInput = ref<HTMLInputElement | null>(null)

// 双击内容区域开始编辑
const startEditing = () => {
  console.log('startEditing called')
  emit('update:isEditing', true)
  nextTick(() => {
    editorTextarea.value?.focus()
  })
}

// 双击标题开始编辑 - 与双击内容区域效果相同
const startEditingTitle = () => {
  emit('update:isEditing', true)
  nextTick(() => {
    titleInput.value?.focus()
  })
}

// 解决移动端键盘遮挡问题
onMounted(() => {
  if (process.client) {
    // 监听键盘显示和隐藏事件
    window.addEventListener('resize', handleResize)
    
    // 监听输入框聚焦事件，滚动到可见位置
    const titleInputEl = titleInput.value
    const contentTextarea = editorTextarea.value
    const tagInputs = document.querySelectorAll('.note-editor-meta-input')
    
    const scrollIntoView = () => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    }
    
    titleInputEl?.addEventListener('focus', scrollIntoView)
    contentTextarea?.addEventListener('focus', scrollIntoView)
    tagInputs.forEach(input => input.addEventListener('focus', scrollIntoView))
    
    // 添加快捷键支持
    const handleKeyDown = (e: KeyboardEvent) => {
      // 只在编辑模式下且内容区域有焦点时生效
      if (!props.isEditing || !editorTextarea.value || document.activeElement !== editorTextarea.value) {
        return
      }
      
      const isCmdOrCtrl = e.ctrlKey || e.metaKey
      
      // 根据不同的快捷键组合执行不同的操作
      if (isCmdOrCtrl) {
        switch (e.key.toLowerCase()) {
          case 'b': // 加粗
            e.preventDefault()
            wrapMarkdown('**', '**')
            break
          case 'i': // 斜体
            e.preventDefault()
            wrapMarkdown('*', '*')
            break
          case 'k': // 链接
            e.preventDefault()
            insertLink()
            break
          case ' ': // 空格 - 用于智能补全
            break
        }
      }
      
      // Ctrl + Shift + 组合键
      if (isCmdOrCtrl && e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'c': // 代码块
            e.preventDefault()
            insertCodeBlock()
            break
          case 'k': // 行内代码
            e.preventDefault()
            wrapMarkdown('`', '`')
            break
          case 'l': // 无序列表
            e.preventDefault()
            insertMarkdown('- ', '列表项')
            break
          case 'o': // 有序列表
            e.preventDefault()
            insertMarkdown('1. ', '有序列表项')
            break
          case 't': // 表格
            e.preventDefault()
            insertTable()
            break
          case 'q': // 引用
            e.preventDefault()
            insertMarkdown('> ', '引用')
            break
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    
    // 保存事件监听器，以便在组件卸载时移除
    const cleanup = () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
    
    // 使用闭包保存清理函数，避免使用any类型
    let cleanupFunction = cleanup
    
    // 将清理函数存储到组件实例中
    onUnmounted(() => {
      cleanupFunction()
    })
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

// 计算属性：编译后的 Markdown，添加缓存避免重复编译
const compiledMarkdown = computed(() => {
  const content = props.editor.content || ''
  return marked(content)
})

// 插入 Markdown 格式
const insertMarkdown = (prefix: string, placeholder: string = '') => {
  if (!editorTextarea.value) return
  
  const textarea = editorTextarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)
  
  let replacement: string
  let selectionStart: number
  let selectionEnd: number
  
  if (selectedText) {
    // 如果有选中文本，直接在前后添加前缀
    replacement = prefix + selectedText
    selectionStart = selectionEnd = start + replacement.length
  } else {
    // 如果没有选中文本，插入前缀+占位符，并选中占位符
    replacement = prefix + placeholder
    selectionStart = start + prefix.length
    selectionEnd = start + replacement.length
  }
  
  textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end)
  textarea.focus()
  textarea.selectionStart = selectionStart
  textarea.selectionEnd = selectionEnd
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
  
  let replacement: string
  let selectionStart: number
  let selectionEnd: number
  
  if (selectedText) {
    // 如果有选中文本，将其作为链接文本，选中链接地址位置
    replacement = `[${selectedText}](链接地址)`
    selectionStart = start + selectedText.length + 2 // [文本](链接地址) - 选中链接地址部分
    selectionEnd = replacement.length + start
  } else {
    // 如果没有选中文本，插入带占位符的链接结构，选中链接文本位置
    replacement = `[链接文本](链接地址)`
    selectionStart = start + 1 // 选中链接文本
    selectionEnd = start + 5
  }
  
  textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end)
  textarea.focus()
  textarea.selectionStart = selectionStart
  textarea.selectionEnd = selectionEnd
}

// 插入图片
const insertImage = () => {
  if (!editorTextarea.value) return
  
  const textarea = editorTextarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)
  
  let replacement: string
  let selectionStart: number
  let selectionEnd: number
  
  if (selectedText) {
    // 如果有选中文本，将其作为图片描述，选中图片地址位置
    replacement = `![${selectedText}](图片地址)`
    selectionStart = start + selectedText.length + 3 // ![描述](地址) - 选中地址部分
    selectionEnd = replacement.length + start
  } else {
    // 如果没有选中文本，插入带占位符的图片结构，选中图片描述位置
    replacement = `![图片描述](图片地址)`
    selectionStart = start + 2 // 选中图片描述
    selectionEnd = start + 6
  }
  
  textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end)
  textarea.focus()
  textarea.selectionStart = selectionStart
  textarea.selectionEnd = selectionEnd
}

// 插入代码块
const insertCodeBlock = () => {
  if (!editorTextarea.value) return
  
  const textarea = editorTextarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)
  
  let replacement: string
  let selectionStart: number
  let selectionEnd: number
  
  if (selectedText) {
    // 如果有选中文本，将其包裹在代码块中，使用javascript语言
    replacement = `\`\`\`javascript\n${selectedText}\n\`\`\``
    selectionStart = selectionEnd = start + replacement.length
  } else {
    // 如果没有选中文本，插入带占位符的代码块，选中占位符文本
    replacement = `\`\`\`javascript\n// 在这里输入代码...\n\`\`\``
    selectionStart = start + 13 // 跳过 ```javascript\n，选中占位符
    selectionEnd = start + 27
  }
  
  textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end)
  textarea.focus()
  textarea.selectionStart = selectionStart
  textarea.selectionEnd = selectionEnd
}

// 插入表格
const insertTable = () => {
  if (!editorTextarea.value) return
  
  const textarea = editorTextarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  
  // 插入带占位符的表格结构
  const replacement = `| 表头 1 | 表头 2 |
|--------|--------|
| 内容 1 | 内容 2 |
`
  
  textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end)
  textarea.focus()
  
  // 将光标定位到第一个表头单元格
  textarea.selectionStart = start + 2 // 跳过 | ，定位到第一个表头单元格
  textarea.selectionEnd = start + 5
}
</script>

<style scoped>
.note-editor {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 70vh;
  overflow: hidden;
  background: var(--bg-card);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
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

.note-editor-title-input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  outline: none;
  transition: color 0.2s ease;
}

.note-editor-title-input:focus {
  color: var(--accent-tertiary);
}

.note-editor-title-input::placeholder {
  color: var(--text-muted);
}

/* 标题显示样式 */
.title-with-edit {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: space-between;
}

.note-editor-title-display {
  margin: 0;
  padding: 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--accent-tertiary);
  line-height: 1.3;
  transition: color 0.2s ease;
  cursor: pointer;
  flex: 1;
}

.note-editor-title-display:hover {
  color: var(--accent-secondary);
}

/* 编辑按钮样式 */
.note-editor-edit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(79, 70, 229, 0.3);
  background: rgba(79, 70, 229, 0.1);
  color: var(--accent-tertiary);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  min-height: 2rem;
}

.note-editor-edit-btn:hover {
  background: rgba(79, 70, 229, 0.2);
  border-color: var(--accent-primary);
  color: var(--accent-tertiary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.note-editor-edit-btn svg {
  width: 14px;
  height: 14px;
}

.note-editor-meta-input {
  width: 7rem;
  height: 2rem;
  border: 1px solid var(--border-color);
  background-color: var(--bg-card);
  padding: 0 0.75rem;
  font-size: 0.75rem;
  border-radius: 0.5rem;
  color: var(--text-primary);
  outline: none;
  transition: all 0.2s ease;
}

.note-editor-meta-input:focus {
  border-color: var(--accent-primary);
  background-color: var(--bg-hover);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.note-editor-meta-input::placeholder {
  color: var(--text-muted);
}

/* 元数据输入区域优化 */
.note-editor-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  width: 100%;
}

/* 工具栏保存按钮样式 */
.toolbar-btn.btn-save {
  background: linear-gradient(135deg, var(--bg-card), var(--bg-hover));
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

.toolbar-btn.btn-save:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-color: var(--accent-secondary);
  color: white;
}

.toolbar-btn.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--bg-card);
  color: var(--text-muted);
  border-color: var(--border-color);
}

/* 工具栏删除按钮样式 */
.toolbar-btn.btn-delete {
  background: linear-gradient(135deg, var(--bg-card), var(--bg-hover));
  border-color: var(--error-color);
  color: var(--error-color);
}

.toolbar-btn.btn-delete:hover {
  background: linear-gradient(135deg, var(--error-color), var(--warning-color));
  border-color: var(--warning-color);
  color: white;
}

/* 小加载动画 */
.spinner-small {
  display: inline-block;
  width: 0.625rem;
  height: 0.625rem;
  border: 2px solid rgba(199, 210, 254, 0.3);
  border-top-color: var(--accent-tertiary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 0.25rem;
}

/* Markdown 工具栏 */
.note-editor-toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
  flex-wrap: wrap;
  justify-content: flex-start;
  overflow-x: auto;
  /* 优化滚动体验 */
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  scroll-behavior: smooth;
}

/* 隐藏滚动条 */
.note-editor-toolbar::-webkit-scrollbar {
  display: none;
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem;
  border-radius: 0.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  flex-shrink: 0;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.375rem 0.5rem;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
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
  background: var(--bg-hover);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 确保图标在深色和浅色主题下都能正常显示 */
.toolbar-btn .u-icon {
  color: currentColor;
  transition: color all 0.2s ease;
}

/* 深色主题下的按钮样式优化 */
.dark .toolbar-btn {
  background: var(--bg-card);
  border-color: var(--border-color);
  color: var(--text-primary);
}

.dark .toolbar-btn:hover {
  background: var(--bg-hover);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

/* 内容编辑区域包装器 */
.note-editor-content-wrapper {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  padding: 1rem;
  gap: 1rem;
}

/* 标题部分样式 */
.note-editor-title-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--bg-card);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.note-editor-content {
  flex: 1;
  display: flex;
  gap: 0.75rem;
  overflow: hidden;
  flex-direction: row;
}

/* 编辑模式 */
.note-editor-edit {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.note-editor-textarea {
  width: 100%;
  flex: 1;
  border: none;
  background: transparent;
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--text-primary);
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
  color: var(--text-primary);
}

/* 预览模式 - 完整高度 */
.note-editor-preview-full {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--text-primary);
  background: var(--bg-card);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
  /* 优化滚动性能 */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  will-change: scroll-position;
  /* 启用硬件加速 */
  transform: translateZ(0);
}

/* 预览模式 */
.note-editor-preview {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--text-primary);
  background: var(--bg-card);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
  /* 优化滚动性能 */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  will-change: scroll-position;
  /* 启用硬件加速 */
  transform: translateZ(0);
}

/* Markdown 预览样式 */
.note-editor-preview-full :deep(h1),
.note-editor-preview-full :deep(h2),
.note-editor-preview-full :deep(h3),
.note-editor-preview-full :deep(h4),
.note-editor-preview-full :deep(h5),
.note-editor-preview-full :deep(h6),
.note-editor-preview :deep(h1),
.note-editor-preview :deep(h2),
.note-editor-preview :deep(h3),
.note-editor-preview :deep(h4),
.note-editor-preview :deep(h5),
.note-editor-preview :deep(h6) {
  margin: 1.5rem 0 0.75rem;
  font-weight: 600;
  line-height: 1.25;
  color: var(--text-primary);
}

.note-editor-preview-full :deep(h1),
.note-editor-preview :deep(h1) {
  font-size: 1.875rem;
  border-bottom: 2px solid rgba(79, 70, 229, 0.3);
  padding-bottom: 0.5rem;
}

.note-editor-preview-full :deep(h2),
.note-editor-preview :deep(h2) {
  font-size: 1.5rem;
  border-bottom: 1px solid rgba(79, 70, 229, 0.2);
  padding-bottom: 0.5rem;
}

.note-editor-preview-full :deep(h3),
.note-editor-preview :deep(h3) {
  font-size: 1.25rem;
}

.note-editor-preview-full :deep(p),
.note-editor-preview :deep(p) {
  margin: 0.75rem 0;
  color: var(--text-primary);
}

.note-editor-preview-full :deep(ul),
.note-editor-preview-full :deep(ol),
.note-editor-preview :deep(ul),
.note-editor-preview :deep(ol) {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
  color: var(--text-primary);
}

.note-editor-preview-full :deep(li),
.note-editor-preview :deep(li) {
  margin: 0.25rem 0;
}

.note-editor-preview-full :deep(ul li),
.note-editor-preview :deep(ul li) {
  list-style-type: disc;
}

.note-editor-preview-full :deep(ol li),
.note-editor-preview :deep(ol li) {
  list-style-type: decimal;
}

/* 任务列表样式 */
.note-editor-preview-full :deep(li input[type="checkbox"]),
.note-editor-preview :deep(li input[type="checkbox"]) {
  margin-right: 0.5rem;
  accent-color: var(--accent-primary);
}

.note-editor-preview-full :deep(li input[type="checkbox"]:checked + span),
.note-editor-preview :deep(li input[type="checkbox"]:checked + span) {
  text-decoration: line-through;
  color: var(--text-muted);
}

.note-editor-preview-full :deep(a),
.note-editor-preview :deep(a) {
  color: var(--accent-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.note-editor-preview-full :deep(a:hover),
.note-editor-preview :deep(a:hover) {
  color: var(--accent-secondary);
  text-decoration: underline;
}

.note-editor-preview-full :deep(strong),
.note-editor-preview :deep(strong) {
  font-weight: 600;
  color: var(--accent-tertiary);
}

.note-editor-preview-full :deep(em),
.note-editor-preview :deep(em) {
  font-style: italic;
  color: var(--warning-color);
}

/* 高亮文本样式 */
.note-editor-preview-full :deep(mark),
.note-editor-preview :deep(mark) {
  background-color: rgba(251, 191, 36, 0.2);
  color: var(--warning-color);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}

.note-editor-preview-full :deep(code),
.note-editor-preview :deep(code) {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-size: 0.875em;
  padding: 0.125rem 0.375rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  color: var(--text-primary);
}

.note-editor-preview-full :deep(pre),
.note-editor-preview :deep(pre) {
  margin: 1rem 0;
  padding: 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow-x: auto;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}

.note-editor-preview-full :deep(pre code),
.note-editor-preview :deep(pre code) {
  background: transparent;
  border: none;
  padding: 0;
  color: var(--text-primary);
}

.note-editor-preview-full :deep(blockquote),
.note-editor-preview :deep(blockquote) {
  margin: 1rem 0;
  padding: 0 1rem;
  border-left: 4px solid var(--accent-primary);
  color: var(--text-muted);
  font-style: italic;
  background: rgba(99, 102, 241, 0.05);
  padding: 1rem;
  border-radius: 0.5rem;
}

.note-editor-preview-full :deep(hr),
.note-editor-preview :deep(hr) {
  margin: 1.5rem 0;
  border: none;
  border-top: 1px solid rgba(51, 65, 85, 0.8);
}

/* 表格样式 */
.note-editor-preview-full :deep(table),
.note-editor-preview :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.note-editor-preview-full :deep(th),
.note-editor-preview-full :deep(td),
.note-editor-preview :deep(th),
.note-editor-preview :deep(td) {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid rgba(51, 65, 85, 0.6);
}

.note-editor-preview-full :deep(th),
.note-editor-preview :deep(th) {
  background: rgba(15, 23, 42, 0.6);
  font-weight: 600;
  color: #c7d2fe;
  border-bottom: 2px solid rgba(79, 70, 229, 0.4);
}

.note-editor-preview-full :deep(tr:hover),
.note-editor-preview :deep(tr:hover) {
  background: rgba(15, 23, 42, 0.4);
}

/* 脚注样式 */
.note-editor-preview-full :deep(footer),
.note-editor-preview :deep(footer) {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(51, 65, 85, 0.6);
  font-size: 0.875rem;
  color: #94a3b8;
}

.note-editor-preview-full :deep(sup),
.note-editor-preview :deep(sup) {
  font-size: 0.75rem;
  vertical-align: super;
  color: #6366f1;
  cursor: pointer;
}

.note-editor-preview-full :deep(li sup),
.note-editor-preview :deep(li sup) {
  margin-left: 0.25rem;
}

/* 上标和下标样式 */
.note-editor-preview-full :deep(sup),
.note-editor-preview :deep(sup) {
  font-size: 0.75rem;
  vertical-align: super;
  line-height: 1;
}

.note-editor-preview-full :deep(sub),
.note-editor-preview :deep(sub) {
  font-size: 0.75rem;
  vertical-align: sub;
  line-height: 1;
  color: #94a3b8;
}

/* 标签样式 */
.note-editor-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
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
  background-color: var(--bg-card);
  padding: 0.375rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
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
  transition: all 0.2s ease;
  border-radius: 50%;
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
.note-editor-preview-full::-webkit-scrollbar,
.note-editor-preview::-webkit-scrollbar,
.note-editor-textarea::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.note-editor-preview-full::-webkit-scrollbar-track,
.note-editor-preview::-webkit-scrollbar-track,
.note-editor-textarea::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.4);
  border-radius: 4px;
}

.note-editor-preview-full::-webkit-scrollbar-thumb,
.note-editor-preview::-webkit-scrollbar-thumb,
.note-editor-textarea::-webkit-scrollbar-thumb {
  background: rgba(79, 70, 229, 0.4);
  border-radius: 4px;
  transition: background 0.2s ease;
}

.note-editor-preview-full::-webkit-scrollbar-thumb:hover,
.note-editor-preview::-webkit-scrollbar-thumb:hover,
.note-editor-textarea::-webkit-scrollbar-thumb:hover {
  background: rgba(79, 70, 229, 0.6);
}

/* 按钮样式 */
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

.btn-danger {
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

.btn-danger:hover {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.3));
  color: #fecdd3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-danger:active {
  transform: translateY(0);
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

/* 移动端优化 */
@media (max-width: 768px) {
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

/* 编辑器模式切换动画 - 重新设计，更适合布局切换 */
.editor-mode-enter-active,
.editor-mode-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: absolute;
  width: 100%;
  height: 100%;
}

.editor-mode-enter-from {
  opacity: 0;
  transform: translateY(5px);
  filter: blur(2px);
}

.editor-mode-leave-to {
  opacity: 0;
  transform: translateY(-5px);
  filter: blur(2px);
}

.editor-mode-enter-to,
.editor-mode-leave-from {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

/* 确保内容区域相对定位，让绝对定位的过渡元素正常工作 */
.note-editor-content {
  position: relative;
}

/* 确保编辑和预览容器高度一致，避免布局跳动 */
.note-editor-preview-full,
.note-editor-edit-container {
  height: 100%;
  min-height: 400px;
}

/* 编辑模式容器 */
.note-editor-edit-container {
  display: flex;
  gap: 0.75rem;
  flex: 1;
  overflow: hidden;
  flex-direction: row;
  height: 100%;
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
  
  /* 移动端编辑模式容器改为垂直排列 */
  .note-editor-edit-container {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .note-editor {
    margin: 0;
    border-radius: 0;
    cursor: pointer;
  }
  
  .note-editor-header {
    padding: 0.5rem 0.875rem;
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
  
  /* 移动端元数据输入 - 改为单行显示 */
  .note-editor-meta {
    flex-direction: row;
    gap: 0.5rem;
  }
  
  .note-editor-meta-input {
    flex: 1;
    min-width: 0;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
  }
  
  /* 移动端工具栏 */
  .note-editor-toolbar {
    padding: 0.5rem 0.75rem;
    gap: 0.5rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    overflow-x: auto;
    flex-wrap: nowrap;
    /* 优化滚动体验 */
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    scroll-behavior: smooth;
    position: sticky;
    top: 0;
    z-index: 10;
    /* 添加阴影，增强层次感 */
    box-shadow: var(--shadow-md);
  }

  .note-editor-toolbar::-webkit-scrollbar {
    display: none;
  }

  .toolbar-section {
    gap: 0.25rem;
    background: var(--bg-card);
    padding: 0.25rem;
    flex-shrink: 0;
    border-radius: 0.5rem;
    /* 添加边框，增强视觉效果 */
    border: 1px solid var(--border-color);
  }

  .toolbar-btn {
    padding: 0.4375rem 0.625rem;
    font-size: 0.7rem;
    min-width: 2.25rem;
    gap: 0.25rem;
    border-radius: 0.375rem;
    /* 增强触摸反馈 */
    touch-action: manipulation;
    -webkit-tap-highlight-color: rgba(99, 102, 241, 0.2);
  }
  
  /* 工具栏提示文字优化 */
  .toolbar-btn span {
    display: none;
  }
  
  .toolbar-btn {
    min-width: 2.25rem;
    min-height: 2.25rem;
    padding: 0.5rem;
    background: var(--bg-card);
    border-color: var(--border-color);
    color: var(--text-primary);
  }
  
  .toolbar-btn:hover {
    background: var(--bg-hover);
    border-color: var(--accent-primary);
    color: var(--accent-primary);
  }
  
  /* 移动端工具栏图标样式 */
  .toolbar-btn .i-lucide {
    color: currentColor;
    transition: color 0.2s ease;
    width: 0.875rem;
    height: 0.875rem;
    display: inline-block;
    vertical-align: middle;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  
  .toolbar-btn:hover .i-lucide {
    color: var(--accent-primary);
  }
  
  /* 深色主题下的移动端工具栏图标样式 */
  .dark .toolbar-btn .i-lucide {
    color: currentColor;
  }
  
  /* 确保所有工具栏图标都能正确显示 */
  .toolbar-btn .u-icon {
    color: currentColor;
    transition: color 0.2s ease;
    width: 0.875rem;
    height: 0.875rem;
    display: inline-block;
    vertical-align: middle;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  
  .toolbar-btn:hover .u-icon {
    color: var(--accent-primary);
  }
  
  /* 深色主题下的工具栏图标样式 */
  .dark .toolbar-btn .u-icon {
    color: currentColor;
  }
  
  .toolbar-section {
    gap: 0.375rem;
    background: var(--bg-secondary);
    border-color: var(--border-color);
  }
  
  /* 移动端内容区域 */
  .note-editor-content-wrapper {
    flex: 1;
    padding: 0.5rem;
    gap: 0.75rem;
  }
  
  /* 移动端分屏模式改为垂直排列 */
  .note-editor-content {
    flex-direction: column;
    height: 100%;
    gap: 0.5rem;
  }
  
  /* 移动端编辑和预览区域 */
  .note-editor-edit,
  .note-editor-preview {
    height: calc(50% - 0.25rem);
    min-height: 250px;
  }
  
  /* 移动端预览模式下，预览区域占满整个高度 */
  .note-editor-preview-full {
    height: 100%;
    min-height: 500px;
  }
  
  .note-editor-textarea,
  .note-editor-preview,
  .note-editor-preview-full {
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
  .note-editor-preview,
  .note-editor-preview-full {
    font-size: 0.8125rem;
    line-height: 1.5;
    padding: 0.75rem;
  }
  
  .note-editor-edit,
  .note-editor-preview,
  .note-editor-preview-full {
    min-height: 200px;
  }
  
  .note-editor-tags {
    padding: 0.625rem 0.75rem;
  }
  
  .note-editor-tag {
    padding: 0.25rem 0.625rem;
    font-size: 0.65rem;
  }
}
</style>