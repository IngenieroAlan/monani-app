import useSentNotifications from '@/hooks/collections/useSentNotifications'
import { deleteAllNotifications, markAllAsRead } from '@/utils/collections/sentNotifications'
import notifee from '@notifee/react-native'
import { useCallback } from 'react'
import { Appbar, Tooltip } from 'react-native-paper'

const CheckAllAction = () => {
  const { notifications } = useSentNotifications({ isMarkedAsRead: false })

  const onMarkAllAsRead = useCallback(async () => {
    await notifee.cancelDisplayedNotifications()
    markAllAsRead()
  }, [])

  return (
    <Tooltip title='Marcara todo como leído'>
      <Appbar.Action
        disabled={notifications.length === 0}
        icon='checkbox-multiple-outline'
        onPress={onMarkAllAsRead}
      />
    </Tooltip>
  )
}

const NotificationsAppbar = () => {
  const { notifications } = useSentNotifications()

  const onDeleteAll = useCallback(async () => {
    await notifee.cancelDisplayedNotifications()
    deleteAllNotifications()
  }, [])

  return (
    <Appbar style={{ justifyContent: 'flex-end' }}>
      {notifications.length > 0 && (
        <>
          <CheckAllAction />
          <Tooltip title='Eliminar todo'>
            <Appbar.Action
              icon='delete-sweep-outline'
              onPress={onDeleteAll}
            />
          </Tooltip>
        </>
      )}
    </Appbar>
  )
}

export default NotificationsAppbar
