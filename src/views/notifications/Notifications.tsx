import React, { useEffect } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import mainStyles from '../../styles/main';
import { useForm } from '@/hooks/useForm';
import { CustomTextInput } from '@/components/CustomTextInput';
import { NotificationsList } from '@/components/NotificationsList';
import { Notification } from '@/interfaces/notificationsInterfaces';

const initialForm = {
  name: "",
};

const formHelpers = {
  name: "El campo del nombre es requerido",
};

const notificationsData: Notification[] = [{
  id: 1,
  eventAt: new Date,
  title: "Dia de parto",
  description: "La vaca con no. 6603 tiene un parto programado para hoy.",
  iconName: "baby-bottle-outline",
  isMarkedAsRead: false
}]


export const NotificationsView = () => {
  const { name, onChange, onResetForm } = useForm(initialForm);
  const formValidations = {
    name: () => { if (name.trim() === "") return false; return true; }, // falso = error & true = valido
  }

  return (
    <SafeAreaView style={mainStyles.container}>
      <View style={mainStyles.container}>
        <Text>Ejemplo de uso</Text>
        <CustomTextInput label="Nombre" field="name" formValue={name} helperText={formHelpers.name} validation={formValidations.name} onChange={onChange} more={{ autoCapitalize: "none" }} />
        <Button
          onPress={onResetForm}
        >Reset</Button>
        <NotificationsList day='Hoy' dayNotifications={notificationsData} />
      </View>
    </SafeAreaView>
  );
};
