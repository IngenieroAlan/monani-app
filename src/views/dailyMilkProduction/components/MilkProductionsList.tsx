import EmptyList from '@/components/EmptyList'
import { RecordsList } from '@/components/RecordsList'
import { useMilkProductionsFilters } from '@/contexts/MilkProductionsFiltersContext'
import { FlashList } from '@shopify/flash-list'
import { useMilkProductions } from '../hooks/useMilkProductions'
import { BetweenDatesFilterChip } from './BetweenDatesFilterChip'
import { MilkProductionsListItem } from './MilkProductionsListItem'

export const MilkProductionsList = () => {
  const { milkProductionsRecords, isPending } = useMilkProductions({
    betweenDates: useMilkProductionsFilters('betweenDates')
  })

  return (
    <RecordsList
      isPending={isPending}
      isListEmpty={milkProductionsRecords.length === 0 && !isPending}
      emptyListComponent={
        <EmptyList
          text='No se han encontrado registros.'
          icon='search-off'
        />
      }
      filters={<BetweenDatesFilterChip />}
    >
      <FlashList
        data={milkProductionsRecords}
        renderItem={({ item }) => <MilkProductionsListItem milkProduction={item} />}
        estimatedItemSize={69}
      />
    </RecordsList>
  )
}
