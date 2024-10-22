import { configureStore } from '@reduxjs/toolkit'
import {
  bottomSheetReducer,
  feedsReducer,
  homeCattleListQueryReducer,
  homeFiltersReducer,
  notificationsReducer,
  uiReducer,
  uiVisibilityReducer
} from '../slices'

const store = configureStore({
  reducer: {
    ui: uiReducer,
    bottomSheet: bottomSheetReducer,
    homeFilters: homeFiltersReducer,
    homeCattleListQuery: homeCattleListQueryReducer,
    uiVisibility: uiVisibilityReducer,
    notifications: notificationsReducer,
    feeds: feedsReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
