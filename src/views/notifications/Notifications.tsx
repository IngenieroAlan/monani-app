import NotificationsAppbar from '@/components/notifications/NotificationsAppbar'
import NotificationsSection from '@/components/notifications/NotificationsSection'
import SentNotification from '@/database/models/Notification'
import useNotifications from '@/hooks/collections/useNotifications'
import useAppTheme from '@/theme'
import { FlashList } from '@shopify/flash-list'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { StatusBar } from 'expo-status-bar'
import { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

const formatNotificationDate = (timestamp: Date) => {
  const today = new Date()
  const notificationDate = new Date(timestamp)

  const isToday = notificationDate.toDateString() === today.toDateString()
  const isYesterday = notificationDate.toDateString() === new Date(today.setDate(today.getDate() - 1)).toDateString()

  if (isToday) {
    return 'Hoy'
  } else if (isYesterday) {
    return 'Ayer'
  } else {
    return format(notificationDate, "d 'de' MMMM 'de' yyyy", { locale: es })
  }
}

const groupNotificationsByDay = (notifications: SentNotification[]): Record<string, SentNotification[]> => {
  return notifications.reduce((acc: Record<string, SentNotification[]>, notification) => {
    const dateKey: string = formatNotificationDate(notification.eventAt)

    if (!acc[dateKey]) {
      acc[dateKey] = []
    }

    acc[dateKey].push(notification)
    return acc
  }, {})
}

const ITEMS_PER_PAGE = 25

export const NotificationsView = () => {
  const theme = useAppTheme()
  const [index, setIndex] = useState(0)
  const { notifications } = useNotifications({
    take: ITEMS_PER_PAGE + ITEMS_PER_PAGE * index
  })

  const groupedNotifications = useMemo(() => {
    const groups = groupNotificationsByDay(notifications)

    /*
     * To return an array of objects with the form:
     * {
     *    date: string
     *    notifications: Notification[]
     * }
     * and use it with a flashlist.
     */
    return Object.entries(groups).map(([date, notifications]) => ({
      date,
      notifications
    }))
  }, [notifications])

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <NotificationsAppbar />
      <StatusBar />
      {notifications.length > 0 ? (
        <FlashList
          estimatedItemSize={132}
          data={groupedNotifications}
          renderItem={({ item }) => <NotificationsSection dayNotifications={item} />}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={2}
          onEndReached={() => setIndex(index + 1)}
        />
      ) : (
        <View style={styles.notificationsEmpty}>
          <Icon
            size={56}
            source='sleep'
          />
          <Text
            style={{ textAlign: 'center' }}
            variant='titleMedium'
          >
            Aún no hay notificaciones nuevas.
          </Text>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  notificationsEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  }
})
