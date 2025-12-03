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

  const loadNotes = async () => {
    loading.value = true
    try {
      const res = await $fetch<Note[]>('/api/notes', {
        credentials: 'include'
      })
      notes.value = res
    } finally {
      loading.value = false
    }
  }

  const loadCategories = async () => {
    const res = await $fetch<string[]>('/api/categories', {
      credentials: 'include'
    })
    categories.value = res
  }

  const createNote = async (payload: {
    title: string
    content: string
    category: string | null
    tags: string[]
  }) => {
    const created = await $fetch<Note>('/api/notes', {
      method: 'POST',
      body: payload,
      credentials: 'include'
    })
    notes.value.unshift(created)
    await loadCategories()
    return created
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
  }

  const deleteNote = async (id: string) => {
    await $fetch(`/api/notes/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    notes.value = notes.value.filter((n) => n.id !== id)
    await loadCategories()
  }

  const getNoteById = (id: string) => {
    return notes.value.find((n) => n.id === id)
  }

  return {
    notes,
    categories,
    loading,
    loadNotes,
    loadCategories,
    createNote,
    updateNote,
    deleteNote,
    getNoteById
  }
}

