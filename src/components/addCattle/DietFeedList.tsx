import { FeedProportion } from '@/database/models/DietFeed'
import { useAppDispatch } from '@/hooks/useRedux'
import { ACDietFeed } from '@/interfaces/cattleInterfaces'
import { AddCattleStackParamsList, BottomTabsParamList } from '@/navigation/types'
import { deleteDietFeed } from '@/redux/slices/addCattleSlice'
import { show } from '@/redux/slices/uiVisibilitySlice'
import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { memo, useState } from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { IconButton, List, Menu, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type DietFeedItem = {
  dietFeedId: string;
  dietId: string;
  feedId: string;
  feedAmount: number;
  percentage?: number;
  feedProportion: FeedProportion;
}

type ScreenProps = NativeStackScreenProps<AddCattleStackParamsList & BottomTabsParamList>['navigation']


const ListItemMenu = (
  { dietFeedId }: { dietFeedId: string }
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
          navigation.navigate('DietFeed', { dietFeedId, modify: true })
          setMenuVisible(false);
        }}
      />
      <Menu.Item
        theme={{ colors: { onSurface: theme.colors.onSurface } }}
        title='Eliminar'
        leadingIcon='minus'
        onPress={() => {
          dispatch(deleteDietFeed({ dietFeedId }))
          // dispatch(show(DietSnackbarId.REMOVED_DIETFEED))
          setMenuVisible(false);
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
}

const DietFeedItem = memo(({ props, feedName }: DietFeedProps) => {
  return (
    <List.Item
      style={{ paddingVertical: 2, paddingRight: 8 }}
      title={feedName}
      description={props.feedProportion === 'Por porcentaje' ? `${props.percentage}%` : `${props.feedAmount} kg`}
      right={() => (
        <ListItemMenu dietFeedId={props.id} />
      )}
    />
  )
})

const DietFeedList = ({ dietFeeds }: { dietFeeds: ACDietFeed[] }) => {
  return (
    <FlatList
      data={dietFeeds}
      renderItem={({ item }) => (
        <DietFeedItem
          props={{ feedAmount: item.feedAmount, feedProportion: item.feedProportion, id: item.dietFeedId, percentage: item.percentage }}
          feedName={item.feed.name}
        />
      )}
      keyExtractor={(item) => item.dietFeedId}
      ListFooterComponent={() => <View style={{ height: 88 }} />}
    />
  )
}

export default DietFeedList
