import { CardFeedItem } from "@/components/cattle/CardFeedItem"
import { CattleContext } from "@/context/CattleContext"
import Feed from "@/database/models/Feed"
import { TableName } from "@/database/schema"
import { Q } from "@nozbe/watermelondb"
import { useDatabase } from "@nozbe/watermelondb/react"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useContext, useEffect, useRef, useState } from "react"
import { FlatList, ScrollView, StyleSheet, View } from "react-native"
import { Appbar, Button, useTheme } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AddCattleStackParams } from "../../navigation/stacks/AddCattleStack"
import DietFeedsList from "@/components/cattle/DietFeedsList"
import { RootStackParams } from "@/navigation/Navigator"
import useFeeds from "@/hooks/collections/useFeeds"
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux"
import { RootState } from "@/redux/store/store"
import { setFeeds } from "@/redux/slices/feedsSlice"
import { DietFeedItem } from "@/interfaces/cattleInterfaces"

type Props = NativeStackScreenProps<AddCattleStackParams & RootStackParams, 'Diet'>;
export const Diet = ({ navigation, route }: Props) => {
    const { cattle, dietFeeds } = useContext(CattleContext)
    const theme = useTheme()
    const feeds = useAppSelector((state: RootState) => state.feeds.records)
    const { getFeeds } = useFeeds()
    const dispatch = useAppDispatch()
    const [currentDietFeeds, setCurrentDietFeeds] = useState<DietFeedItem[]>([])

    useEffect(() => {
        const fetchFeeds = async () => {
            dispatch(setFeeds(await getFeeds()))
        }

        if (feeds.length === 0) fetchFeeds()
    }, [feeds])

    useEffect(() => {
        setCurrentDietFeeds(dietFeeds.map(dietFeed => {
            const feed = feeds.find(feed => feed.id === dietFeed.feedId)
            return {
                ...dietFeed,
                dietFeedId: dietFeed.dietFeedId,
                dietId: dietFeed.dietId,
                feedId: dietFeed.feedId,
                name: feed?.name || '',
                feedAmount: dietFeed.feedAmount,
                feedProportion: dietFeed.feedProportion,
                percentage: dietFeed.percentage,
            }
        })
        )
    }, [dietFeeds])


    return (<>
        <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.navigate('HomeView')} />
            <Appbar.Content title='Dieta' />
            <Appbar.Action icon="plus" onPress={() => navigation.navigate('DietFeedForm')} />
            <Appbar.Action icon="cog" onPress={() => navigation.navigate('DietSettings')} />
        </Appbar.Header>
        <SafeAreaProvider style={{ backgroundColor: theme.colors.surface }}>
            <DietFeedsList dietFeeds={currentDietFeeds} />
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
