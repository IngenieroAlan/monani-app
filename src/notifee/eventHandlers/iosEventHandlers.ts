import database from '@/database'
import Cattle from '@/database/models/Cattle'
import SentNotification from '@/database/models/SentNotification'
import { TableName } from '@/database/schema'
import { setCattleInfo } from '@/redux/slices/cattles'
import { Notification as Notifeecation } from '@notifee/react-native'
import { Q } from '@nozbe/watermelondb'
import { NavigationProp, NavigationState } from '@react-navigation/native'
import { Dispatch } from '@reduxjs/toolkit'
import { NotificationData } from '../types'
import { onDeliveredHandler } from './onDeliveredHandler'

type Navigation = Omit<NavigationProp<ReactNavigation.RootParamList>, 'getState'> & {
  getState(): NavigationState | undefined
}

const fetchByNotifeeId = async (notifeeId: string) => {
  return await database
    .get<SentNotification>(TableName.SENT_NOTIFICATIONS)
    .query(Q.where('notifee_id', notifeeId))
    .fetch()
}

export const iosPressHandler = async (notification: Notifeecation, navigation: Navigation, dispatch: Dispatch) => {
  const data = notification.data as NotificationData

  dispatch(setCattleInfo(await database.get<Cattle>(TableName.CATTLE).find(data.cattleId)))
  navigation.navigate('CattleStack', {
    screen: 'CattleProfileTabsStack',
    params: { screen: data.type === 'medication' ? 'MedicationRoute' : 'InfoRoute' }
  })

  await iosMarkAsReadHandler(notification)
}

export const iosSafeDeliveredHandler = async (notification: Notifeecation) => {
  const createdNotification = await fetchByNotifeeId(notification.id!)

  if (createdNotification.length > 0) return

  await onDeliveredHandler(notification)
}

export const iosMarkAsReadHandler = async (notification: Notifeecation) => {
  const createdNotification = await fetchByNotifeeId(notification.id!)

  if (createdNotification.length > 0) {
    await createdNotification[0].markAsRead()
    return
  }

  await onDeliveredHandler(notification, true)
}
