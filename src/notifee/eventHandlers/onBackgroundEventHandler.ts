import { Event, EventType } from '@notifee/react-native'
import { Platform } from 'react-native'
import { CattleNotificationEventType } from '../types'
import { androidMarkAsReadHandler } from './androidEventHandlers'
import { iosMarkAsReadHandler, iosSafeDeliveredHandler } from './iosEventHandlers'
import { onDeliveredHandler } from './onDeliveredHandler'

const onBackgroundEventHandler = async ({ type, detail }: Event) => {
  const { notification, pressAction } = detail

  if (!notification) return

  switch (type) {
    // This event is not fired in iOS.
    case EventType.DELIVERED:
      await onDeliveredHandler(notification)

      break

    /*
     * Since delivered event is not fired on iOS while app is in background. The only way to
     * store triggered notifications is when user dismisses or presses the notification.
     */
    case EventType.PRESS:
    case EventType.DISMISSED:
      if (Platform.OS === 'android') return

      await iosSafeDeliveredHandler(notification)

      break

    case EventType.ACTION_PRESS: {
      if (!pressAction?.id) throw new Error(`An action with an unknown id was pressed. ID: ${pressAction?.id}`)

      switch (Platform.OS) {
        case 'android':
          if (CattleNotificationEventType.MARK_AS_READ) {
            await androidMarkAsReadHandler(notification)
          }

          break

        case 'ios':
          if (CattleNotificationEventType.MARK_AS_READ) {
            await iosMarkAsReadHandler(notification)
          }

          break
      }
    }
  }

  console.log('Backgrond event fired. Type:', type)
}

export default onBackgroundEventHandler
