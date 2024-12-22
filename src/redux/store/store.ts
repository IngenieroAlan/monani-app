import { configureStore } from '@reduxjs/toolkit'
import {
  addCattleReducer,
  bottomSheetReducer,
  cattlesReducer,
  earningsQueryReducer,
  uiReducer,
  uiVisibilityReducer
} from '../slices'

const store = configureStore({
  reducer: {
    ui: uiReducer,
    bottomSheet: bottomSheetReducer,
    uiVisibility: uiVisibilityReducer,
    cattles: cattlesReducer,
    addCattle: addCattleReducer,
    earningsQuery: earningsQueryReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
