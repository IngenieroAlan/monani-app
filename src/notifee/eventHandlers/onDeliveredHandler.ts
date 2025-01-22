import database from '@/database'
import { TableName } from '@/database/constants'
import PendingNotification from '@/database/models/PendingNotification'
import { createNotification } from '@/utils/collections/sentNotifications'
import { Notification } from '@notifee/react-native'
import { addDays, addMonths } from 'date-fns'
import { createTriggerNotification } from '../constructors'
import { NotificationData } from '../types'

const AVG_DAYS_PER_MONTH = 30.437

/*
 * When a notification is delivered on iOS through some other event than Delivered, it needs to be created,
 * most of times it will need to be created as a notification read.
 */
export const onDeliveredHandler = async (notification: Notification, isMarkedAsRead: boolean = false) => {
  const data = notification.data as NotificationData

  const createdNotification = await createNotification({
    notifeeId: notification!.id!,
    eventAt: new Date(data.timestamp!),
    cattleId: data.cattleId,
    type: data.type,
    isMarkedAsRead: isMarkedAsRead,
    extraInfo: data.extraInfo ? JSON.parse(data.extraInfo) : undefined
  })

  const pendingNotification = await database.collections
    .get<PendingNotification>(TableName.PENDING_NOTIFICATIONS)
    .find(createdNotification.notifeeId)

  await pendingNotification.delete()

  if (!data.timesPerYear || data.timesPerYear <= 0) return

  const interval = 12 / data.timesPerYear
  const nextTriggerTimestamp =
    interval % 1 === 0
      ? addMonths(data.timestamp, interval).getTime()
      : addDays(data.timestamp, interval * AVG_DAYS_PER_MONTH).getTime()

  createTriggerNotification({
    title: notification.title!,
    subtitle: notification.subtitle,
    body: notification.body!,
    data: {
      ...(notification.data as NotificationData),
      timestamp: nextTriggerTimestamp
    },
    triggerTimestamp: nextTriggerTimestamp
  })
}
