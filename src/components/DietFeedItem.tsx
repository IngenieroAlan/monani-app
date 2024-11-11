import DietFeed, { FeedProportion } from '@/database/models/DietFeed'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { ACDietFeed, ACDietFeedItem } from '@/interfaces/cattleInterfaces'
import { AddCattleStackParamsList, RootStackParamList } from '@/navigation/types'
import { deleteDietFeed } from '@/redux/slices/addCattleSlice'
import { AddDietNavigationProps } from '@/views/addCattle/Diet'
import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { memo, useCallback, useState } from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Icon, IconButton, List, Menu, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type DietFeedItem = {
  dietFeedId: string;
  dietId: string;
  feedId: string;
  feedAmount: number;
  percentage?: number;
  feedProportion: FeedProportion;
}
type ScreenContext = 'AddCattle' | 'CattleDetails'

// type navigationProps = NativeStackScreenProps<AddCattleStackParamsList & RootStackParamList, 'Diet'>
type ScreenProps = NativeStackScreenProps<RootStackParamList & AddCattleStackParamsList>['navigation']

const ListItemMenu = (
  { dietFeedId, screenContext }: { dietFeedId: string, screenContext: ScreenContext }
) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const insets = useSafeAreaInsets()
  const [menuVisible, setMenuVisible] = useState(false)
  const navigation = useNavigation<ScreenProps>()

  return (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchorPosition='bottom'
      statusBarHeight={insets.top}
      anchor={
        <IconButton
          icon='dots-vertical'
          onPress={() => setMenuVisible(true)}
        />
      }
    >
      <Menu.Item
        title='Editar'
        leadingIcon='pencil-outline'
        onPress={() => {
          setMenuVisible(false);
          if (screenContext === 'AddCattle')
            navigation.navigate('DietFeed', {
              dietFeedId: dietFeedId,
              modify: true
            });
          else if (screenContext === 'CattleDetails')
            navigation.navigate('DietFeed', {
              dietFeedId: dietFeedId,
              modify: true
            });
        }}
      />
      <Menu.Item
        theme={{ colors: { onSurface: theme.colors.onSurface } }}
        title='Eliminar'
        leadingIcon='minus'
        onPress={() => {
          setMenuVisible(false);
          dispatch(deleteDietFeed({ dietFeedId }))
        }}
      />
    </Menu>
  )
}

type DietFeedProps = {
  props: {
    id: string;
    feedAmount: number;
    percentage?: number;
    feedProportion: FeedProportion;
  },
  feedName: string,
  screenContext: ScreenContext
}

const DietFeedItem = (
  { props: props, screenContext, feedName }: DietFeedProps) => {
  return (
    <List.Item
      style={{ paddingVertical: 2, paddingRight: 8 }}
      title={feedName}
      description={props.feedProportion === 'Por porcentaje' ? `${props.percentage}%` : `${props.feedAmount} kg`}
      right={() => (
        <ListItemMenu
          dietFeedId={props.id}
          screenContext={screenContext}
        />
      )}
    />
  )
}

// const DietFeedsList = (
//   { dietFeeds, navigation }: { dietFeeds: DietFeed[], navigation: navigationProps }
// ) => {
//   const feeds = useAppSelector(state => state.feeds.records)
//   const findFeedName = useCallback((feedId: string) => feeds.find(feed => feed.id === feedId)?.name || '', [feeds])
//   return (
//     <FlatList
//       data={dietFeeds}
//       renderItem={({ item }) => (
//         <ListItem
//           dietFeed={item}
//           feedName={findFeedName(item.feed.id)}
//           navigation={navigation}
//         />
//       )}
//       keyExtractor={(item) => item.dietFeedId}
//       ListFooterComponent={() => <View style={{ height: 88 }} />}
//     />
//   )
// }

export default memo(DietFeedItem)
