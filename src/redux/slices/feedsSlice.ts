import Feed from '@/database/models/Feed'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type FeedsState = {
  selectedFeed?: Feed
}

const initialState: FeedsState = {
  selectedFeed: undefined
}

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
    setSelectedFeed: (state, action: PayloadAction<Feed | undefined>) => {
      state.selectedFeed = action.payload
    }
  }
})

export const { setSelectedFeed } = feedsSlice.actions

export default feedsSlice.reducer
