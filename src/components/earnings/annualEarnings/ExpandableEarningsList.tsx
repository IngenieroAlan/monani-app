import ExpandableBottomSheet from '@/components/ExpandableBottomSheet'
import useEarnings from '@/hooks/collections/useEarnings'
import { useAppSelector } from '@/hooks/useRedux'
import { RootState } from '@/redux/store/store'
import { BottomSheetView } from '@gorhom/bottom-sheet'
import { useState } from 'react'
import EarningsList from '../EarningsList/EarningsList'
import EarningsListFilters from '../EarningsListFilters/EarningsListFilters'
import { Text } from 'react-native-paper'

const ITEMS_PER_PAGINATE = 25

const List = () => {
  const [index, setIndex] = useState(0)
  const { eqSalesType, betweenDates, year } = useAppSelector((state: RootState) => state.earningsQuery)
  const { earningsRecords } = useEarnings({
    take: ITEMS_PER_PAGINATE + ITEMS_PER_PAGINATE * index,
    salesType: eqSalesType,
    betweenDates,
    year: year
  })

  return (
    <EarningsList
      data={earningsRecords}
      onEndReached={() => setIndex(index + 1)}
    />
  )
}

const ExpandableEarningsList = () => {
  return (
    <ExpandableBottomSheet>
      <BottomSheetView style={{ flex: 1 }}>
        <EarningsListFilters />
        <List />
      </BottomSheetView>
    </ExpandableBottomSheet>
  )
}

export default ExpandableEarningsList
