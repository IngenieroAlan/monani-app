import Feed from '@/database/models/Feed'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ResourcesState = {
  feeds: Feed[]
  selectedFeed?: Feed
}

const initialState: ResourcesState = {
  feeds: [],
  selectedFeed: undefined
}

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setFeeds: (state, action: PayloadAction<Feed[]>) => {
      state.feeds = action.payload
    },
    addFeed: (state, action: PayloadAction<Feed>) => {
      let index = state.feeds.findIndex((item) => {
        return item.name.toLowerCase().localeCompare(action.payload.name.toLowerCase()) > 0
      })

      index === -1 ? state.feeds.push(action.payload) : state.feeds.splice(index, 0, action.payload)
    },
    updateFeed: (state, action: PayloadAction<{ oldName: string; new: Feed }>) => {
      const { oldName, new: newFeed } = action.payload
      const index = state.feeds.findIndex((item) => item.id === newFeed.id)
      const newName = newFeed.name.toLowerCase()

      if (oldName.toLowerCase() === newName) return

      state.feeds.splice(index, 1)
      let newIndex = -1

      if (newName.localeCompare(oldName) < 0) {
        newIndex = state.feeds.findIndex((item) => {
          return item.name.toLowerCase().localeCompare(newName) > 0
        })
      } else {
        newIndex = state.feeds.slice(index).findIndex((item) => {
          return item.name.toLowerCase().localeCompare(newName) > 0
        })

        if (newIndex !== -1) newIndex += index
      }

      newIndex === -1 ? state.feeds.push(newFeed) : state.feeds.splice(newIndex, 0, newFeed)
    },
    deleteFeed: (state, action: PayloadAction<Feed>) => {
      const index = state.feeds.findIndex((item) => item.id === action.payload.id)
      state.feeds.splice(index, 1)
    },
    setSelectedFeed: (state, action: PayloadAction<Feed | undefined>) => {
      state.selectedFeed = action.payload
    }
  }
})

export const { setFeeds, addFeed, updateFeed, deleteFeed, setSelectedFeed } = resourcesSlice.actions

export default resourcesSlice.reducer
