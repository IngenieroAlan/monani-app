import { AddCattleStackParams } from "@/navigation/stacks/AddCattleStack";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";

export default function ButtonSaveSettings() {
    const navigation = useNavigation<NavigationProp<AddCattleStackParams>>();

    const handleSave = () => {
        // todo: save settings to db of current cow or save state with cattleReducer depending on the context

        navigation.navigate('FeedForm')
    }
    return (
        <Button onPress={handleSave} style={{ marginRight: 16 }}>Guardar</Button>
    )
}