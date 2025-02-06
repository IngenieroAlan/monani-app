import EmptyList from '@/components/EmptyList'
import { RecordsList } from '@/components/RecordsList'
import Feed from '@/database/models/Feed'
import { useInfiniteFeedsQuery } from '@/queries/feeds/useInfiniteFeedsQuery'
import { FlashList, FlashListProps } from '@shopify/flash-list'
import { useMemo } from 'react'
import { View } from 'react-native'
import { FeedsListItem } from './FeedsListItem'

type FeedsListProps = {
  flashListProps?: Omit<FlashListProps<Feed>, 'data' | 'renderItem' | 'keyExtractor'>
}

export const FeedsList = ({ flashListProps }: FeedsListProps) => {
  const { data, isFetchingNextPage, hasNextPage, isFetching, isRefetching, fetchNextPage } = useInfiniteFeedsQuery()

  const results = useMemo(() => data?.pages.flatMap((page) => page.results) ?? [], [data])

  return (
    <RecordsList
      isPending={isFetching && !isFetchingNextPage && !isRefetching}
      isListEmpty={results.length === 0 && !isFetching}
      emptyListComponent={
        <EmptyList
          icon='silverware'
          text='No se han encontrado registros.'
        />
      }
    >
      <FlashList
        estimatedItemSize={81}
        data={results}
        renderItem={({ item }) => <FeedsListItem feed={item} />}
        ListFooterComponent={() => <View style={{ height: 88 }} />}
        onEndReachedThreshold={1.5}
        onEndReached={() => !isFetchingNextPage && hasNextPage && fetchNextPage()}
        {...flashListProps}
      />
    </RecordsList>
  )
}
