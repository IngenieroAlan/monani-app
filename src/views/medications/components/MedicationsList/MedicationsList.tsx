import EmptyList from '@/components/EmptyList'
import { RecordsList } from '@/components/RecordsList'
import Medication from '@/database/models/Medication'
import useMedications from '@/hooks/collections/useMedications'
import { FlashList, FlashListProps } from '@shopify/flash-list'
import { useState } from 'react'
import { View } from 'react-native'
import { MedicationsListItem } from './MedicationsListItem'

const ITEMS_PER_PAGINATE = 25

type MedicationsListProps = {
  flashListProps?: Omit<FlashListProps<Medication>, 'data' | 'renderItem' | 'keyExtractor'>
}

export const MedicationsList = ({ flashListProps }: MedicationsListProps) => {
  const [index, setIndex] = useState(0)
  const { medicationsRecords, isPending } = useMedications({
    take: ITEMS_PER_PAGINATE + ITEMS_PER_PAGINATE * index
  })

  return (
    <RecordsList
      isPending={isPending}
      isListEmpty={medicationsRecords.length === 0 && !isPending}
      emptyListComponent={
        <EmptyList
          icon='magnify-remove-outline'
          text='No se han encontrado registros.'
        />
      }
    >
      <FlashList
        estimatedItemSize={81}
        data={medicationsRecords}
        renderItem={({ item }) => <MedicationsListItem medication={item} />}
        ListFooterComponent={() => <View style={{ height: 88 }} />}
        onEndReachedThreshold={1.5}
        onEndReached={() => {
          if (medicationsRecords.length > 0) setIndex(index + 1)
        }}
        {...flashListProps}
      />
    </RecordsList>
  )
}
