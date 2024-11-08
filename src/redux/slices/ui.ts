import { CattleInfoParamsList } from "@/navigation/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  isLoading: boolean;
  msgError: string | null;
  screen: string | null;
}

const initialState: UIState = {
  isLoading: false,
  msgError: null,
  screen: null,
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
  }
});

export const { setError, startLoading, endLoading, setScreen } = uiSlice.actions;

export default uiSlice.reducer;
