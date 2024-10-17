import { TouchableOpacity, View } from "react-native";
import { Icon, IconButton } from "react-native-paper";


export default function ButtonFeedSettingsDialog() {
    // todo: Open dialog with feed settings from current cattle
    return (
        <TouchableOpacity activeOpacity={0.8}>
            <IconButton
                icon="cog"
                size={24}
                onPress={() => console.log('Pressed')}
            />
        </TouchableOpacity>
    );
}