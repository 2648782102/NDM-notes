<template>
  <div class="notes-page">
    <!-- 桌面端：水平布局 -->
    <div class="notes-desktop-layout">
      <NoteList
        :notes="notes"
        :categories="categories"
        :active-category="activeCategory"
        :current-id="editor.currentNoteId.value"
        :loading="notesLoading"
        @new-note="handleNewNote"
        @filter-change="handleFilterChange"
        @select="handleSelectNote"
      />

      <NoteEditor
        :editor="editor.editor"
        :current-note-id="editor.currentNoteId.value"
        :saving="editor.saving.value"
        :is-editing="editor.isEditing.value"
        @save="handleSave"
        @delete="handleDelete"
        @tag-add="handleAddTag"
        @tag-remove="handleRemoveTag"
        @update:is-editing="editor.isEditing.value = $event"
      />
    </div>
    
    <!-- 移动端：列表视图 -->
    <div class="notes-mobile-layout">
      <!-- 顶部操作栏 -->
      <div class="mobile-header">
        <div class="mobile-header-left">
          <h1 class="mobile-header-title">我的笔记</h1>
        </div>
        <div class="mobile-header-right">
          <button class="btn-primary btn-mobile-new" @click="handleNewNoteMobile">
            <UIcon name="i-lucide-plus" size="sm" />
            新建
          </button>
        </div>
      </div>
      
      <!-- 笔记列表 -->
      <NoteList
        :notes="notes"
        :categories="categories"
        :active-category="activeCategory"
        :current-id="editor.currentNoteId.value"
        :loading="notesLoading"
        @new-note="handleNewNoteMobile"
        @filter-change="handleFilterChange"
        @select="handleSelectNoteMobile"
      />
      
      <!-- 移动端编辑视图 - 全屏覆盖 -->
      <Transition name="mobile-editor" mode="out-in">
        <div v-if="isMobileEditorOpen" class="mobile-editor-overlay">
          <!-- 编辑视图头部 -->
          <div class="mobile-editor-header">
            <button class="mobile-back-btn" @click="closeMobileEditor">
              <UIcon name="i-lucide-arrow-left" size="sm" />
              <span>返回列表</span>
            </button>
            <h2 class="mobile-editor-title">{{ editor.editor.title || '新建笔记' }}</h2>
            <div class="mobile-editor-actions">
              <!-- 保存和删除按钮只在编辑模式下显示 -->
              <template v-if="editor.isEditing">
                <!-- 保存按钮 -->
                <button
                  class="btn-primary btn-save-mobile"
                  :disabled="editor.saving.value"
                  @click="handleSaveMobile"
                  title="保存笔记"
                >
                  <span v-if="editor.saving.value" class="spinner-small"></span>
                  <UIcon v-else name="i-lucide-save" size="xs" />
                </button>
                <!-- 删除按钮 -->
                <button
                  v-if="editor.currentNoteId"
                  class="btn-danger btn-delete-mobile"
                  @click="handleDeleteMobile"
                  title="删除笔记"
                >
                  <UIcon name="i-lucide-trash" size="xs" />
                </button>
              </template>
            </div>
          </div>
          
          <!-- 编辑视图内容 -->
          <div class="mobile-editor-content">
            <NoteEditor
              :editor="editor.editor"
              :current-note-id="editor.currentNoteId.value"
              :saving="editor.saving.value"
              :is-editing="editor.isEditing.value"
              @save="handleSaveMobile"
              @delete="handleDeleteMobile"
              @tag-add="handleAddTag"
              @tag-remove="handleRemoveTag"
              @update:is-editing="editor.isEditing.value = $event"
            />
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, status: authStatus } = useAuth()
const { notes, categories, loading: notesLoading, loadNotes, loadCategories, createNote, updateNote, deleteNote, getNoteById } = useNotes()
const editor = useEditor()

const activeCategory = ref<string | null>(null)
const isMobileEditorOpen = ref(false)

const handleNewNote = () => {
  editor.reset(activeCategory.value || undefined)
}

const handleNewNoteMobile = () => {
  editor.reset(activeCategory.value || undefined)
  isMobileEditorOpen.value = true
}

const handleFilterChange = (category: string | null) => {
  activeCategory.value = category
}

const handleSelectNote = async (id: string) => {
    const note = getNoteById(id)
    // 切换笔记前自动保存当前笔记
    await saveNote()
    // 切换笔记前退出编辑模式
    editor.isEditing.value = false
    editor.syncFromNote(note || null)
  }

  const handleSelectNoteMobile = async (id: string) => {
    const note = getNoteById(id)
    // 切换笔记前自动保存当前笔记
    await saveNote()
    // 切换笔记前退出编辑模式
    editor.isEditing.value = false
    editor.syncFromNote(note || null)
    isMobileEditorOpen.value = true
  }

const handleAddTag = (tag: string) => {
  editor.addTag(tag)
}

const handleRemoveTag = (tag: string) => {
  editor.removeTag(tag)
}

