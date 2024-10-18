import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type UiVisibilityState = {
  [key: string]: boolean
}

const initialState: UiVisibilityState = {}

const uiVisibilitySlice = createSlice({
  name: 'uiVisibility',
  initialState,
  reducers: {
    show: (state, action: PayloadAction<string>) => {
      state[action.payload] = true
    },
    hide: (state, action: PayloadAction<string>) => {
      state[action.payload] = false
    },
    reset: () => initialState
  }
})

export const { show, hide, reset } = uiVisibilitySlice.actions

export default uiVisibilitySlice.reducer
