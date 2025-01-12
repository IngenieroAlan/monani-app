import EmptyList from '@/components/EmptyList'
import { RecordsList } from '@/components/RecordsList'
import { FlashList } from '@shopify/flash-list'
import { useMilkProductions } from '../hooks/useMilkProductions'
import { MilkProductionsListItem } from './MilkProductionsListItem'

export const MilkProductionsList = () => {
  const { milkProductionsRecords, isPending } = useMilkProductions()

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
    >
      <FlashList
        data={milkProductionsRecords}
        renderItem={({ item }) => <MilkProductionsListItem milkProduction={item} />}
        estimatedItemSize={69}
      />
    </RecordsList>
  )
}
