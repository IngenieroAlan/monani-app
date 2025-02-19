import database from '@/database'
import { SentNotificationsCol as Column, TableName } from '@/database/constants'
import Cattle from '@/database/models/Cattle'
import SentNotification from '@/database/models/SentNotification'
import { setCattleInfo } from '@/redux/slices/cattles'
import { Notification as Notifeecation } from '@notifee/react-native'
import { Q } from '@nozbe/watermelondb'
import { NavigationProp, NavigationState } from '@react-navigation/native'
import { Dispatch } from '@reduxjs/toolkit'
import { NotificationData } from '../types'

type Navigation = Omit<NavigationProp<ReactNavigation.RootParamList>, 'getState'> & {
  getState(): NavigationState | undefined
}

export const androidPressHandler = async (notification: Notifeecation, navigation: Navigation, dispatch: Dispatch) => {
  const data = notification.data as NotificationData

  dispatch(setCattleInfo(await database.get<Cattle>(TableName.CATTLE).find(data.cattleId)))
  navigation.navigate('CattleStack', {
    screen: 'CattleProfileTabsStack',
    params: { screen: data.type === 'medication' ? 'MedicationRoute' : 'InfoRoute' }
  })

  const appNotification = await database
    .get<SentNotification>(TableName.SENT_NOTIFICATIONS)
    .query(Q.where(Column.NOTIFEE_ID, notification!.id!))
    .fetch()
  await appNotification[0].markAsRead()
}

export const androidMarkAsReadHandler = async (notification: Notifeecation) => {
  const appNotification = await database
    .get<SentNotification>(TableName.SENT_NOTIFICATIONS)
    .query(Q.where(Column.NOTIFEE_ID, notification.id!))
    .fetch()

  if (appNotification.length === 0) return

  await appNotification[0].markAsRead()
}
