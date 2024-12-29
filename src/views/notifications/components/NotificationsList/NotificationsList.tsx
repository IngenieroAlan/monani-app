import EmptyList from '@/components/EmptyList'
import { RecordsList } from '@/components/RecordsList'
import useSentNotifications from '@/views/notifications/hooks/useSentNotifications'
import { FlashList } from '@shopify/flash-list'
import { useState } from 'react'
import { NotificationsListSection } from './NotificationsListSection'

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
        estimatedItemSize={159}
        data={notificationsRecords}
        renderItem={({ item }) => <NotificationsListSection notificationsByDate={item} />}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={2}
        onEndReached={() => {
          if (notificationsRecords.length > 0) setIndex(index + 1)
        }}
      />
    </RecordsList>
  )
}
