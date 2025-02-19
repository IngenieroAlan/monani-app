import EmptyList from '@/components/EmptyList'
import { RecordsList } from '@/components/RecordsList'
import { MilkProductionsCol, TableName } from '@/database/constants'
import DailyMilkProduction from '@/database/models/DailyMilkProduction'
import MilkProduction from '@/database/models/MilkProduction'
import { milkProductionsKeys } from '@/queries/milkProduction/queryKeyFactory'
import { useInfiniteDailyMilkProductionsQuery } from '@/queries/milkProduction/useInfiniteDailyMilkProductionsQuery'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { FlashList } from '@shopify/flash-list'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { View, ViewToken } from 'react-native'
import { useMilkProductionsFilters } from '../contexts/MilkProductionsFiltersContext'
import { BetweenDatesFilterChip } from './BetweenDatesFilterChip'
import { MilkProductionsListItem } from './milkProductionListItem/MilkProductionsListItem'

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

      await queryClient.prefetchQuery({
        queryKey: milkProductionsKeys.groupedByDate(item.producedAt),
        queryFn: () =>
          db
            .get<MilkProduction>(TableName.MILK_PRODUCTIONS)
            .query(
              Q.unsafeSqlExpr(
                `date(${MilkProductionsCol.PRODUCED_AT} / 1000, 'unixepoch') = '${dayjs(item.producedAt).format(
                  'YYYY-MM-DD'
                )}'`
              )
            )
            .fetch(),
        initialData: productions
      })

      productions.forEach(async (production) => {
        await queryClient.prefetchQuery({
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
        renderItem={({ item }) => <MilkProductionsListItem dailyMilkProduction={item} />}
        estimatedItemSize={69}
        onEndReachedThreshold={2}
        keyExtractor={keyExtractor}
        onEndReached={() => !isFetchingNextPage && hasNextPage && fetchNextPage()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ minimumViewTime: 250 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListFooterComponent={() => <View style={{ height: 16 }} />}
      />
    </RecordsList>
  )
}
