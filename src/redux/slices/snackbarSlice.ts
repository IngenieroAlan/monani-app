import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SnackbarState = {
  [key: string]: boolean
}

const initialState: SnackbarState = {}

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    show: (state, action: PayloadAction<string>) => {
      state[action.payload] = true
    },
    hide: (state, action: PayloadAction<string>) => {
      state[action.payload] = false
    }
  }
})

export const { show, hide } = snackbarSlice.actions

export default snackbarSlice.reducer
