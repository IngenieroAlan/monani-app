import { useCattleFilters } from '@/contexts/CattleFiltersContext'
import { TableName } from '@/database/constants'
import Cattle from '@/database/models/Cattle'
import { cattleKeys } from '@/queries/cattle/queryKeyFactory'
import { useInfiniteCattleQuery } from '@/queries/cattle/useInfiniteCattleQuery'
import { useDatabase } from '@nozbe/watermelondb/react'
import { FlashList, FlashListProps, ViewToken } from '@shopify/flash-list'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { View } from 'react-native'
import EmptyList from '../EmptyList'
import { RecordsList } from '../RecordsList'
import CattleListFlagFilterChip from './CattleListFlagFilterChip'
import CattleListProductionFilterChip from './CattleListProductionFilterChip'
import CattleListQuarantineFilterChip from './CattleListQuarantineFilterChip'
import CattleListStatusFilterChip from './CattleListStatusFilterChip'

type CattleListProps = {
  filters: JSX.Element
  children: ({ item }: { item: Cattle }) => JSX.Element
  flashListProps?: Omit<FlashListProps<Cattle>, 'data' | 'renderItem' | 'keyExtractor'>
}

const keyExtractor = (item: Cattle) => item.id

const CattleList = ({ filters, children, flashListProps }: CattleListProps) => {
  const db = useDatabase()
  const queryClient = useQueryClient()
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage, isFetching } = useInfiniteCattleQuery({
    tagId: useCattleFilters('tagId'),
    cattleStatus: useCattleFilters('cattleStatus'),
    productionType: useCattleFilters('productionType'),
    isInQuarantine: useCattleFilters('isInQuarantine'),
    ...useCattleFilters('flags')
  })

  const results = useMemo(() => data?.pages.flatMap((page) => page.results) ?? [], [data])

  const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    viewableItems.forEach(({ item }: { item: Cattle }) => {
      queryClient.prefetchQuery({
        queryKey: cattleKeys.byId(item.id),
        queryFn: () => db.get<Cattle>(TableName.CATTLE).find(item.id),
        initialData: item
      })
    })
  }

  return (
    <RecordsList
      isPending={isFetching && !isFetchingNextPage}
      isListEmpty={results.length === 0 && !isFetching}
      filters={filters}
      emptyListComponent={
        <EmptyList
          icon='cow-off'
          text='No se han encontrado registros.'
        />
      }
    >
      <FlashList
        {...flashListProps}
        data={results}
        renderItem={({ item }) => children({ item })}
        keyExtractor={keyExtractor}
        onEndReached={() => !isFetchingNextPage && hasNextPage && fetchNextPage()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ minimumViewTime: 250 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </RecordsList>
  )
}

CattleList.StatusFilterChip = CattleListStatusFilterChip
CattleList.ProductionFilterChip = CattleListProductionFilterChip
CattleList.FlagFilterChip = CattleListFlagFilterChip
CattleList.QuarantineFilterChip = CattleListQuarantineFilterChip

export default CattleList
