import Feed from '@/database/models/Feed'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type FeedsState = {
  records: Feed[]
  selectedFeed?: Feed
}

const initialState: FeedsState = {
  records: [],
  selectedFeed: undefined
}

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
    setFeeds: (state, action: PayloadAction<Feed[]>) => {
      state.records = action.payload
    },
    addFeed: (state, action: PayloadAction<Feed>) => {
      let index = state.records.findIndex((item) => {
        return item.name.toLowerCase().localeCompare(action.payload.name.toLowerCase()) > 0
      })

      index === -1 ? state.records.push(action.payload) : state.records.splice(index, 0, action.payload)
    },
    modifyFeed: (state, action: PayloadAction<{ oldName: string; new: Feed }>) => {
      const { oldName, new: newFeed } = action.payload
      const index = state.records.findIndex((item) => item.id === newFeed.id)
      const newName = newFeed.name.toLowerCase()

      if (oldName.toLowerCase() === newName) return

      state.records.splice(index, 1)
      let newIndex = -1

      if (newName.localeCompare(oldName) < 0) {
        newIndex = state.records.findIndex((item) => {
          return item.name.toLowerCase().localeCompare(newName) > 0
        })
      } else {
        newIndex = state.records.slice(index).findIndex((item) => {
          return item.name.toLowerCase().localeCompare(newName) > 0
        })

        if (newIndex !== -1) newIndex += index
      }

      newIndex === -1 ? state.records.push(newFeed) : state.records.splice(newIndex, 0, newFeed)
    },
    removeFeed: (state, action: PayloadAction<Feed>) => {
      const index = state.records.findIndex((item) => item.id === action.payload.id)
      state.records.splice(index, 1)
    },
    setSelectedFeed: (state, action: PayloadAction<Feed | undefined>) => {
      state.selectedFeed = action.payload
    }
  }
})

export const { setFeeds, addFeed, modifyFeed, removeFeed, setSelectedFeed } = feedsSlice.actions

export default feedsSlice.reducer
