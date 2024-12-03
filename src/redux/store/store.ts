import { configureStore } from '@reduxjs/toolkit'
import {
  addCattleReducer,
  bottomSheetReducer,
  cattleQueryReducer,
  cattlesReducer,
  earningsQueryReducer,
  medicationsReducer,
  uiReducer,
  uiVisibilityReducer
} from '../slices'

const store = configureStore({
  reducer: {
    ui: uiReducer,
    bottomSheet: bottomSheetReducer,
    cattleQuery: cattleQueryReducer,
    uiVisibility: uiVisibilityReducer,
    medications: medicationsReducer,
    cattles:cattlesReducer,
    addCattle: addCattleReducer,
    earningsQuery: earningsQueryReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
