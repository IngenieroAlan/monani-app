import { SurfaceContainer } from '@/components/SurfaceContainer'
import React from 'react'
import { View } from 'react-native'
import { Divider } from 'react-native-paper'
import AnnualEarningsList from './components/AnnualEarningsList'
import TotalEarningsCard from './components/TotalEarningsCard'

const EarningsSummaryView = () => {
  return (
    <SurfaceContainer>
      <View style={{ padding: 16 }}>
        <TotalEarningsCard />
      </View>
      <Divider />
      <View style={{ flex: 1 }}>
        <AnnualEarningsList />
      </View>
    </SurfaceContainer>
  )
}

export default EarningsSummaryView
