import Notification from "@/database/models/Notification";
import { createSlice, Dispatch } from "@reduxjs/toolkit";
import { endLoading, startLoading } from "./ui";
import { Database } from "@nozbe/watermelondb";
import { TableName } from "@/database/schema";
import database from "@/database";

interface NotificationState {
  selectedNotification: string | null;
  notifications: Notification[];
  notificationsCount: number;
}

const initialState: NotificationState = {
  selectedNotification: null,
  notifications: [],
  notificationsCount: 0,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setSelectedNotification(state, action) {
      state.selectedNotification = action.payload;
    },
    setNotificationsCount(state, action) {
      state.notificationsCount = action.payload;
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
      if (index !== -1) {
        state.notifications[index] = payload;
      }
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

      dispatch(setNotifications(results));

      const notificationsCount = await Notification.countNotifications(
        database
      );
      dispatch(setNotificationsCount(notificationsCount));

      dispatch(endLoading());
    } catch (err) {
      console.error("Error fetching notifications:", err);
      dispatch(endLoading());
    }
  };
};

export const addNewNotification = (database: Database, data: Notification) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoading());
    try {
      const results = await database.collections
        .get<Notification>(TableName.NOTIFICATIONS)
        .create((notification) => {
          notification.title = data.title;
          notification.description = data.description;
          notification.eventAt = data.eventAt;
          notification.iconName = data.iconName;
          notification.isMarkedAsRead = data.isMarkedAsRead;
        });

      dispatch(addNotification(results));
      const notificationsCount = await Notification.countNotifications(
        database
      );
      dispatch(setNotificationsCount(notificationsCount));

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
    const notificationsCount = await Notification.countNotifications(database);
    dispatch(setNotificationsCount(notificationsCount));
  };
};

export const markAsReadNoti = (notification: Notification) => {
  return async (dispatch: Dispatch) => {
    await notification.markAsRead();
    dispatch(replaceNotification(notification));
    const notificationsCount = await Notification.countNotifications(database);
    dispatch(setNotificationsCount(notificationsCount));
  };
};

export const {
  setSelectedNotification,
  setNotifications,
  setNotificationsCount,
  addNotification,
  replaceNotification,
  deleteNotificationFromList,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
