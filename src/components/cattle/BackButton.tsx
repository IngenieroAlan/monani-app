import { RootStackParams } from "@/navigation/Navigator";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";

export default function BackButton() {
    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const goHome = () => {
        // todo: clear data with cattleReducer
        navigation.navigate('HomeView');
    }
    return (
        <IconButton
            icon="arrow-left"
            size={24}
            onPress={goHome}
        />
    );
}