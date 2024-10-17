import { configureStore } from '@reduxjs/toolkit'
import {
  bottomSheetReducer,
  homeCattleListQueryReducer,
  homeFiltersReducer,
  snackbarReducer,
  uiReducer
} from '../slices'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    bottomSheet: bottomSheetReducer,
    homeFilters: homeFiltersReducer,
    homeCattleListQuery: homeCattleListQueryReducer,
    snackbar: snackbarReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>

export default store
