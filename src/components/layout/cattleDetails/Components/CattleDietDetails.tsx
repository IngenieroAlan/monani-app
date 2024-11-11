import DietFeedItem from "@/components/DietFeedItem";
import Cattle from "@/database/models/Cattle";
import { TableName } from "@/database/schema";
import useDiet from "@/hooks/collections/useDiet";
import useDietFeeds from "@/hooks/collections/useDietFeeds";
import useFeeds from "@/hooks/collections/useFeeds";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setFeeds } from "@/redux/slices/feedsSlice";
import { RootState } from "@/redux/store/store";
import { cattleDetails } from "@/styles/main";
import { withObservables } from "@nozbe/watermelondb/react";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Divider, Icon, List, Text } from "react-native-paper";

const observeCattle = withObservables([TableName.CATTLE], ({ cattle }: { cattle: Cattle }) => ({
  cattle
}))

const ListEmptyComponent = () => {
  return (
    <View style={styles.emtpyListContainer}>
      <Icon
        size={56}
        source='cow-off'
      />
      <Text
        style={{ textAlign: 'center' }}
        variant='titleMedium'
      >
        No se han encontrado coincidencias.
      </Text>
    </View>
  )
}

export const CattleDietDetails = observeCattle(({ cattle }: { cattle: Cattle }) => {
  const { dietFeeds } = useDietFeeds(cattle)
  const { diet } = useDiet(cattle)
  const [index, setIndex] = useState(0);
  const navigation = useNavigation()
  const [totalAmount, setTotalAmount] = useState(0)
  const feeds = useAppSelector((state: RootState) => state.feeds.records)
  const { getFeeds } = useFeeds()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchFeeds = async () => {
      dispatch(setFeeds(await getFeeds()))
    }

    if (feeds.length === 0) fetchFeeds()
  }, [feeds])

  const findFeedName = useCallback((feedId: string) => feeds.find(feed => feed.id === feedId)?.name || '', [feeds])

  const onEdit = useCallback((dietFeedId: string) => {
    navigation.navigate('DietFeedRoute', { dietFeedId, modify: true });
  }, [])

  const onDelete = useCallback((dietFeedId: string) => {
    const dietFeed = dietFeeds.find(dietFeed => dietFeed.id === dietFeedId);
    const deleteDietFeed = async () => {
      dietFeed && await dietFeed.delete();
    }
    deleteDietFeed();
  }, [dietFeeds])

  useEffect(() => {
    setTotalAmount(dietFeeds.reduce((acc, dietFeed) => acc + parseFloat(dietFeed.feedAmount.toString()), 0))
  }, [dietFeeds, diet])

  return (
    <ScrollView style={[cattleDetails.container, cattleDetails.cardsContainer]}>
      {diet && diet.matterProportion !== 'Sin definir' && (<>
        <List.Subheader>{totalAmount}kg. en alimentos de {diet.matterAmount}kg. </List.Subheader>
        <View style={{ paddingStart: 16, paddingEnd: 24 }}><Divider /></View>
      </>)}

      <FlashList
        estimatedItemSize={88}
        data={dietFeeds}
        renderItem={({ item }) => (
          <DietFeedItem
            diet_feed={item}
            feedName={findFeedName(item.feed.id)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        keyExtractor={(item) => item.id}
        ListFooterComponent={() => <View style={{ height: 88 }} />}
        ListEmptyComponent={() => <ListEmptyComponent />}
        onEndReachedThreshold={2}
        onEndReached={() => setIndex(index + 1)}
      />
    </ScrollView>
  )
})

const styles = StyleSheet.create({
  emtpyListContainer: {
    height: '100%',
    marginVertical: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 16
  }
})