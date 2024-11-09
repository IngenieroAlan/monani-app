import { CattleInfoParamsList } from "@/navigation/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  isLoading: boolean;
  msgError: string | null;
  screen: string | null;
  showBottomStack: boolean;
}

const initialState: UIState = {
  isLoading: false,
  msgError: null,
  screen: null,
  showBottomStack:true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    endLoading(state) {
      state.isLoading = false;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.msgError = action.payload;
    },
    setScreen(state, action: PayloadAction<string | null>) {
      state.screen = action.payload;
    },
    setShowBottomStack(state, action:PayloadAction<boolean>){
      state.showBottomStack = action.payload;
    }
  }
});

export const { setError, startLoading, endLoading, setScreen, setShowBottomStack } = uiSlice.actions;

export default uiSlice.reducer;
