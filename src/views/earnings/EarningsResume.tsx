import AnnualEarningsList from '@/components/earnings/resume/AnnualEarningsList'
import TotalEarningsCard from '@/components/earnings/resume/TotalEarningsCard'
import React from 'react'
import { View } from 'react-native'
import { Divider, useTheme } from 'react-native-paper'

const EarningsResumeView = () => {
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

export default EarningsResumeView
