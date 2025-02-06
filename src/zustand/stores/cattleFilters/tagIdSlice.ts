import { CattleFilterSlice, TagIdSlice } from './types'

const createTagIdSlice: CattleFilterSlice<TagIdSlice> = (set, get) => ({
  tagId: '',
  setTagId: (tagId) => {
    set((state) => {
      state.tagId = tagId
    })
  }
})

export default createTagIdSlice
