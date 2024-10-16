import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { ScrollView, StyleSheet, View } from "react-native"
import { Button } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"
import Feed from "../../database/models/Feed"
import { AddCattleStackParams } from "../../navigation/stacks/AddCattleStack"
import { useContext } from "react"
import { CattleContext } from "@/context/CattleContext"

type Props = NativeStackScreenProps<AddCattleStackParams, 'FeedForm'>;
export const FeedForm = ({ navigation, route }: Props) => {
    const { cattle, genealogy } = useContext(CattleContext)

    // TODO: Fetch feeds from db
    const feeds: Partial<Feed>[] = [
        { id: '1', name: 'Alfalfa', feedType: 'Alimento' },
        { id: '2', name: 'Concentrado', feedType: 'Concentrado de engorda' },
        { id: '3', name: 'Concentrado lechero', feedType: 'Concentrado lechero' },
    ]


    return (
        <SafeAreaProvider>
            <ScrollView style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                </View>
                <View style={styles.navigationButtons}>
                    <Button
                        icon="arrow-left"
                        mode="contained-tonal"
                        onPress={() => navigation.navigate('CattleForm')}
                    >
                        Atras
                    </Button>
                    <Button
                        icon="arrow-right"
                        mode="contained-tonal"
                        onPress={() => null}
                    >
                        Siguiente
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
