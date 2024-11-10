import { createNotification } from '@/utils/notifications'
import { Notification } from '@notifee/react-native'
import { Platform } from 'react-native'
import { NotificationData } from '../types'

/*
 * When a notification is delivered on iOS through some other event than Delivered, it needs to be created,
 * most of times it will need to be created as a notification read.
 */
export const onDeliveredHandler = async (notification: Notification, isMarkedAsRead: boolean = false) => {
  const data = notification.data as NotificationData

  await createNotification({
    notifeeId: notification!.id!,
    eventAt: Platform.OS === 'android' ? new Date() : new Date(data.timestamp!),
    cattleId: data.cattleId,
    type: data.type,
    foreignId: data.foreignId,
    isMarkedAsRead: isMarkedAsRead,
    extraInfo: data.extraInfo ? JSON.parse(data.extraInfo) : undefined
  })
}
