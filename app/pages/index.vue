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
        @save="handleSave"
        @delete="handleDelete"
        @tag-add="handleAddTag"
        @tag-remove="handleRemoveTag"
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>返回列表</span>
            </button>
            <h2 class="mobile-editor-title">{{ editor.editor.title || '新建笔记' }}</h2>
            <div class="mobile-editor-actions">
              <button
                v-if="editor.currentNoteId.value"
                class="btn-ghost btn-delete-mobile"
                @click="handleDeleteMobile"
                title="删除笔记"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
          </div>
          
          <!-- 编辑视图内容 -->
          <div class="mobile-editor-content">
            <NoteEditor
              :editor="editor.editor"
              :current-note-id="editor.currentNoteId.value"
              :saving="editor.saving.value"
              @save="handleSaveMobile"
              @delete="handleDeleteMobile"
              @tag-add="handleAddTag"
              @tag-remove="handleRemoveTag"
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

const handleSelectNote = (id: string) => {
  const note = getNoteById(id)
  editor.syncFromNote(note || null)
}

const handleSelectNoteMobile = (id: string) => {
  const note = getNoteById(id)
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
  await deleteNote(id)
  editor.reset(activeCategory.value || undefined)
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
  background-color: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(51, 65, 85, 0.85);
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
  padding: 1rem;
  background: rgba(15, 23, 42, 0.9);
  border-bottom: 1px solid rgba(51, 65, 85, 0.8);
  backdrop-filter: blur(12px);
}

.mobile-header-left {
  flex: 1;
}

.mobile-header-title {
  font-size: 1.125rem;
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
  padding: 0.625rem 1rem;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
}

.btn-mobile-new:hover {
  background: linear-gradient(135deg, var(--accent-secondary), var(--accent-tertiary));
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(129, 140, 248, 0.4);
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
  background: rgba(15, 23, 42, 0.95);
  border-top: 1px solid rgba(51, 65, 85, 0.8);
  backdrop-filter: blur(12px);
  z-index: 1001;
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
}

.mobile-editor-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-delete-mobile {
  height: 2.25rem;
  padding: 0 1rem;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(244, 63, 94, 0.4);
  background: rgba(244, 63, 94, 0.05);
  color: #fda4af;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.btn-delete-mobile:hover {
  background: rgba(244, 63, 94, 0.15);
  border-color: rgba(244, 63, 94, 0.6);
  color: #fecdd3;
  transform: translateY(-1px);
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