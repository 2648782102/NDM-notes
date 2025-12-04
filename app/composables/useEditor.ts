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
  }

  const reset = (defaultCategory?: string) => {
    editor.title = ''
    editor.content = ''
    editor.category = defaultCategory || ''
    editor.tags = []
    currentNoteId.value = null
    // 创建新笔记时退出编辑模式，进入预览模式
    isEditing.value = false
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
    syncFromNote,
    reset,
    addTag,
    removeTag
  }
}

