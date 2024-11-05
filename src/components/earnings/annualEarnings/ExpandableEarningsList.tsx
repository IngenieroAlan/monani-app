import ExpandableBottomSheet from '@/components/ExpandableBottomSheet'
import useEarnings from '@/hooks/collections/useEarnings'
import { useAppSelector } from '@/hooks/useRedux'
import { RootState } from '@/redux/store/store'
import { BottomSheetView } from '@gorhom/bottom-sheet'
import { useState } from 'react'
import EarningsList from '../EarningsList/EarningsList'
import EarningsListFilters from '../EarningsListFilters/EarningsListFilters'

export const ANNUAL_EARNINGS_LIST_ID = 'annualEarningsList'

const ITEMS_PER_PAGINATE = 25

const List = () => {
  const [index, setIndex] = useState(0)
  const { earningsRecords } = useEarnings({
    take: ITEMS_PER_PAGINATE + ITEMS_PER_PAGINATE * index,
    eqSalesType: useAppSelector((state: RootState) => state.earningsQuery[ANNUAL_EARNINGS_LIST_ID]?.eqSalesType),
    betweenDates: useAppSelector((state: RootState) => state.earningsQuery[ANNUAL_EARNINGS_LIST_ID]?.betweenDates),
    year: useAppSelector((state: RootState) => state.earningsQuery[ANNUAL_EARNINGS_LIST_ID]?.year)
  })

  return (
    <EarningsList
      listId={ANNUAL_EARNINGS_LIST_ID}
      data={earningsRecords}
      onEndReached={() => setIndex(index + 1)}
    />
  )
}

const ExpandableEarningsList = () => {
  return (
    <ExpandableBottomSheet>
      <BottomSheetView style={{ flex: 1 }}>
        <EarningsListFilters listId={ANNUAL_EARNINGS_LIST_ID} />
        <List />
      </BottomSheetView>
    </ExpandableBottomSheet>
  )
}

export default ExpandableEarningsList
