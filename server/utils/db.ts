import { randomUUID, createHash } from 'node:crypto'

// 检查是否在 Vercel 环境中
const isVercel = process.env.VERCEL === '1'

// 使用内存存储代替文件系统存储，适用于 Vercel 无服务器环境
export interface UserRecord {
  id: string
  username: string
  passwordHash: string
}

export interface NoteRecord {
  id: string
  userId: string
  title: string
  content: string
  category: string | null
  tags: string[]
  createdAt: string
  updatedAt: string
}

function hashPassword(raw: string) {
  return createHash('sha256').update(raw).digest('hex')
}

// 初始化内存存储
const users = new Map<string, UserRecord>()
const notes = new Map<string, NoteRecord>()

// 如果没有数据，初始化示例数据
if (users.size === 0) {
  // 开发环境：预置一个演示账号
  const seedUserId = randomUUID()
  const seedUser: UserRecord = {
    id: seedUserId,
    username: 'demo',
    passwordHash: hashPassword('demo123')
  }
  users.set(seedUser.username, seedUser)
  
  // 一些示例笔记
  const now = new Date().toISOString()
  ;[
    {
      title: '欢迎使用 NDM Notes',
      content: '这是一个基于 Nuxt 4 的现代化笔记应用示例，你可以在这里记录技术笔记。',
      category: '入门',
      tags: ['welcome', 'nuxt']
    },
    {
      title: '组件设计小技巧',
      content:
        '1. 保持单一职责\n2. 关注状态流向\n3. 利用组合式函数抽离逻辑\n4. 为交互添加细腻的过渡动画。',
      category: '前端',
      tags: ['vue', 'ui']
    }
  ].forEach((item) => {
    const id = randomUUID()
    notes.set(id, {
      id,
      userId: seedUserId,
      title: item.title,
      content: item.content,
      category: item.category,
      tags: item.tags,
      createdAt: now,
      updatedAt: now
    })
  })
}

// 导入 createError 函数
import { createError } from 'h3'

export function createUser(username: string, password: string): UserRecord {
  const existing = users.get(username)
  if (existing) {
    throw createError({
      statusCode: 400,
      message: '用户名已被占用'
    })
  }

  const record: UserRecord = {
    id: randomUUID(),
    username,
    passwordHash: hashPassword(password)
  }
  users.set(username, record)
  return record
}

export function verifyUser(username: string, password: string): UserRecord | null {
  const record = users.get(username)
  if (!record) return null
  const hash = hashPassword(password)
  if (hash !== record.passwordHash) return null
  return record
}

export function getUserById(id: string): UserRecord | null {
  for (const user of users.values()) {
    if (user.id === id) return user
  }
  return null
}

export function listNotesByUser(userId: string): NoteRecord[] {
  return Array.from(notes.values())
    .filter((n) => n.userId === userId)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
}

export function getNoteById(id: string, userId: string): NoteRecord | null {
  const note = notes.get(id)
  if (!note || note.userId !== userId) return null
  return note
}

export function createNote(
  userId: string,
  payload: { title: string; content: string; category?: string | null; tags?: string[] }
): NoteRecord {
  const id = randomUUID()
  const now = new Date().toISOString()
  const note: NoteRecord = {
    id,
    userId,
    title: payload.title || '未命名笔记',
    content: payload.content || '',
    category: payload.category ?? null,
    tags: payload.tags ?? [],
    createdAt: now,
    updatedAt: now
  }
  notes.set(id, note)
  return note
}

export function updateNote(
  id: string,
  userId: string,
  payload: Partial<Pick<NoteRecord, 'title' | 'content' | 'category' | 'tags'>>
): NoteRecord {
  const existing = getNoteById(id, userId)
  if (!existing) {
    throw createError({
      statusCode: 404,
      message: '笔记不存在'
    })
  }

  const updated: NoteRecord = {
    ...existing,
    ...payload,
    updatedAt: new Date().toISOString()
  }
  notes.set(id, updated)
  return updated
}

export function deleteNote(id: string, userId: string) {
  const existing = getNoteById(id, userId)
  if (!existing) {
    throw createError({
      statusCode: 404,
      message: '笔记不存在'
    })
  }
  notes.delete(id)
}

export function listCategoriesByUser(userId: string): string[] {
  const set = new Set<string>()
  for (const note of notes.values()) {
    if (note.userId !== userId) continue
    if (note.category) set.add(note.category)
  }
  return Array.from(set.values()).sort()
}


