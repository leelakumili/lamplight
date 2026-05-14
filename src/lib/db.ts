import { openDB, type IDBPDatabase } from 'idb'
import type { Setup, Story } from '../types'

let dbPromise: Promise<IDBPDatabase> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB('storythread', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('data')) {
          db.createObjectStore('data')
        }
        if (!db.objectStoreNames.contains('stories')) {
          db.createObjectStore('stories', { keyPath: 'id' })
        }
      },
    })
  }
  return dbPromise
}

export async function saveSetup(setup: Setup): Promise<void> {
  const db = await getDB()
  await db.put('data', setup, 'setup')
}

export async function loadSetup(): Promise<Setup | null> {
  try {
    const db = await getDB()
    const setup = await db.get('data', 'setup')
    return setup ?? null
  } catch {
    return null
  }
}

export async function saveStory(story: Story): Promise<void> {
  const db = await getDB()
  await db.put('stories', story)
}

export async function loadStories(): Promise<Story[]> {
  try {
    const db = await getDB()
    const stories = await db.getAll('stories')
    return stories.sort((a, b) => b.generatedAt - a.generatedAt)
  } catch {
    return []
  }
}

export async function deleteStory(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('stories', id)
}
