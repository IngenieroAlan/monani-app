import DietFeedsList from "@/components/addCattle/DietFeedsList"
import useFeeds from "@/hooks/collections/useFeeds"
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux"
import { DietFeedItem } from "@/interfaces/cattleInterfaces"
import { AddCattleStackParamsList, BottomTabsParamList } from "@/navigation/types"
import { reset } from "@/redux/slices/addCattleSlice"
import { setFeeds } from "@/redux/slices/feedsSlice"
import { RootState } from "@/redux/store/store"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Appbar, Button, useTheme } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"

export type AddDietNavigationProps = NativeStackScreenProps<AddCattleStackParamsList & BottomTabsParamList, 'Diet'>;
export const Diet = ({ navigation }: AddDietNavigationProps) => {
    const theme = useTheme()
    const feeds = useAppSelector((state: RootState) => state.feeds.records)
    const { getFeeds } = useFeeds()
    const dispatch = useAppDispatch()
    const { dietFeeds } = useAppSelector((state: RootState) => state.addCattle)
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
                FeedName: feed?.name || '',
                feedAmount: dietFeed.feedAmount,
                feedProportion: dietFeed.feedProportion,
                percentage: dietFeed.percentage,
            }
        })
        )
    }, [dietFeeds])

    const goBack = () => {
        dispatch(reset())
        navigation.navigate('Ganado')
    }

    return (<>
        <Appbar.Header>
            <Appbar.BackAction onPress={goBack} />
            <Appbar.Content title='Dieta' />
            <Appbar.Action icon="plus" onPress={() => navigation.navigate('DietFeed')} />
            <Appbar.Action icon="cog" onPress={() => navigation.navigate('DietSettings')} />
        </Appbar.Header>
        <SafeAreaProvider style={{ backgroundColor: theme.colors.surface }}>
            <DietFeedsList dietFeeds={currentDietFeeds} navigation={navigation} />
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
