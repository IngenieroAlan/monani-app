import { configureStore } from '@reduxjs/toolkit'
import {
  addCattleReducer,
  bottomSheetReducer,
  cattleQueryReducer,
  earningsQueryReducer,
  feedsReducer,
  medicationsReducer,
  notificationsReducer,
  uiReducer,
  uiVisibilityReducer
} from '../slices'

const store = configureStore({
  reducer: {
    ui: uiReducer,
    bottomSheet: bottomSheetReducer,
    cattleQuery: cattleQueryReducer,
    uiVisibility: uiVisibilityReducer,
    notifications: notificationsReducer,
    feeds: feedsReducer,
    medications: medicationsReducer,
    addCattle: addCattleReducer,
    earningsQuery: earningsQueryReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
