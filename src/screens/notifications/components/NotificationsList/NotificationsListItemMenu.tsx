import SentNotification from '@/database/models/SentNotification'
import notifee from '@notifee/react-native'
import { useCallback, useState } from 'react'
import { IconButton, Menu } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const MENU_OFFSET = 4

export const NotificationsListItemMenu = ({ notification }: { notification: SentNotification }) => {
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