const handleSave = async () => {
  await saveNote()
}

const handleSaveMobile = async () => {
  await saveNote()
}

const saveNote = async () => {
    editor.saving.value = true
    try {
      const payload = {
        title: editor.editor.title,
        content: editor.editor.content,
        category: editor.editor.category || null,
        tags: editor.editor.tags
      }

      if (editor.currentNoteId.value) {
        await updateNote(editor.currentNoteId.value, payload)
      } else {
        const created = await createNote(payload)
        editor.currentNoteId.value = created.id
      }
      // 保存成功后退出编辑模式，恢复预览模式
      editor.isEditing.value = false
      // 保存成功后自动关闭移动端编辑器，返回列表页
      if (isMobileEditorOpen.value) {
        isMobileEditorOpen.value = false
      }
    } finally {
      editor.saving.value = false
    }
  }

const handleDelete = async () => {
  await deleteNoteAction()
}

const handleDeleteMobile = async () => {
  await deleteNoteAction()
  isMobileEditorOpen.value = false
}

const deleteNoteAction = async () => {
  if (!editor.currentNoteId.value) return
  const id = editor.currentNoteId.value
  
  // 获取当前笔记在数组中的索引
  const currentIndex = notes.value.findIndex(note => note.id === id)
  await deleteNote(id)
  
  // 删除后自动切换到下一个可用笔记
  if (notes.value.length > 0) {
    // 如果有下一个笔记，切换到下一个
    // 如果没有下一个笔记但有前一个笔记，切换到前一个
    // 否则切换到第一个笔记
    const nextIndex = currentIndex < notes.value.length ? currentIndex : Math.max(0, currentIndex - 1)
    const nextNote = notes.value[nextIndex]
    editor.syncFromNote(nextNote)
  } else {
    // 如果没有笔记了，清空编辑器状态
    editor.syncFromNote(null)
  }
}

const closeMobileEditor = () => {
  isMobileEditorOpen.value = false
}

onMounted(async () => {
  if (authStatus.value === 'loading') {
    await new Promise<void>((resolve) => {
      const unwatch = watch(authStatus, (status) => {
        if (status !== 'loading') {
          unwatch()
          resolve()
        }
      })
    })
  }

  if (user.value) {
    await Promise.all([loadNotes(), loadCategories()])
    const first = notes.value[0]
    if (first) {
      editor.syncFromNote(first)
    }
  }
})
</script>

<style scoped>
/* 主页面布局 - 无滚动条设计 */
.notes-page {
  display: flex;
  width: 100%;
  gap: 1.5rem;
  height: 100%;
  flex: 1;
  overflow: hidden;
}

/* 桌面端布局 - 水平分栏 */
.notes-desktop-layout {
  display: flex;
  width: 100%;
  gap: 1.5rem;
  height: 100%;
  flex: 1;
  overflow: hidden;
}

/* 移动端布局 - 垂直布局 */
.notes-mobile-layout {
  display: none;
  width: 100%;
  height: 100%;
  flex-direction: column;
  background: var(--bg-primary);
  overflow: hidden;
}

/* 加载状态 */
.notes-page-loading {
  justify-content: space-between;
}

.notes-loading-skeleton {
  flex: 1;
  height: 100%;
  border-radius: 1rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  backdrop-filter: blur(24px);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 移动端顶部操作栏 */
.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(12px);
}

.mobile-header-left {
  flex: 1;
}

.mobile-header-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.mobile-header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-mobile-new {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  font-size: 0.8125rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-md);
}

.btn-mobile-new:hover {
  background: linear-gradient(135deg, var(--accent-secondary), var(--accent-tertiary));
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

/* 移动端编辑视图 - 全屏覆盖 */
.mobile-editor-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-primary);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 移动端编辑视图头部 - 优化位置 */
.mobile-editor-header {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-card);
  border-top: 1px solid var(--border-color);
  backdrop-filter: blur(12px);
  z-index: 1001;
  box-shadow: var(--shadow-md);
  /* 增强底部操作栏的视觉层次 */
  border-radius: 1rem 1rem 0 0;
}

/* 移动端编辑内容区域 - 占据全屏除底部按钮栏 */
.mobile-editor-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-bottom: 60px; /* 为底部按钮栏留出空间 */
}

/* 移动端返回按钮 */
.mobile-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-secondary);
  padding: 0.625rem 1rem;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.875rem;
  font-weight: 500;
  min-height: 2.5rem;
  min-width: 2.5rem;
}

.mobile-back-btn:hover {
  border-color: var(--accent-primary);
  color: var(--accent-tertiary);
  transform: translateY(-1px);
}

.mobile-editor-title {
  flex: 1;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  padding: 0 0.5rem;
}

.mobile-editor-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 移动端保存按钮 */
.btn-save-mobile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2.25rem;
  width: 2.25rem;
  padding: 0;
  border-radius: var(--radius-lg);
  border: 1px solid var(--accent-primary);
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
}

