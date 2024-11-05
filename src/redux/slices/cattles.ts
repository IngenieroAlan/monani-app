import { createSlice, Dispatch } from "@reduxjs/toolkit";
import { endLoading, startLoading } from "./ui";
import { Database, Q } from "@nozbe/watermelondb";
import { TableName } from "@/database/schema";
import Cattle from "@/database/models/Cattle";

interface CattleState {
  selectedCattle: string | null;
  cattles: Cattle[];
}

const initialState: CattleState = {
  selectedCattle: null,
  cattles: [],
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

export const getCattlesById = (database: Database, cattleId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoading());
    try {
      const results = await database.collections
        .get<Cattle>(TableName.CATTLE)
        .query(Q.where("id", cattleId))
        .fetch();

      if (results.length > 0) {
        dispatch(setCattles(results));
      } else {
        console.warn(`Cattle with ID ${cattleId} not found.`);
      }

      dispatch(endLoading());
    } catch (err) {
      console.error("Error fetching cattle by ID:", err);
      dispatch(endLoading());
    }
  };
};

/* export const addNewCattle = (database: Database, data: Cattle) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoading());
    try {
      const results = await database.collections
        .get<Cattle>(TableName.CATTLE)
        .create((cattle) => {
          cattle = data;
        });

      dispatch(addCattle(results));
      dispatch(endLoading());
    } catch (err) {
      dispatch(endLoading());
      console.log(err);
    }
  };
}; */

export const deleteCattle = (cattle: Cattle) => {
  return async (dispatch: Dispatch) => {
    await cattle.delete();
    dispatch(deleteCattleFromList(cattle));
  };
};

export const {
  setSelectedCattle,
  setCattles,
  addCattle,
  replaceCattle,
  deleteCattleFromList,
} = cattlesSlice.actions;

export default cattlesSlice.reducer;
