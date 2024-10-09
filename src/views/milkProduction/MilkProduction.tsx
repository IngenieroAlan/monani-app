import React from 'react'
import { View } from 'react-native'
import mainStyles from '../../styles/main'
import { Text } from 'react-native-paper'
import { MilkProductionItem } from '../../components/MilkProductionItem'

export const MilkProductionView = () => {
  return (
    <View style={mainStyles.container}>
      <MilkProductionItem milkAverage={9} totalMilk={100} updateMilk={-30} date='21/09/24' />
      <MilkProductionItem milkAverage={11.7} totalMilk={130} updateMilk={20} date='20/09/24' />
      <MilkProductionItem milkAverage={9.5} totalMilk={110} updateMilk={10} date='19/09/24' />
      <MilkProductionItem milkAverage={9} totalMilk={100} updateMilk={-30} date='18/09/24' />
      <MilkProductionItem milkAverage={9} totalMilk={130} date='17/09/24' />
    </View>
  )
}
