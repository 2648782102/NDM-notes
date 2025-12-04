import type { Note } from './useNotes'

export function useEditor() {
  const editor = reactive({
    title: '',
    content: '',
    category: '',
    tags: [] as string[]
  })

  const currentNoteId = ref<string | null>(null)
  const saving = ref(false)
  const isEditing = ref(false) // 控制编辑模式
  const viewMode = ref<'edit' | 'preview' | 'split'>('split')
  const lastSaved = ref<Date | null>(null) // 记录最后保存时间

  // 添加防抖函数，用于自动保存
  const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null
    return (...args: Parameters<T>) => {
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  // 自动保存函数
  const autoSave = debounce(async () => {
    if (!currentNoteId.value || !isEditing.value) return
    
    try {
      saving.value = true
      const { updateNote } = useNotes()
      await updateNote(currentNoteId.value, {
        title: editor.title,
        content: editor.content,
        category: editor.category || null,
        tags: editor.tags
      })
      lastSaved.value = new Date()
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      saving.value = false
    }
  }, 3000) // 3秒自动保存一次

  // 监听编辑器内容变化，触发自动保存
  watch(
    () => [editor.title, editor.content, editor.category, editor.tags],
    () => {
      autoSave()
    },
    { deep: true }
  )

  const syncFromNote = (note: Note | null) => {
    if (!note) {
      editor.title = ''
      editor.content = ''
      editor.category = ''
      editor.tags = []
      currentNoteId.value = null
    } else {
      editor.title = note.title
      editor.content = note.content
      editor.category = note.category || ''
      editor.tags = [...note.tags]
      currentNoteId.value = note.id
    }
    // 同步笔记时退出编辑模式，进入预览模式
    isEditing.value = false
    lastSaved.value = new Date()
  }

  const reset = (defaultCategory?: string) => {
    editor.title = ''
    editor.content = ''
    editor.category = defaultCategory || ''
    editor.tags = []
    currentNoteId.value = null
    // 创建新笔记时退出编辑模式，进入预览模式
    isEditing.value = false
    lastSaved.value = null
  }

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (trimmed && !editor.tags.includes(trimmed)) {
      editor.tags.push(trimmed)
    }
  }

  const removeTag = (tag: string) => {
    const index = editor.tags.indexOf(tag)
    if (index > -1) {
      editor.tags.splice(index, 1)
    }
  }

  return {
    editor,
    currentNoteId,
    saving,
    isEditing,
    viewMode,
    lastSaved,
    syncFromNote,
    reset,
    addTag,
    removeTag
  }
}

