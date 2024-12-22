import React from 'react'
import { View } from 'react-native'
import { Divider, useTheme } from 'react-native-paper'
import AnnualEarningsList from './components/AnnualEarningsList'
import TotalEarningsCard from './components/TotalEarningsCard'

const EarningsSummaryView = () => {
  const theme = useTheme()

  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <View style={{ padding: 16 }}>
        <TotalEarningsCard />
      </View>
      <Divider />
      <View style={{ flex: 1 }}>
        <AnnualEarningsList />
      </View>
    </View>
  )
}

export default EarningsSummaryView
