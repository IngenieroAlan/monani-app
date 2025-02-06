import { useCattleFilters } from '@/contexts/CattleFiltersContext'
import Cattle from '@/database/models/Cattle'
import { useInfiniteCattleQuery } from '@/queries/cattle/useInfiniteCattleQuery'
import { FlashList, FlashListProps } from '@shopify/flash-list'
import { useMemo } from 'react'
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
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage, isFetching } = useInfiniteCattleQuery({
    tagId: useCattleFilters('tagId'),
    cattleStatus: useCattleFilters('cattleStatus'),
    productionType: useCattleFilters('productionType'),
    isInQuarantine: useCattleFilters('isInQuarantine'),
    ...useCattleFilters('flags')
  })

  const results = useMemo(() => data?.pages.flatMap((page) => page.results) ?? [], [data])

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
      />
    </RecordsList>
  )
}

CattleList.StatusFilterChip = CattleListStatusFilterChip
CattleList.ProductionFilterChip = CattleListProductionFilterChip
CattleList.FlagFilterChip = CattleListFlagFilterChip
CattleList.QuarantineFilterChip = CattleListQuarantineFilterChip

export default CattleList
