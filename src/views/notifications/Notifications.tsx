import React, { useEffect, useMemo } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import mainStyles from '../../styles/main';
import { NotificationsList } from '@/components/NotificationsList';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { useDatabase } from '@nozbe/watermelondb/react';
import { getNotifications } from '@/redux/slices/notificationsSlice';
import { RootState } from '@/redux/store/store';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { colors } from '@/utils/colors';
import Notification from '@/database/models/Notification';

export const NotificationsView = () => {
  const theme = useTheme();
  const database = useDatabase();
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector((state: RootState) => state.notifications);
  const { isLoading } = useAppSelector((state: RootState) => state.ui);

  const formatNotificationDate = (timestamp: Date) => {
    const today = new Date();
    const notificationDate = new Date(timestamp);

    const isToday = notificationDate.toDateString() === today.toDateString();
    const isYesterday = notificationDate.toDateString() === new Date(today.setDate(today.getDate() - 1)).toDateString();

    if (isToday) {
      return "Hoy";
    } else if (isYesterday) {
      return "Ayer";
    } else {
      return format(notificationDate, "d 'de' MMMM 'de' yyyy", { locale: es });
    }
  };

  const groupNotificationsByDay = (notifications: Notification[]): Record<string, Notification[]> => {
    return notifications.reduce((acc: Record<string, Notification[]>, notification) => {
      const dateKey: string = formatNotificationDate(notification.eventAt);

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      acc[dateKey].push(notification);
      return acc;
    }, {});
  };

  const groupedNotifications = useMemo(() => {
    return groupNotificationsByDay(notifications);
  }, [notifications]);

  useEffect(() => {
    dispatch(getNotifications(database));
  }, [dispatch, database]);

  return (
    <SafeAreaView style={mainStyles.container}>
      <ScrollView style={mainStyles.container}>
        {isLoading ? (
          <ActivityIndicator color={colors.notification.default} animating={isLoading} />
        ) : (
          Object.keys(groupedNotifications).map((day) => (
            <NotificationsList day={day} key={day} dayNotifications={groupedNotifications[day]} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};