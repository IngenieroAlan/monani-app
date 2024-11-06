import { useAppDispatch } from '@/hooks/useRedux'
import { DietFeedItem } from '@/interfaces/cattleInterfaces'
import { deleteDietFeed } from '@/redux/slices/addCattleSlice'
import { AddDietNavigationProps } from '@/views/addCattle/Diet'
import { memo, useState } from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Icon, IconButton, List, Menu, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type navigationProps = AddDietNavigationProps['navigation']// |  DietNavigationProps['navigation']

const ListItemMenu = (
  { dietFeedId, navigation }: { dietFeedId: string, navigation: navigationProps }
) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const insets = useSafeAreaInsets()
  const [menuVisible, setMenuVisible] = useState(false)

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
          navigation.navigate('DietFeed', {
            medicationScheduleId: dietFeedId,
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

const ListItem = (
  { dietFeed, navigation }: { dietFeed: DietFeedItem, navigation: navigationProps }
) => {
  return (
    <List.Item
      style={{ paddingVertical: 2, paddingRight: 8 }}
      title={dietFeed.FeedName}
      description={dietFeed.feedProportion === 'Por porcentaje' ? `${dietFeed.percentage}%` : `${dietFeed.feedAmount} kg`}
      right={() => (
        <ListItemMenu
          dietFeedId={dietFeed.dietFeedId}
          navigation={navigation}
        />
      )}
    />
  )
}

const DietFeedsList = (
  { dietFeeds, navigation }: { dietFeeds: DietFeedItem[], navigation: navigationProps }
) => {

  return (
    <FlatList
      data={dietFeeds}
      renderItem={({ item }) => (
        <ListItem
          dietFeed={item}
          navigation={navigation}
        />
      )}
      keyExtractor={(item) => item.dietFeedId}
      ListFooterComponent={() => <View style={{ height: 88 }} />}
    />
  )
}

export default memo(DietFeedsList)
