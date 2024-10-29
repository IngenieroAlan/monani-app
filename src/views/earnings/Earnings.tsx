import EarningsList from '@/components/earnings/EarningsList'
import React from 'react'
import { View } from 'react-native'
import { useTheme } from 'react-native-paper'

const EarningsView = () => {
  const theme = useTheme()

  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>      
      <EarningsList />
    </View>
  )
}

export default EarningsView
