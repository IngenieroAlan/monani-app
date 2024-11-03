import EarningsList from '@/components/earnings/EarningsList/EarningsList'
import EarningsListFilters from '@/components/earnings/overview/EarningsListFilters'
import SalesFilterBottomSheet from '@/components/earnings/overview/SalesFilterBottomSheet'
import useEarnings from '@/hooks/collections/useEarnings'
import { useAppSelector } from '@/hooks/useRedux'
import { RootState } from '@/redux/store/store'
import React, { useState } from 'react'
import { View } from 'react-native'
import { useTheme } from 'react-native-paper'

const ITEMS_PER_PAGINATE = 25

const List = () => {
  const [index, setIndex] = useState(0)
  const { earningsRecords } = useEarnings({
    take: ITEMS_PER_PAGINATE + ITEMS_PER_PAGINATE * index,
    salesType: useAppSelector((state: RootState) => state.earningsQuery.eqSalesType),
    betweenDates: useAppSelector((state: RootState) => state.earningsQuery.betweenDates)
  })

  return (
    <EarningsList
      data={earningsRecords}
      onEndReached={() => setIndex(index + 1)}
    />
  )
}

const EarningsView = () => {
  const theme = useTheme()

  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <EarningsListFilters />
      <List />

      <SalesFilterBottomSheet />
    </View>
  )
}

export default EarningsView
