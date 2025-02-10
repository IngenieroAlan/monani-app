import EmptyList from '@/components/EmptyList'
import { RecordsList } from '@/components/RecordsList'
import { TableName } from '@/database/constants'
import DailyMilkProduction from '@/database/models/DailyMilkProduction'
import MilkProduction from '@/database/models/MilkProduction'
import { milkProductionsKeys } from '@/queries/milkProduction/queryKeyFactory'
import { useInfiniteDailyMilkProductionsQuery } from '@/queries/milkProduction/useInfiniteDailyMilkProductionsQuery'
import { useDatabase } from '@nozbe/watermelondb/react'
import { FlashList } from '@shopify/flash-list'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { View, ViewToken } from 'react-native'
import { useMilkProductionsFilters } from '../contexts/MilkProductionsFiltersContext'
import { BetweenDatesFilterChip } from './BetweenDatesFilterChip'
import { MilkProductionsListItem } from './MilkProductionsListItem'

const keyExtractor = (item: DailyMilkProduction) => item.id

export const MilkProductionsList = () => {
  const db = useDatabase()
  const queryClient = useQueryClient()
  const { data, isFetchingNextPage, hasNextPage, isFetching, fetchNextPage } = useInfiniteDailyMilkProductionsQuery({
    betweenDates: useMilkProductionsFilters('betweenDates')
  })

  const results = useMemo(() => data?.pages.flatMap((page) => page.results) ?? [], [data])

  const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    viewableItems.forEach(async ({ item }: { item: DailyMilkProduction }) => {
      const productions = await item.milkProductions

      productions.forEach((production) => {
        queryClient.prefetchQuery({
          queryKey: milkProductionsKeys.byId(production.id),
          queryFn: () => db.get<MilkProduction>(TableName.MILK_PRODUCTIONS).find(production.id),
          initialData: production
        })
      })
    })
  }

  return (
    <RecordsList
      isPending={isFetching && !isFetchingNextPage}
      isListEmpty={results.length === 0 && !isFetching}
      emptyListComponent={
        <EmptyList
          text='No se han encontrado registros.'
          icon='magnify-remove-outline'
        />
      }
      filters={<BetweenDatesFilterChip />}
    >
      <FlashList
        data={results}
        renderItem={({ item }) => <MilkProductionsListItem milkProduction={item} />}
        estimatedItemSize={69}
        onEndReachedThreshold={2}
        keyExtractor={keyExtractor}
        onEndReached={() => !isFetchingNextPage && hasNextPage && fetchNextPage()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ minimumViewTime: 250 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListFooterComponent={() => <View style={{ height: 16 }} />}
      />
    </RecordsList>
  )
}
