import EmptyList from '@/components/EmptyList'
import useSentNotifications from '@/views/notifications/hooks/useSentNotifications'
import { FlashList } from '@shopify/flash-list'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { NotificationsListSection } from './NotificationsListSection'

const ITEMS_PER_PAGINATE = 25

const keyExtractor = (_: any, index: number) => index.toString()

export const NotificationsList = () => {
  const [index, setIndex] = useState(0)
  const { notificationsRecords, isPending } = useSentNotifications({
    take: ITEMS_PER_PAGINATE + ITEMS_PER_PAGINATE * index
  })

  return (
    <View style={{ flex: 1 }}>
      <ActivityIndicator
        style={[styles.activityIndicator, { opacity: +isPending }]}
        size='large'
        animating
      />
      {notificationsRecords.length === 0 && !isPending ? (
        <EmptyList
          icon='sleep'
          text='Aún no hay notificaciones nuevas.'
        />
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, opacity: +!isPending }}>
            <FlashList
              estimatedItemSize={159}
              data={notificationsRecords}
              renderItem={({ item }) => <NotificationsListSection notificationsByDate={item} />}
              keyExtractor={keyExtractor}
              onEndReachedThreshold={2}
              onEndReached={() => {
                if (notificationsRecords.length > 0) setIndex(index + 1)
              }}
            />
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  activityIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
})
