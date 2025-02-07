import EmptyList from '@/components/EmptyList'
import { RecordsList } from '@/components/RecordsList'
import Medication from '@/database/models/Medication'
import { useInfiniteMedicationsQuery } from '@/queries/medications/useInfiniteMedicationsQuery'
import { FlashList, FlashListProps } from '@shopify/flash-list'
import { useMemo } from 'react'
import { View } from 'react-native'
import { MedicationsListItem } from './MedicationsListItem'

type MedicationsListProps = {
  flashListProps?: Omit<FlashListProps<Medication>, 'data' | 'renderItem' | 'keyExtractor'>
}

export const MedicationsList = ({ flashListProps }: MedicationsListProps) => {
  const { data, isFetchingNextPage, hasNextPage, isFetching, isRefetching, fetchNextPage } =
    useInfiniteMedicationsQuery()

  const results = useMemo(() => data?.pages.flatMap((page) => page.results) ?? [], [data])

  return (
    <RecordsList
      isPending={isFetching && !isFetchingNextPage && !isRefetching}
      isListEmpty={results.length === 0 && !isFetching}
      emptyListComponent={
        <EmptyList
          icon='magnify-remove-outline'
          text='No se han encontrado registros.'
        />
      }
    >
      <FlashList
        estimatedItemSize={81}
        data={results}
        renderItem={({ item }) => <MedicationsListItem medication={item} />}
        ListFooterComponent={() => <View style={{ height: 88 }} />}
        onEndReachedThreshold={1.5}
        onEndReached={() => !isFetchingNextPage && hasNextPage && fetchNextPage()}
        {...flashListProps}
      />
    </RecordsList>
  )
}
