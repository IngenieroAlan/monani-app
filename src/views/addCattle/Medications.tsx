import { useAppDispatch } from "@/hooks/useRedux"
import { RootStackParams } from "@/navigation/Navigator"
import { reset } from "@/redux/slices/addCattleSlice"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { ScrollView, StyleSheet, View } from "react-native"
import { Appbar, Button } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AddCattleStackParams } from "../../navigation/stacks/AddCattleStack"

type Props = NativeStackScreenProps<AddCattleStackParams & RootStackParams, 'Medications'>;
export const Medications = ({ navigation }: Props) => {
    const dispatch = useAppDispatch()

    // TODO: Fetch medications from db

    const goBack = () => {
        dispatch(reset())
        navigation.navigate('HomeView')
    }

    const handleSave = () => {
        // TODO: Save cattle to db

        navigation.navigate('HomeView');
    }

    return (<>
        <Appbar.Header>
            <Appbar.BackAction onPress={goBack} />
            <Appbar.Content title='Medicación' />
            <Appbar.Action icon="plus" onPress={() => navigation.navigate('Medication')} />
        </Appbar.Header>
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
    </>
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
