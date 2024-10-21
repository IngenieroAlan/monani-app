import { CardFeedItem } from "@/components/cattle/CardFeedItem"
import { CattleContext } from "@/context/CattleContext"
import Feed from "@/database/models/Feed"
import { TableName } from "@/database/schema"
import { Q } from "@nozbe/watermelondb"
import { useDatabase } from "@nozbe/watermelondb/react"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useContext, useEffect, useState } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { Appbar, Button, useTheme } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AddCattleStackParams } from "../../navigation/stacks/AddCattleStack"
import DietFeedsList from "@/components/cattle/DietFeedsList"
import { RootStackParams } from "@/navigation/Navigator"

type Props = NativeStackScreenProps<AddCattleStackParams & RootStackParams, 'Diet'>;
export const Diet = ({ navigation, route }: Props) => {
    const { cattle, dietFeeds } = useContext(CattleContext)
    const theme = useTheme()
    const database = useDatabase()
    const [feeds, setFeeds] = useState<Feed[]>([])

    useEffect(() => {
        const fetchFeeds = async () => {
            setFeeds(
                await database.collections.get<Feed>(TableName.FEEDS).query(
                    Q.sortBy('name', Q.asc),
                ).fetch()
            )
        }

        fetchFeeds()
    }, [])

    return (<>
        <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.navigate('HomeView')} />
            <Appbar.Content title='Dieta' />
            <Appbar.Action icon="plus" onPress={() => navigation.navigate('DietFeedForm')} />
            <Appbar.Action icon="cog" onPress={() => navigation.navigate('DietSettings')} />
        </Appbar.Header>
        <SafeAreaProvider style={{ backgroundColor: theme.colors.surface }}>
            <DietFeedsList feeds={feeds} />
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
                    onPress={() => navigation.navigate('Medications')}
                >
                    Siguiente
                </Button>
            </View>
        </SafeAreaProvider>
    </>)
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
