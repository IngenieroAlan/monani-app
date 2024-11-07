import { createSlice, Dispatch } from "@reduxjs/toolkit";
import { endLoading, startLoading } from "./ui";
import { Database, Q } from "@nozbe/watermelondb";
import { TableName } from "@/database/schema";
import Cattle from "@/database/models/Cattle";

interface CattleState {
  selectedCattle: string | null;
  cattles: Cattle[];
  cattleInfo: Cattle | null;
}

const initialState: CattleState = {
  selectedCattle: null,
  cattles: [],
  cattleInfo: null,
};

const cattlesSlice = createSlice({
  name: "cattles",
  initialState,
  reducers: {
    setSelectedCattle(state, action) {
      state.selectedCattle = action.payload;
    },
    setCattles(state, action) {
      state.cattles = action.payload;
    },
    setCattleInfo(state, action) {
      state.cattleInfo = action.payload;
    },
    addCattle(state, { payload }) {
      state.cattles.push(payload);
    },
    replaceCattle(state, { payload }) {
      const index = state.cattles.findIndex(
        (cattle) => cattle.id === payload.id
      );
      if (index !== -1) {
        state.cattles[index] = payload;
      }
    },
    deleteCattleFromList(state, { payload }) {
      state.cattles = state.cattles.filter(
        (cattle) => cattle.id !== payload.id
      );
    },
  },
});

export const getCattles = (database: Database) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoading());
    try {
      const results = await database.collections
        .get<Cattle>(TableName.CATTLE)
        .query()
        .fetch();

      dispatch(setCattles(results));

      dispatch(endLoading());
    } catch (err) {
      console.error("Error fetching notifications:", err);
      dispatch(endLoading());
    }
  };
};

export const deleteCattle = (cattle: Cattle) => {
  return async (dispatch: Dispatch) => {
    await cattle.delete();
    dispatch(deleteCattleFromList(cattle));
  };
};

export const {
  setSelectedCattle,
  setCattles,
  setCattleInfo,
  addCattle,
  replaceCattle,
  deleteCattleFromList,
} = cattlesSlice.actions;

export default cattlesSlice.reducer;