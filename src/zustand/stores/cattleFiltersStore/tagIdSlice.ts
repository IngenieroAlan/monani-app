import { CattleFilterSlice, TagIdSlice } from './types'

const createTagIdSlice: CattleFilterSlice<TagIdSlice> = (set, get) => ({
  tagId: '',
  setTagId: (tagId) => {
    get().resetIndex()
    set((state) => {
      state.tagId = tagId
    })
  }
})

export default createTagIdSlice
