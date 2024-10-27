import MedicationForm from "@/components/cattle/MedicationForm";
import { useAppDispatch } from "@/hooks/useRedux";
import { AddCattleStackParams } from "@/navigation/stacks/AddCattleStack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";
import { Appbar, Button, IconButton } from "react-native-paper";

export default function Medication({ navigation }: NativeStackScreenProps<AddCattleStackParams, 'Medication'>) {
  const dispatch = useAppDispatch()

  const onSubmit = () => {
    // save the data
    navigation.goBack()
  }
  return (<>
    <Appbar.Header>
      <IconButton icon={'close'} onPress={navigation.goBack} />
      <Appbar.Content title='Ajustes de proporciones' />
      <Button onPress={onSubmit}>Guardar</Button>
    </Appbar.Header>
    <View>
      <MedicationForm />
    </View>
  </>)
}