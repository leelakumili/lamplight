import { openDB, type IDBPDatabase } from 'idb'
import type { Setup, Story, Profile } from '../types'
import { encryptField, decryptField } from './crypto'

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
  const toStore = { ...setup, apiKey: await encryptField(setup.apiKey) }
  await db.put('data', toStore, 'setup')
}

export async function loadSetup(): Promise<Setup | null> {
  try {
    const db = await getDB()
    const raw = await db.get('data', 'setup')
    if (!raw) return null
    const setup: Setup = { ...raw, apiKey: await decryptField(raw.apiKey) }
    // Migrate legacy plain-text keys: re-save encrypted immediately.
    if (raw.apiKey && !raw.apiKey.startsWith('enc:')) {
      await saveSetup(setup)
    }
    return setup
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

export async function saveProfiles(profiles: Profile[]): Promise<void> {
  const db = await getDB()
  await db.put('data', profiles, 'profiles')
}

export async function loadProfiles(): Promise<Profile[]> {
  try {
    const db = await getDB()
    const profiles = await db.get('data', 'profiles')
    return profiles ?? []
  } catch {
    return []
  }
}

export async function saveActiveProfileId(id: string | null): Promise<void> {
  const db = await getDB()
  await db.put('data', id, 'activeProfileId')
}

export async function loadActiveProfileId(): Promise<string | null> {
  try {
    const db = await getDB()
    const id = await db.get('data', 'activeProfileId')
    return id ?? null
  } catch {
    return null
  }
}