.btn-save-mobile:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--accent-secondary), var(--accent-tertiary));
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(129, 140, 248, 0.4);
}

.btn-save-mobile:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 移动端删除按钮优化 */
.btn-delete-mobile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2.25rem;
  width: 2.25rem;
  padding: 0;
  border-radius: var(--radius-lg);
  border: 1px solid var(--error-color);
  background: var(--bg-card);
  color: var(--error-color);
  cursor: pointer;
  transition: var(--transition);
}

.btn-delete-mobile:hover {
  background: var(--error-color);
  border-color: var(--error-color);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);
}

/* 小加载动画 */
.spinner-small {
  display: inline-block;
  width: 0.625rem;
  height: 0.625rem;
  border: 2px solid var(--border-color);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 优化移动端标题和分类输入框 */
.mobile-editor-content .note-editor-title-input,
.mobile-editor-content .note-editor-meta-input {
  font-size: 0.9375rem;
  padding: 0.625rem 0.875rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  transition: var(--transition);
}

.mobile-editor-content .note-editor-title-input:focus,
.mobile-editor-content .note-editor-meta-input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  background: var(--bg-hover);
}

/* 优化移动端元数据布局 */
.mobile-editor-content .note-editor-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  width: 100%;
}

.mobile-editor-content .note-editor-meta-input {
  flex: 1;
  min-width: 0;
  height: 2.25rem;
}

/* 移动端编辑视图过渡动画 */
.mobile-editor-enter-active,
.mobile-editor-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-editor-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.mobile-editor-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

/* 移动端图标样式优化 */
.mobile-editor-content .i-lucide,
.mobile-editor-content .u-icon {
  color: currentColor;
  transition: color 0.2s ease;
  width: 1rem;
  height: 1rem;
  display: inline-block;
  vertical-align: middle;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mobile-editor-content .toolbar-btn .i-lucide,
.mobile-editor-content .toolbar-btn .u-icon {
  width: 0.875rem;
  height: 0.875rem;
}

/* 移动端保存和删除按钮图标样式 */
.btn-save-mobile .i-lucide,
.btn-save-mobile .u-icon,
.btn-delete-mobile .i-lucide,
.btn-delete-mobile .u-icon {
  color: currentColor;
  transition: color 0.2s ease;
  width: 0.75rem;
  height: 0.75rem;
  display: inline-block;
  vertical-align: middle;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* 移动端返回按钮图标样式 */
.mobile-back-btn .i-lucide,
.mobile-back-btn .u-icon {
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

/* 深色主题下的图标样式 */
.dark .mobile-editor-content .i-lucide,
.dark .mobile-editor-content .u-icon,
.dark .btn-save-mobile .i-lucide,
.dark .btn-save-mobile .u-icon,
.dark .btn-delete-mobile .i-lucide,
.dark .btn-delete-mobile .u-icon,
.dark .mobile-back-btn .i-lucide,
.dark .mobile-back-btn .u-icon {
  color: currentColor;
}

/* 确保移动端工具栏图标在所有状态下都能正确显示 */
.mobile-editor-content .toolbar-btn:hover .i-lucide,
.mobile-editor-content .toolbar-btn:hover .u-icon {
  color: var(--accent-primary);
}

/* 确保移动端保存和删除按钮图标在所有状态下都能正确显示 */
.btn-save-mobile:hover .i-lucide,
.btn-save-mobile:hover .u-icon,
.btn-delete-mobile:hover .i-lucide,
.btn-delete-mobile:hover .u-icon {
  color: white;
}

/* 确保移动端返回按钮图标在所有状态下都能正确显示 */
.mobile-back-btn:hover .i-lucide,
.mobile-back-btn:hover .u-icon {
  color: var(--accent-primary);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .notes-desktop-layout {
    flex-direction: column;
    gap: 1rem;
  }
  
  .notes-loading-skeleton {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .notes-desktop-layout {
    display: none;
  }
  
  .notes-mobile-layout {
    display: flex;
  }
  
  .notes-page {
    gap: 0;
    padding: 0;
  }
  
  .mobile-header {
    padding: 0.75rem;
  }
  
  .mobile-header-title {
    font-size: 1rem;
  }
  
  .btn-mobile-new {
    padding: 0.5rem 0.875rem;
    font-size: 0.8125rem;
    gap: 0.4375rem;
  }
  
  .mobile-editor-header {
    padding: 0.625rem 0.75rem;
    gap: 0.5rem;
  }
  
  .mobile-back-btn {
    padding: 0.5rem 0.875rem;
    font-size: 0.8125rem;
  }
  
  .mobile-editor-title {
    font-size: 0.9375rem;
  }
  
  .btn-delete-mobile {
    padding: 0 0.875rem;
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .mobile-editor-header {
    padding: 0.5rem 0.625rem;
    gap: 0.375rem;
  }
  
  .mobile-back-btn {
    padding: 0.4375rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .mobile-editor-title {
    font-size: 0.875rem;
  }
}
</style>