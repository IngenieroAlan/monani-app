import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { ScrollView, StyleSheet, View } from "react-native"
import { Button } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AddCattleStackParams } from "../../navigation/stacks/AddCattleStack"
import { colors } from "../../utils/colors"

type Props = NativeStackScreenProps<AddCattleStackParams, 'FeedForm'>;
export const FeedForm = ({ navigation, route }: Props) => {
    const { cattle, genealogy, inQuarantine } = route.params
    return (
        <SafeAreaProvider>
            <ScrollView style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                </View>
                <View style={styles.navigationButtons}>
                    <Button
                        icon="arrow-left"
                        mode="contained-tonal"
                        onPress={() => navigation.navigate('CattleForm', {
                            cattle: cattle,
                            genealogy: genealogy,
                            inQuarantine: inQuarantine
                        })}
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
