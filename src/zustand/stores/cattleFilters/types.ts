import { CattleStatus, ProductionType } from '@/database/models/Cattle'
import { StateCreator } from 'zustand'
import { PaginateIndexSlice } from '../types'

export type TagIdSlice = {
  tagId: string
  setTagId: (tagId: string) => void
}

export type CattleStatusSlice = {
  cattleStatus: Set<CattleStatus>
  addCattleStatus: (cattleStatus: CattleStatus) => void
  removeCattleStatus: (cattleStatus: CattleStatus) => void
  clearCattleStatus: () => void
}

export type ProductionTypeSlice = {
  productionType: ProductionType | undefined
  setProductionType: (productionType: ProductionType | undefined) => void
}

export type CattleFlags = {
  isActive?: boolean
  isArchived?: boolean
  isSold?: boolean
}

export type CattleFlagsSlice = {
  flags: CattleFlags
  setFlag: (flag: keyof CattleFlags) => void
  removeFlag: (flag: keyof CattleFlags) => void
  clearFlags: () => void
}

export type QuarantineSlice = {
  isInQuarantine: boolean | undefined
  setIsInQuarantine: (isInQuarantine: boolean | undefined) => void
}

export type CattleFiltersStore = PaginateIndexSlice &
  TagIdSlice &
  CattleStatusSlice &
  ProductionTypeSlice &
  CattleFlagsSlice &
  QuarantineSlice

export type CattleFilterSlice<T> = StateCreator<CattleFiltersStore, [['zustand/immer', never]], [], T>
