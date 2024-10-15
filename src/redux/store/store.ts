import { configureStore } from '@reduxjs/toolkit'
import { bottomSheetReducer, homeCattleListQueryReducer, homeStatusFilterReducer, uiReducer } from '../slices'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    bottomSheet: bottomSheetReducer,
    homeStatusFilter: homeStatusFilterReducer,
    homeCattleListQuery: homeCattleListQueryReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>

export default store
