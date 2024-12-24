import Cattle from '@/database/models/Cattle'
import SentNotification from '@/database/models/SentNotification'
import { TableName } from '@/database/schema'
import { useAppDispatch } from '@/hooks/useRedux'
import { setCattleInfo } from '@/redux/slices/cattles'
import useAppTheme from '@/theme'
import notifee from '@notifee/react-native'
import { useDatabase, withObservables } from '@nozbe/watermelondb/react'
import { useNavigation } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import { IconButton, List, Menu } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import NotificationDescription from './NotificationDescription'
import { NotificationIcon, NotificationTitle } from './types'

const MENU_OFFSET = 4

const ItemMenu = ({ notification }: { notification: SentNotification }) => {
  const [visible, setVisible] = useState(false)
  const insets = useSafeAreaInsets()

  const onMarkAsRead = useCallback(async () => {
    await notification.markAsRead()
    await notifee.cancelDisplayedNotification(notification.notifeeId)

    setVisible(false)
  }, [notification])

  const onDelete = useCallback(async () => {
    await notification.deleteNoti()
    await notifee.cancelDisplayedNotification(notification.notifeeId)

    setVisible(false)
  }, [notification])

  return (
    <Menu
      visible={visible}
      anchorPosition='bottom'
      onDismiss={() => setVisible(false)}
      statusBarHeight={insets.top - MENU_OFFSET}
      anchor={
        <IconButton
          icon='dots-vertical'
          size={24}
          onPress={() => setVisible(true)}
        />
      }
    >
      <Menu.Item
        title='Marcar como leído'
        leadingIcon='checkbox-outline'
        onPress={onMarkAsRead}
      />
      <Menu.Item
        title='Eliminar'
        leadingIcon='trash-can-outline'
        onPress={onDelete}
      />
    </Menu>
  )
}

const withNotificationObserver = withObservables(
  ['notification'],
  ({ notification }: { notification: SentNotification }) => ({
    notification
  })
)

const NotificationItem = ({ notification }: { notification: SentNotification }) => {
  const theme = useAppTheme()
  const dispatch = useAppDispatch()
  const database = useDatabase()
  const navigation = useNavigation()

  const onNotificationPress = useCallback(async () => {
    dispatch(setCattleInfo(await database.get<Cattle>(TableName.CATTLE).find(notification.cattle.id)))
    navigation.navigate('CattleStack', {
      screen: 'CattleProfileTabsStack',
      params: { screen: notification.type === 'medication' ? 'MedicationRoute' : 'InfoRoute' }
    })

    await notifee.cancelDisplayedNotification(notification.notifeeId)
    await notification.markAsRead()
  }, [notification])

  return (
    <List.Item
      title={NotificationTitle[notification.type]}
      description={() => <NotificationDescription notification={notification} />}
      left={() => <List.Icon icon={NotificationIcon[notification.type]} />}
      right={() => <ItemMenu notification={notification} />}
      onPress={onNotificationPress}
      style={{
        backgroundColor: notification.isMarkedAsRead ? theme.colors.surface : theme.colors.notificationContainer,
        paddingStart: 16,
        paddingRight: 4
      }}
    />
  )
}

export default withNotificationObserver(NotificationItem)
