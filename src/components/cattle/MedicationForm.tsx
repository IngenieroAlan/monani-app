import { AddCattleStackParams } from "@/navigation/stacks/AddCattleStack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";
import { Appbar, Button, IconButton, Text } from "react-native-paper";

export default function MedicationForm({ navigation }: NativeStackScreenProps<AddCattleStackParams, 'MedicationsForm'>) {
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
            <Text>MedicationForm</Text>
        </View>
    </>)
}