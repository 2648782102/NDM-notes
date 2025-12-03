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
  const viewMode = ref<'edit' | 'preview' | 'split'>('preview')

  const syncFromNote = (note: Note | null) => {
    if (!note) {
      editor.title = ''
      editor.content = ''
      editor.category = ''
      editor.tags = []
      currentNoteId.value = null
      return
    }
    editor.title = note.title
    editor.content = note.content
    editor.category = note.category || ''
    editor.tags = [...note.tags]
    currentNoteId.value = note.id
  }

  const reset = (defaultCategory?: string) => {
    editor.title = ''
    editor.content = ''
    editor.category = defaultCategory || ''
    editor.tags = []
    currentNoteId.value = null
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
    viewMode,
    syncFromNote,
    reset,
    addTag,
    removeTag
  }
}

