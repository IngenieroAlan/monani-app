import Feed from '@/database/models/Feed'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ResourcesState = {
  selectedFeed?: Feed
  fetchFeeds: boolean
}

const initialState: ResourcesState = {
  selectedFeed: undefined,
  fetchFeeds: false
}

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setSelectedFeed: (state, action: PayloadAction<Feed | undefined>) => {
      state.selectedFeed = action.payload
    },
    setFetchFeeds: (state, action: PayloadAction<boolean>) => {
      state.fetchFeeds = action.payload
    }
  }
})

export const { setSelectedFeed, setFetchFeeds } = resourcesSlice.actions

export default resourcesSlice.reducer
