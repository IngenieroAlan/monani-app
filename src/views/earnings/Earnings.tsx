import EarningsList from '@/components/earnings/EarningsList'
import EarningsListFilters from '@/components/earnings/EarningsListFilters'
import SalesFilterBottomSheet from '@/components/earnings/SalesFilterBottomSheet'
import React from 'react'
import { View } from 'react-native'
import { useTheme } from 'react-native-paper'

const EarningsView = () => {
  const theme = useTheme()

  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>      
      <EarningsListFilters />
      <EarningsList />

      <SalesFilterBottomSheet />
    </View>
  )
}

export default EarningsView
