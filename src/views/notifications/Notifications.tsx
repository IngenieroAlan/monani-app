import React, { useEffect, useReducer, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
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


const notificationsData: Notification[] = [
  {
    id: 1,
    eventAt: new Date('2024-10-15T10:30:00'),
    title: "Dia de parto",
    description: "La vaca con no. 6603 tiene un parto programado para hoy.",
    iconName: "baby-bottle-outline",
    isMarkedAsRead: false
  },
  {
    id: 2,
    eventAt: new Date('2024-10-14T08:00:00'),
    title: "Vacunación",
    description: "La vaca con no. 5502 tiene vacunación hoy.",
    iconName: "pill",
    isMarkedAsRead: true
  },
  {
    id: 3,
    eventAt: new Date('2024-10-16T15:00:00'),
    title: "Revisión",
    description: "Revisión programada para la vaca con no. 4401.",
    iconName: "clipboard-pulse-outline",
    isMarkedAsRead: false
  }
];
const formHelpers = {
  name: "El campo del nombre es requerido",
};

export const NotificationsView = () => {
  const theme = useTheme();
  const database = useDatabase();
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector((state: RootState) => state.notifications);
  const { isLoading } = useAppSelector((state: RootState) => state.ui);

  useEffect(() => {
    dispatch(startLoading());
  }, [dispatch])


  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: ""
    }
  });
  const generateDates = () => {
    notificationsData.sort((a, b) => b.eventAt.getTime() - a.eventAt.getTime());
    notificationsData.forEach((noti) => {
      console.log(
        formatDistance(new Date(noti.eventAt), new Date(), { addSuffix: true, locale: es }));
    })
  }
  const onSubmit = (data: any) => console.log(data);
  useEffect(() => {
    generateDates();
  }, [generateDates])

  useEffect(() => {
    dispatch(getNotifications(database));
  }, [dispatch])



  return (
    <SafeAreaView style={mainStyles.container}>
      <View style={mainStyles.container}>
        <Text>Ejemplo de uso</Text>
        <CustomTextInput
          name='name'
          label="Nombre"
          helperText={formHelpers.name}
          control={control}
          errors={errors.name}
          more={{ autoCapitalize: "none" }} />
        <Button onPress={handleSubmit(onSubmit)} >Submit</Button>
        {/*
          Fix notification design
          show notifications by day
        */}
        {
          isLoading ? <Text variant='bodySmall'>Aquí va un skeleton</Text> : <NotificationsList day='Hoy' dayNotifications={notifications} />
        }


      </View>
    </SafeAreaView>
  );
};
