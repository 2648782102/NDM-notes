import { ref, reactive, watch, type Ref } from 'vue'
import type { Note } from './useNotes'

// 定义编辑器状态类型
interface EditorState {
  title: string
  content: string
  category: string
  tags: string[]
}

// 定义useEditor返回类型
interface UseEditorReturn {
  editor: EditorState
  currentNoteId: Ref<string | null>
  saving: Ref<boolean>
  isEditing: Ref<boolean>
  viewMode: Ref<'edit' | 'preview' | 'split'>
  lastSaved: Ref<Date | null>
  isDirty: Ref<boolean> // 添加内容是否有变化的标记
  syncFromNote: (note: Note | null) => void
  reset: (defaultCategory?: string) => void
  addTag: (tag: string) => void
  removeTag: (tag: string) => void
  saveEditorState: () => void // 保存当前编辑器状态作为参考，用于比较内容变化
}

export function useEditor(): UseEditorReturn {
  const editor = reactive<EditorState>({
    title: '',
    content: '',
    category: '',
    tags: []
  })

  const currentNoteId = ref<string | null>(null)
  const saving = ref(false)
  const isEditing = ref(false) // 控制编辑模式
  const viewMode = ref<'edit' | 'preview' | 'split'>('split')
  const lastSaved = ref<Date | null>(null) // 记录最后保存时间
  const isDirty = ref(false) // 标记内容是否有变化
  
  // 保存上一次同步或保存时的编辑器状态，用于检测内容变化
  const lastSyncedEditor = ref<EditorState>({ ...editor })

  // 保存当前编辑器状态，用于后续比较内容变化
  const saveEditorState = () => {
    lastSyncedEditor.value = {
      title: editor.title,
      content: editor.content,
      category: editor.category,
      tags: [...editor.tags]
    }
    isDirty.value = false
    lastSaved.value = new Date()
  }

  // 监听编辑器内容变化，检测是否有修改
  watch(
    () => [editor.title, editor.content, editor.category, editor.tags],
    () => {
      // 比较当前状态与上一次保存的状态
      const currentState = {
        title: editor.title,
        content: editor.content,
        category: editor.category,
        tags: [...editor.tags]
      }
      
      // 简单的深度比较，检查内容是否有变化
      isDirty.value = JSON.stringify(currentState) !== JSON.stringify(lastSyncedEditor.value)
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
    // 保存当前状态作为参考
    saveEditorState()
  }

  const reset = (defaultCategory?: string) => {
    editor.title = ''
    editor.content = ''
    editor.category = defaultCategory || ''
    editor.tags = []
    currentNoteId.value = null
    // 创建新笔记时退出编辑模式，进入预览模式
    isEditing.value = false
    // 保存当前状态作为参考
    saveEditorState()
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
    isDirty,
    syncFromNote,
    reset,
    addTag,
    removeTag,
    saveEditorState
  }
}

