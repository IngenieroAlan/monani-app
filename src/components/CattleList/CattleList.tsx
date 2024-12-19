import { useCattleFilters } from '@/contexts/CattleFiltersContext'
import Cattle from '@/database/models/Cattle'
import useCattle from '@/hooks/collections/useCattle'
import { FlashList, FlashListProps } from '@shopify/flash-list'
import { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { ScrollView } from 'react-native-use-form'
import EmptyList from '../EmptyList'
import CattleListFlagFilterChip from './CattleListFlagFilterChip'
import CattleListProductionFilterChip from './CattleListProductionFilterChip'
import CattleListQuarantineFilterChip from './CattleListQuarantineFilterChip'
import CattleListStatusFilterChip from './CattleListStatusFilterChip'

const ITEMS_PER_PAGINATE = 25

type CattleListProps = {
  filters?: ReactNode
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
    <>
      {filters && (
        <View>
          <ScrollView
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={styles.filtersView}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {filters}
          </ScrollView>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <ActivityIndicator
          style={[styles.activityIndicator, { opacity: +isPending }]}
          size='large'
          animating
        />
        {cattleRecords.length === 0 && !isPending ? (
          <EmptyList
            icon='cow-off'
            text='No se han encontrado registros.'
          />
        ) : (
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, opacity: +!isPending }}>
              <FlashList
                data={cattleRecords}
                renderItem={children}
                keyExtractor={keyExtractor}
                onEndReached={() => {
                  if (cattleRecords.length > 0) nextIndex()
                }}
                {...flashListProps}
              />
            </View>
          </View>
        )}
      </View>
    </>
  )
}

CattleList.StatusFilterChip = CattleListStatusFilterChip
CattleList.ProductionFilterChip = CattleListProductionFilterChip
CattleList.FlagFilterChip = CattleListFlagFilterChip
CattleList.QuarantineFilterChip = CattleListQuarantineFilterChip

export default CattleList

const styles = StyleSheet.create({
  filtersView: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8
  },
  activityIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
})
