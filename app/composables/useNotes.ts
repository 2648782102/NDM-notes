export interface Note {
  id: string
  title: string
  content: string
  category: string | null
  tags: string[]
  createdAt: string
  updatedAt: string
}

export function useNotes() {
  const notes = ref<Note[]>([])
  const categories = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const clearError = () => {
    error.value = null
  }

  const loadNotes = async () => {
    clearError()
    loading.value = true
    try {
      const res = await $fetch<Note[]>('/api/notes', {
        credentials: 'include'
      })
      notes.value = res
    } catch (err: any) {
      error.value = err.message || 'Failed to load notes'
      console.error('Error loading notes:', err)
      notes.value = []
    } finally {
      loading.value = false
    }
  }

  const loadCategories = async () => {
    clearError()
    try {
      const res = await $fetch<string[]>('/api/categories', {
        credentials: 'include'
      })
      categories.value = res
    } catch (err: any) {
      error.value = err.message || 'Failed to load categories'
      console.error('Error loading categories:', err)
      categories.value = []
    }
  }

  const createNote = async (payload: {
    title: string
    content: string
    category: string | null
    tags: string[]
  }) => {
    clearError()
    try {
      const created = await $fetch<Note>('/api/notes', {
        method: 'POST',
        body: payload,
        credentials: 'include'
      })
      notes.value.unshift(created)
      await loadCategories()
      return created
    } catch (err: any) {
      error.value = err.message || 'Failed to create note'
      console.error('Error creating note:', err)
      throw err
    }
  }

  const updateNote = async (
    id: string,
    payload: {
      title: string
      content: string
      category: string | null
      tags: string[]
    }
  ) => {
    clearError()
    try {
      const updated = await $fetch<Note>(`/api/notes/${id}`, {
        method: 'PUT',
        body: payload,
        credentials: 'include'
      })
      const index = notes.value.findIndex((n) => n.id === id)
      if (index !== -1) {
        notes.value[index] = updated
      }
      await loadCategories()
      return updated
    } catch (err: any) {
      error.value = err.message || 'Failed to update note'
      console.error('Error updating note:', err)
      throw err
    }
  }

  const deleteNote = async (id: string) => {
    clearError()
    try {
      await $fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      notes.value = notes.value.filter((n) => n.id !== id)
      await loadCategories()
    } catch (err: any) {
      error.value = err.message || 'Failed to delete note'
      console.error('Error deleting note:', err)
      throw err
    }
  }

  const getNoteById = (id: string) => {
    return notes.value.find((n) => n.id === id)
  }

  return {
    notes,
    categories,
    loading,
    error,
    clearError,
    loadNotes,
    loadCategories,
    createNote,
    updateNote,
    deleteNote,
    getNoteById
  }
}

