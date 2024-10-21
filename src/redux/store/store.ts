import { configureStore } from '@reduxjs/toolkit'
import {
  bottomSheetReducer,
  homeCattleListQueryReducer,
  homeFiltersReducer,
  notificationsReducer,
  resourcesReducer,
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
    resources: resourcesReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
