import EarningsList from '@/components/earnings/EarningsList/EarningsList'
import EarningsListFilters from '@/components/earnings/EarningsListFilters/EarningsListFilters'
import useEarnings from '@/hooks/collections/useEarnings'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { reset } from '@/redux/slices/collections/earningsQuerySlice'
import { RootState } from '@/redux/store/store'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
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
  const dispatch = useAppDispatch()
  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => dispatch(reset()))

    return unsubscribe
  }, [navigation])

  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <EarningsListFilters />
      <List />
    </View>
  )
}

export default EarningsView
