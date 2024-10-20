import { CardFeedItem } from "@/components/cattle/CardFeedItem"
import { CattleContext } from "@/context/CattleContext"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useContext } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { Button, useTheme } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AddCattleStackParams } from "../../navigation/stacks/AddCattleStack"
import { DietFeed, Feed } from "@/interfaces/cattleInterfaces"

type Props = NativeStackScreenProps<AddCattleStackParams, 'FeedForm'>;
export const FeedForm = ({ navigation, route }: Props) => {
    const { cattle, dietFeeds } = useContext(CattleContext)
    const theme = useTheme()

    return (
        <SafeAreaProvider style={{ backgroundColor: theme.colors.surface }}>
            <ScrollView style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    {dietFeeds.map((dietFeed, index) => {
                        return (
                            <CardFeedItem
                                key={index}
                                dietFeed={dietFeed}
                                navigation={navigation}
                            />
                        )
                    })}
                </View>
            </ScrollView>
            <View style={styles.navigationButtons}>
                <Button
                    icon="arrow-left"
                    mode="elevated"
                    onPress={() => navigation.goBack()}
                >
                    Atras
                </Button>
                <Button
                    icon="arrow-right"
                    mode="elevated"
                    onPress={() => navigation.navigate('MedicationsForm')}
                >
                    Siguiente
                </Button>
            </View>
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
