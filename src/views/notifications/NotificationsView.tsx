import NotificationsAppbar from '@/views/notifications/components/NotificationsAppbar'
import NotificationsSection from '@/views/notifications/components/NotificationsSection'
import SentNotification from '@/database/models/SentNotification'
import useSentNotifications from '@/hooks/collections/useSentNotifications'
import useAppTheme from '@/theme'
import { formatDateRelativeToYear } from '@/utils/helpers'
import { FlashList } from '@shopify/flash-list'
import { StatusBar } from 'expo-status-bar'
import { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

const groupNotificationsByDay = (notifications: SentNotification[]) => {
  return notifications.reduce((acc: Record<string, SentNotification[]>, notification) => {
    const dateKey = formatDateRelativeToYear(notification.eventAt)

    if (!acc[dateKey]) acc[dateKey] = []

    acc[dateKey].push(notification)
    return acc
  }, {})
}

const ITEMS_PER_PAGE = 25

const NotificationsView = () => {
  const theme = useAppTheme()
  const [index, setIndex] = useState(0)
  const { notifications } = useSentNotifications({
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

export default NotificationsView

const styles = StyleSheet.create({
  notificationsEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  }
})
