import Notification from "@/database/models/Notification";
import { createSlice, Dispatch } from "@reduxjs/toolkit";
import { endLoading, startLoading } from "./ui";
import { Database, Q } from "@nozbe/watermelondb";
import { TableName } from "@/database/schema";
import database from "@/database";

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
    deleteNotificationFromList(state, { payload }) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== payload.id
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
      setTimeout(() => {}, 2000);
      dispatch(endLoading());
    } catch (err) {
      console.error("Error fetching notifications:", err);
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

export const deleteNotification = (
  database: Database,
  notification: Notification
) => {
  return async (dispatch: Dispatch) => {
    await notification.deleteNoti();
    dispatch(deleteNotificationFromList(notification));
  };
};
export const markAsReadNoti = (notification: Notification) => {
  return async (dispatch: Dispatch) => {
    notification.markAsRead();
    replaceNotification(notification);
  };
};

export const {
  setSelectedNotification,
  setNotifications,
  addNotification,
  replaceNotification,
  deleteNotificationFromList,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
