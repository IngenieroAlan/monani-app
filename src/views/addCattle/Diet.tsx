import DietFeedsItem from "@/components/DietFeedItem"
import useFeeds from "@/hooks/collections/useFeeds"
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux"
import { AddCattleStackParamsList, BottomTabsParamList } from "@/navigation/types"
import { reset } from "@/redux/slices/addCattleSlice"
import { setFeeds } from "@/redux/slices/feedsSlice"
import { RootState } from "@/redux/store/store"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useCallback, useEffect, useState } from "react"
import { FlatList, StyleSheet, View } from "react-native"
import { Appbar, Button, List, useTheme } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"

export type AddDietNavigationProps = NativeStackScreenProps<AddCattleStackParamsList & BottomTabsParamList, 'Diet'>;

export const Diet = ({ navigation }: AddDietNavigationProps) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { dietFeeds, diet } = useAppSelector((state: RootState) => state.addCattle)
  const [isValid, setIsValid] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    if (diet.matterProportion === undefined || diet.waterAmount === undefined || dietFeeds.length === 0) {
      setIsValid(false)
      console.log('1');

      return
    }
    if (dietFeeds.length > 0 && diet.matterProportion === 'Sin definir') {
      console.log('2');

      setIsValid(true)
      return
    }
    if (dietFeeds.length > 0) {
      console.log(totalAmount === diet.matterAmount);

      setIsValid(totalAmount === diet.matterAmount)
    }
  }, [dietFeeds, diet, totalAmount])

  useEffect(() => {
    setTotalAmount(dietFeeds.reduce((acc, dietFeed) => acc + parseFloat(dietFeed.feedAmount.toString()), 0))
  }, [dietFeeds, diet])

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
      <List.Subheader>{totalAmount}kg. en alimentos de {diet.matterAmount}kg. </List.Subheader>
      <FlatList
        data={dietFeeds}
        renderItem={({ item }) => (
          <DietFeedsItem
            props={{ feedAmount: item.feedAmount, feedProportion: item.feedProportion, id: item.dietFeedId, percentage: item.percentage }}
            feedName={item.feed.name}
            screenContext={'AddCattle'}
          />
        )}
        keyExtractor={(item) => item.dietFeedId}
        ListFooterComponent={() => <View style={{ height: 88 }} />}
      />
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
          disabled={!isValid}
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
