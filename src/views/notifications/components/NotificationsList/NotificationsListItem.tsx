import Cattle from '@/database/models/Cattle'
import SentNotification from '@/database/models/SentNotification'
import { TableName } from '@/database/schema'
import { useAppDispatch } from '@/hooks/useRedux'
import { setCattleInfo } from '@/redux/slices/cattles'
import useAppTheme from '@/theme'
import notifee from '@notifee/react-native'
import { useDatabase, withObservables } from '@nozbe/watermelondb/react'
import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'
import { List } from 'react-native-paper'
import { NotificationIcon, NotificationTitle } from '../types'
import { NotificationsListItemDescription } from './NotificationsListItemDescription'
import { NotificationsListItemMenu } from './NotificationsListItemMenu'

const withNotificationObserver = withObservables(
  ['notification'],
  ({ notification }: { notification: SentNotification }) => ({
    notification
  })
)

export const NotificationsListItem = withNotificationObserver(
  ({ notification }: { notification: SentNotification }) => {
    const theme = useAppTheme()
    const dispatch = useAppDispatch()
    const database = useDatabase()
    const navigation = useNavigation()

    const onPress = useCallback(async () => {
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
        description={() => <NotificationsListItemDescription notification={notification} />}
        left={() => <List.Icon icon={NotificationIcon[notification.type]} />}
        right={() => <NotificationsListItemMenu notification={notification} />}
        onPress={onPress}
        style={{
          backgroundColor: notification.isMarkedAsRead ? theme.colors.surface : theme.colors.notificationContainer,
          paddingStart: 16,
          paddingRight: 4
        }}
      />
    )
  }
)
