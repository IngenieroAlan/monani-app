import { deleteAllNotifications, markAllAsRead } from '@/utils/collections/sentNotifications'
import useSentNotifications from '@/views/notifications/hooks/useSentNotifications'
import notifee from '@notifee/react-native'
import { useCallback } from 'react'
import { Appbar, Tooltip } from 'react-native-paper'

const CheckAllAction = () => {
  const { notificationsRecords } = useSentNotifications({ isMarkedAsRead: false })

  const onMarkAllAsRead = useCallback(async () => {
    await notifee.cancelDisplayedNotifications()
    markAllAsRead()
  }, [])

  return (
    <Tooltip title='Marcara todo como leído'>
      <Appbar.Action
        disabled={notificationsRecords.length === 0}
        icon='checkbox-multiple-outline'
        onPress={onMarkAllAsRead}
      />
    </Tooltip>
  )
}

const NotificationsAppbar = () => {
  const { notificationsRecords } = useSentNotifications()

  const onDeleteAll = useCallback(async () => {
    await notifee.cancelDisplayedNotifications()
    deleteAllNotifications()
  }, [])

  return (
    <Appbar style={{ justifyContent: 'flex-end' }}>
      {notificationsRecords.length > 0 && (
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
