import EarningsList from '@/components/earnings/EarningsList/EarningsList'
import EarningsListFilters from '@/components/earnings/EarningsListFilters/EarningsListFilters'
import useEarnings from '@/hooks/collections/useEarnings'
import { useAppSelector } from '@/hooks/useRedux'
import { RootState } from '@/redux/store/store'
import { useState } from 'react'
import { View } from 'react-native'
import { useTheme } from 'react-native-paper'

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
  const theme = useTheme()

  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <EarningsListFilters listId={OVERVIEW_EARNINGS_LIST_ID} />
      <List />
    </View>
  )
}

export default EarningsTransactionsView
