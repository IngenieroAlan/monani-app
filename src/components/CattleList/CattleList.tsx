import { useCattleFilters } from '@/contexts/CattleFiltersContext'
import Cattle from '@/database/models/Cattle'
import useCattle from '@/hooks/collections/useCattle'
import { FlashList, FlashListProps } from '@shopify/flash-list'
import EmptyList from '../EmptyList'
import { RecordsList } from '../RecordsList'
import CattleListFlagFilterChip from './CattleListFlagFilterChip'
import CattleListProductionFilterChip from './CattleListProductionFilterChip'
import CattleListQuarantineFilterChip from './CattleListQuarantineFilterChip'
import CattleListStatusFilterChip from './CattleListStatusFilterChip'

const ITEMS_PER_PAGINATE = 25

type CattleListProps = {
  filters: JSX.Element
  children: ({ item }: { item: Cattle }) => JSX.Element
  flashListProps?: Omit<FlashListProps<Cattle>, 'data' | 'renderItem' | 'keyExtractor'>
}

const keyExtractor = (item: Cattle) => item.id

const CattleList = ({ filters, children, flashListProps }: CattleListProps) => {
  const nextIndex = useCattleFilters('nextIndex')

  const { cattleRecords, isPending } = useCattle({
    tagId: useCattleFilters('tagId'),
    cattleStatus: useCattleFilters('cattleStatus'),
    productionType: useCattleFilters('productionType'),
    isInQuarantine: useCattleFilters('isInQuarantine'),
    ...useCattleFilters('flags'),
    take: ITEMS_PER_PAGINATE + ITEMS_PER_PAGINATE * useCattleFilters('paginateIndex')
  })

  return (
    <RecordsList
      isPending={isPending}
      isListEmpty={cattleRecords.length === 0 && !isPending}
      filters={filters}
      emptyListComponent={
        <EmptyList
          icon='cow-off'
          text='No se han encontrado registros.'
        />
      }
    >
      <FlashList
        data={cattleRecords}
        renderItem={children}
        keyExtractor={keyExtractor}
        onEndReached={() => {
          if (cattleRecords.length > 0) nextIndex()
        }}
        {...flashListProps}
      />
    </RecordsList>
  )
}

CattleList.StatusFilterChip = CattleListStatusFilterChip
CattleList.ProductionFilterChip = CattleListProductionFilterChip
CattleList.FlagFilterChip = CattleListFlagFilterChip
CattleList.QuarantineFilterChip = CattleListQuarantineFilterChip

export default CattleList
