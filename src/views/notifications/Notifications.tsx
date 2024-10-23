import React, { useEffect, useReducer, useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';
import mainStyles from '../../styles/main';
import { CustomTextInput } from '@/components/CustomTextInput';
import { NotificationsList } from '@/components/NotificationsList';
import { Notification } from '@/interfaces/notificationsInterfaces';
import { es } from 'date-fns/locale'
import { formatDistance, subDays } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useDatabase } from '@nozbe/watermelondb/react';
import { endLoading, startLoading } from '@/redux/slices/ui';
import { getNotifications } from '@/redux/slices/notificationsSlice';
import { RootState } from '@/redux/store/store';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { colors } from '@/utils/colors';


const formHelpers = {
  name: "El campo del nombre es requerido",
};

export const NotificationsView = () => {
  const theme = useTheme();
  const database = useDatabase();
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector((state: RootState) => state.notifications);
  const { isLoading } = useAppSelector((state: RootState) => state.ui);


  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: ""
    }
  });
  const generateDates = () => {
    //notifications.sort((a, b) => b.eventAt.getTime() - a.eventAt.getTime());
    /* notificationsData.forEach((noti) => {
      //  console.log(
      //  formatDistance(new Date(noti.eventAt), new Date(), { addSuffix: true, locale: es })); 
    }) */
  }
  useEffect(() => {
    generateDates();
  }, [generateDates])

  useEffect(() => {
    dispatch(getNotifications(database));
  }, [dispatch])



  return (
    <SafeAreaView style={mainStyles.container}>
      <ScrollView style={mainStyles.container}>
        {
          isLoading ? <ActivityIndicator color={colors.notification.default} animating={isLoading}/> : <NotificationsList day='Hoy' dayNotifications={notifications} />
        }
      </ScrollView>
    </SafeAreaView>
  );
};
