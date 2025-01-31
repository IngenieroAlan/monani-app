import EarningsList from '@/components/earnings/EarningsList/EarningsList'
import EarningsListFilters from '@/components/earnings/EarningsListFilters/EarningsListFilters'
import { SurfaceContainer } from '@/components/SurfaceContainer'
import useEarnings from '@/hooks/collections/useEarnings'
import { useAppSelector } from '@/hooks/useRedux'
import { RootState } from '@/redux/store/store'
import { useState } from 'react'

export const OVERVIEW_EARNINGS_LIST_ID = 'overviewEarningsList'

const ITEMS_PER_PAGINATE = 25

const List = () => {
  const [index, setIndex] = useState(0)
  const { earningsRecords } = useEarnings({
    take: ITEMS_PER_PAGINATE + ITEMS_PER_PAGINATE * index,
    eqSalesType: useAppSelector((state: RootState) => state.earningsQuery[OVERVIEW_EARNINGS_LIST_ID]?.eqSalesType),
    betweenDates: useAppSelector((state: RootState) => state.earningsQuery[OVERVIEW_EARNINGS_LIST_ID]?.betweenDates)
  })

  return (
    <EarningsList
      listId={OVERVIEW_EARNINGS_LIST_ID}
      data={earningsRecords}
      onEndReached={() => setIndex(index + 1)}
    />
  )
}

const EarningsTransactionsView = () => {
  return (
    <SurfaceContainer>
      <EarningsListFilters listId={OVERVIEW_EARNINGS_LIST_ID} />
      <List />
    </SurfaceContainer>
  )
}

export default EarningsTransactionsView
