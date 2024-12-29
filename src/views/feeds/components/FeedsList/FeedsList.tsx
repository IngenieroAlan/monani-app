import EmptyList from '@/components/EmptyList'
import { RecordsList } from '@/components/RecordsList'
import Feed from '@/database/models/Feed'
import useFeeds from '@/hooks/collections/useFeeds'
import { FlashList, FlashListProps } from '@shopify/flash-list'
import { useState } from 'react'
import { View } from 'react-native'
import { FeedsListItem } from './FeedsListItem'

const ITEMS_PER_PAGINATE = 25

type FeedsListProps = {
  flashListProps?: Omit<FlashListProps<Feed>, 'data' | 'renderItem' | 'keyExtractor'>
}

export const FeedsList = ({ flashListProps }: FeedsListProps) => {
  const [index, setIndex] = useState(0)
  const { feedsRecords, isPending } = useFeeds({
    take: ITEMS_PER_PAGINATE + ITEMS_PER_PAGINATE * index
  })

  return (
    <RecordsList
      isPending={isPending}
      isListEmpty={feedsRecords.length === 0 && !isPending}
      emptyListComponent={
        <EmptyList
          icon='silverware'
          text='No se han encontado registros.'
        />
      }
    >
      <FlashList
        estimatedItemSize={81}
        data={feedsRecords}
        renderItem={({ item }) => <FeedsListItem feed={item} />}
        ListFooterComponent={() => <View style={{ height: 88 }} />}
        onEndReachedThreshold={1.5}
        onEndReached={() => {
          if (feedsRecords.length > 0) setIndex(index + 1)
        }}
        {...flashListProps}
      />
    </RecordsList>
  )
}
