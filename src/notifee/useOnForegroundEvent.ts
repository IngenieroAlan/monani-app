import { useAppDispatch } from '@/hooks/useRedux'
import notifee, { EventType } from '@notifee/react-native'
import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import { androidMarkAsReadHandler, androidPressHandler } from './eventHandlers/androidEventHandlers'
import { iosMarkAsReadHandler, iosPressHandler, iosSafeDeliveredHandler } from './eventHandlers/iosEventHandlers'
import { onDeliveredHandler } from './eventHandlers/onDeliveredHandler'
import { CattleNotificationEventType } from './types'

const useOnForegroundEvent = () => {
  const dispatch = useAppDispatch()
  const navigation = useNavigation()

  useEffect(() => {
    return notifee.onForegroundEvent(async ({ type, detail }) => {
      const { notification, pressAction } = detail

      if (!notification) throw new Error('Notification not found in onForegroundEventHandler.')

      switch (type) {
        case EventType.DELIVERED:
          await onDeliveredHandler(notification)

          break

        case EventType.DISMISSED:
          if (Platform.OS === 'android') return

          await iosSafeDeliveredHandler(notification)

          break

        case EventType.PRESS:
          if (Platform.OS === 'android') {
            await androidPressHandler(notification, navigation, dispatch)
            return
          }

          await iosPressHandler(notification, navigation, dispatch)

          break

        case EventType.ACTION_PRESS:
          if (!pressAction?.id) throw new Error(`An action with an unknown ID was pressed. ID: ${pressAction?.id}`)

          switch (Platform.OS) {
            case 'android':
              if (pressAction.id === CattleNotificationEventType.MARK_AS_READ) {
                await androidMarkAsReadHandler(notification)
              }
              break

            case 'ios':
              if (pressAction.id === CattleNotificationEventType.MARK_AS_READ) {
                await iosMarkAsReadHandler(notification)
              }
              break
          }
      }

      console.log('Foreground event fired. Type:', type)
    })
  }, [])
}

export default useOnForegroundEvent
