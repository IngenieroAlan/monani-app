import { AddCattleStackParams } from "@/navigation/stacks/AddCattleStack";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";

export default function ButtonFeedSettingsDialog() {
    // todo: Open dialog with feed settings from current cattle
    const navigation = useNavigation<NavigationProp<AddCattleStackParams>>();

    const handleOpenDialog = () => {
        // todo: save feedSettings to db of current cow or save state with cattleReducer depending on the context

        navigation.navigate('FeedSettingsDialog')
    }
    return (
        <TouchableOpacity activeOpacity={0.8}>
            <IconButton
                icon="cog"
                size={24}
                onPress={handleOpenDialog}
            />
        </TouchableOpacity>
    )
}