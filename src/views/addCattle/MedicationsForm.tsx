import { RootStackParams } from "@/navigation/Navigator"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { ScrollView, StyleSheet, View } from "react-native"
import { Button } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AddCattleStackParams } from "../../navigation/stacks/AddCattleStack"

type StackParams = AddCattleStackParams & RootStackParams;
type Props = NativeStackScreenProps<StackParams, 'MedicationsForm'>;
export const MedicationsForm = ({ navigation, route }: Props) => {

    // TODO: Fetch medications from db

    const handleSave = () => {
        // TODO: Save cattle to db

        navigation.navigate('HomeView');
    }

    return (
        <SafeAreaProvider>
            <ScrollView style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                </View>
                <View style={styles.navigationButtons}>
                    <Button
                        icon="arrow-left"
                        mode="elevated"
                        onPress={() => navigation.goBack()}
                    >
                        Atras
                    </Button>
                    <Button
                        icon="content-save-outline"
                        mode="elevated"
                        onPress={handleSave}
                    >
                        Guardar
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        gap: 10,
    },
    navigationButtons: {
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'flex-end',
        gap: 10,
        padding: 16
    }
});
