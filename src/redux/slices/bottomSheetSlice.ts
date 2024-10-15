import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type BottomSheetState = {
  [key: string]: number
}

const initialState: BottomSheetState = {}

const bottomSheetSlice = createSlice({
  name: 'bottomSheet',
  initialState,
  reducers: {
    setIndex: (state, action: PayloadAction<{ id: string; index: number }>) => {
      const { id, index } = action.payload
      state[id] = index
    },
    open: (state, action: PayloadAction<string>) => {
      state[action.payload] = 0
    },
    close: (state, action: PayloadAction<string>) => {
      state[action.payload] = -1
    }
  }
})

export const { setIndex, open, close } = bottomSheetSlice.actions

export default bottomSheetSlice.reducer
