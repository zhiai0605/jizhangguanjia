import { create } from 'zustand'
import type { AssetItem, AssetType, AssetStore } from '@/types'

const STORAGE_KEY = 'asset-tracker-data'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function loadFromStorage(): AssetItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch {}
  return []
}

function saveToStorage(assets: AssetItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets))
  } catch {}
}

export const useAssetStore = create<AssetStore>((set, get) => ({
  assets: loadFromStorage(),

  addAsset: (asset) => {
    const newAsset: AssetItem = { ...asset, id: generateId(), updatedAt: new Date().toISOString() }
    const updated = [...get().assets, newAsset]
    saveToStorage(updated)
    set({ assets: updated })
  },

  updateAsset: (id, partial) => {
    const updated = get().assets.map((a) =>
      a.id === id ? { ...a, ...partial, updatedAt: new Date().toISOString() } : a
    )
    saveToStorage(updated)
    set({ assets: updated })
  },

  deleteAsset: (id) => {
    const updated = get().assets.filter((a) => a.id !== id)
    saveToStorage(updated)
    set({ assets: updated })
  },

  getTotalBalance: () => {
    return get().assets.reduce((sum, a) => sum + a.balance, 0)
  },

  getBalanceByType: (type: AssetType) => {
    return get().assets
      .filter((a) => a.type === type)
      .reduce((sum, a) => sum + a.balance, 0)
  },
}))