import EmptyList from '@/components/EmptyList'
import { RecordsList } from '@/components/RecordsList'
import useSentNotifications from '@/views/notifications/hooks/useSentNotifications'
import { FlashList } from '@shopify/flash-list'
import { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { NotificationsListItem } from './NotificationsListItem'

const ITEMS_PER_PAGINATE = 25

const keyExtractor = (_: any, index: number) => index.toString()

export const NotificationsList = () => {
  const [index, setIndex] = useState(0)
  const { notificationsRecords, isPending } = useSentNotifications({
    take: ITEMS_PER_PAGINATE + ITEMS_PER_PAGINATE * index
  })

  return (
    <RecordsList
      isPending={isPending}
      isListEmpty={notificationsRecords.length === 0 && !isPending}
      emptyListComponent={
        <EmptyList
          icon='sleep'
          text='Aún no hay notificaciones nuevas.'
        />
      }
    >
      <FlashList
        estimatedItemSize={68}
        data={notificationsRecords}
        renderItem={({ item }) => {
          if (typeof item === 'string') {
            return (
              <Text
                variant='titleSmall'
                style={styles.title}
              >
                {item}
              </Text>
            )
          } else {
            return (
              <NotificationsListItem
                key={item.id}
                notification={item}
              />
            )
          }
        }}
        getItemType={(item) => (typeof item === 'string' ? 'sectionHeader' : 'row')}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={2}
        onEndReached={() => {
          if (notificationsRecords.length > 0) setIndex(index + 1)
        }}
      />
    </RecordsList>
  )
}

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 24
  }
})
