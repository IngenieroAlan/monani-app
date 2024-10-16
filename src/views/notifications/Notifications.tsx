import React, { useEffect } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import mainStyles from '../../styles/main';
import { useForm } from '@/hooks/useForm';
import { CustomTextInput } from '@/components/CustomTextInput';

const initialForm = {
  name: "",
};

const formHelpers = {
  name: "El campo del nombre es requerido",
};


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
      </View>
    </SafeAreaView>
  );
};
