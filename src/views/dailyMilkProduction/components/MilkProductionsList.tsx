import EmptyList from '@/components/EmptyList'
import { RecordsList } from '@/components/RecordsList'
import { FlashList } from '@shopify/flash-list'
import { useMilkProductionsFilters } from '../contexts/MilkProductionsFiltersContext'
import { useDailyMilkProductions } from '../hooks/useDailyMilkProductions'
import { BetweenDatesFilterChip } from './BetweenDatesFilterChip'
import { MilkProductionsListItem } from './MilkProductionsListItem'

const ITEMS_PER_PAGINATE = 25

export const MilkProductionsList = () => {
  const nextIndex = useMilkProductionsFilters('nextIndex')
  const { milkProductionsRecords, isPending } = useDailyMilkProductions({
    betweenDates: useMilkProductionsFilters('betweenDates'),
    take: ITEMS_PER_PAGINATE + ITEMS_PER_PAGINATE * useMilkProductionsFilters('paginateIndex')
  })

  return (
    <RecordsList
      isPending={isPending}
      isListEmpty={milkProductionsRecords.length === 0 && !isPending}
      emptyListComponent={
        <EmptyList
          text='No se han encontrado registros.'
          icon='magnify-remove-outline'
        />
      }
      filters={<BetweenDatesFilterChip />}
    >
      <FlashList
        data={milkProductionsRecords}
        renderItem={({ item }) => <MilkProductionsListItem milkProduction={item} />}
        estimatedItemSize={69}
        onEndReachedThreshold={2}
        onEndReached={() => {
          if (milkProductionsRecords.length > 0) nextIndex()
        }}
      />
    </RecordsList>
  )
}
