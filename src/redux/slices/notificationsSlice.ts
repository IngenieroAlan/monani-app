import Notification from "@/database/models/Notification";
import { createSlice, Dispatch } from "@reduxjs/toolkit";
import { endLoading, startLoading } from "./ui";
import { Database } from "@nozbe/watermelondb";
import { TableName } from "@/database/schema";

interface NotificationState {
  selectedNotification: number | null;
  notifications: Notification[];
}

const initialState: NotificationState = {
  selectedNotification: null,
  notifications: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setSelectedNotification(state, action) {
      state.selectedNotification = action.payload;
    },
    setNotifications(state, action) {
      state.notifications = action.payload;
    },
    addNotification(state, { payload }) {
      state.notifications.push(payload);
    },
    replaceNotification(state, { payload }) {
      const index = state.notifications.findIndex(
        (notification) => notification.id === payload.id
      );
      state.notifications[index] = payload;
    },
    deleteNotification(state, { payload }) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== payload
      );
    },
  },
});

export const getNotifications = (database: Database) => {
    return async (dispatch: Dispatch) => {
      dispatch(startLoading());
      try {
        const results = await database.collections
          .get<Notification>(TableName.NOTIFICATIONS)
          .query()
          .fetch();
  
        /* const notifications = results.map(notification => ({
          id: notification.id,
          title: notification.title,
          description: notification.description,
          eventAt: notification.eventAt,
          isMarkedAsRead: notification.isMarkedAsRead,
          iconName: notification.iconName,
        })); */
  
        dispatch(setNotifications(results));
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        dispatch(endLoading());
      }
    };
  };
  
export const addNewNotification = (database: Database, data: Notification) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoading());
    try {
      const results = database.collections
        .get<Notification>(TableName.NOTIFICATIONS)
        .create((notification) => {
          notification = data;
        });
      dispatch(addNotification(results));
      dispatch(endLoading());
    } catch (err) {
      dispatch(endLoading());
      console.log(err);
    }
  };
};

export const deleteNotificationById = (database: Database, id: number) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoading());
    try {
      const result = database.collections
        .get<Notification>(TableName.NOTIFICATIONS)
        .find(id + "");
      (await result).destroyPermanently();
      dispatch(deleteNotification(result));
      dispatch(endLoading());
    } catch (err) {
      console.log(err);
      dispatch(endLoading());
    }
  };
};

export const {
  setSelectedNotification,
  setNotifications,
  addNotification,
  replaceNotification,
  deleteNotification,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
