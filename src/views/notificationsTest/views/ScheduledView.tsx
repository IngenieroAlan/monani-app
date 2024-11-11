import { createTriggerNotification } from '@/notifee/constructors'
import { NotificationData } from '@/notifee/types'
import notifee, { Notification, TimestampTrigger, TriggerNotification } from '@notifee/react-native'
import { FlashList } from '@shopify/flash-list'
import { addSeconds, format, formatDistanceToNowStrict } from 'date-fns'
import { es } from 'date-fns/locale'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { IconButton, List, Menu, Text } from 'react-native-paper'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { interval } from 'rxjs'

const NotificationMenu = ({ notification }: { notification: Notification }) => {
  const [visible, setVisible] = useState(false)
  const insets = useSafeAreaInsets()

  return (
    <Menu
      anchor={
        <IconButton
          icon='dots-vertical'
          onPress={() => setVisible(true)}
        />
      }
      visible={visible}
      anchorPosition='bottom'
      statusBarHeight={insets.top - 4}
      onDismiss={() => setVisible(false)}
    >
      <Menu.Item
        title='Notificar ahora'
        leadingIcon='bell-ring-outline'
        onPress={async () => {
          setVisible(false)

          await createTriggerNotification({
            id: notification.id,
            title: notification.title!,
            subtitle: notification.subtitle,
            body: notification.body!,
            data: notification.data as NotificationData,
            triggerTimestamp: addSeconds(new Date(), 1).getTime()
          })
        }}
      />
      <Menu.Item
        title='Cancelar notificación'
        leadingIcon='bell-off-outline'
        onPress={async () => {
          if (!notification.id) throw new Error('Notification without ID.')

          setVisible(false)
          await notifee.cancelTriggerNotification(notification.id)
        }}
      />
    </Menu>
  )
}

const ScheduledView = () => {
  const [triggerNotifications, setTriggerNotifications] = useState<TriggerNotification[]>([])

  useEffect(() => {
    const subscription = interval(1000).subscribe(async () => {
      setTriggerNotifications(
        (await notifee.getTriggerNotifications()).sort(
          (a, b) => (a.trigger as TimestampTrigger).timestamp - (b.trigger as TimestampTrigger).timestamp
        )
      )
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />
      <FlashList
        estimatedItemSize={100}
        data={triggerNotifications}
        renderItem={({ item }) => (
          <List.Item
            title={() => (
              <View>
                <Text variant='labelSmall'>{`Programada para el: ${format(
                  (item.trigger as TimestampTrigger).timestamp,
                  'PPpp	',
                  { locale: es }
                )}`}</Text>
                <Text>{item.notification.title}</Text>
              </View>
            )}
            description={item.notification.body}
            right={() => (
              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={{ paddingRight: 12, textAlign: 'right' }}
                  variant='labelSmall'
                >
                  {formatDistanceToNowStrict((item.trigger as TimestampTrigger).timestamp, {
                    addSuffix: true,
                    locale: es
                  })}
                </Text>
                <NotificationMenu notification={item.notification} />
              </View>
            )}
            style={{ paddingRight: 4 }}
          />
        )}
      />
    </SafeAreaView>
  )
}

export default ScheduledView
