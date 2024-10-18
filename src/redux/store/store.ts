import { configureStore } from '@reduxjs/toolkit'
import {
  bottomSheetReducer,
  homeCattleListQueryReducer,
  homeFiltersReducer,
  uiReducer,
  uiVisibilityReducer
} from '../slices'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    bottomSheet: bottomSheetReducer,
    homeFilters: homeFiltersReducer,
    homeCattleListQuery: homeCattleListQueryReducer,
    uiVisibility: uiVisibilityReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>

export default store
