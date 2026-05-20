export interface SubAccount {
  id: string
  name: string
  balance: number
}

export type AssetType = 'bank' | 'wechat' | 'alipay'

export interface AssetItem {
  id: string
  type: AssetType
  name: string
  balance: number
  subAccounts: SubAccount[]
  icon: string
  color: string
  updatedAt?: string
}

export interface AssetStore {
  assets: AssetItem[]
  addAsset: (asset: Omit<AssetItem, 'id' | 'updatedAt'>) => void
  updateAsset: (id: string, asset: Partial<AssetItem>) => void
  deleteAsset: (id: string) => void
  getTotalBalance: () => number
  getBalanceByType: (type: AssetType) => number
}