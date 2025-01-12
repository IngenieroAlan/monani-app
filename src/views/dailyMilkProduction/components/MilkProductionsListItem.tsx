import { formatNumberWithSpaces } from '@/utils/helpers'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, List, Text } from 'react-native-paper'
import { MilkProductionListItem } from '../hooks/useMilkProductions'

const Right = memo(({ date }: { date: string }) => {
  return (
    <View style={styles.rightContainer}>
      <Text variant='labelSmall'>{date}</Text>
      <Icon
        size={24}
        source='chevron-right'
      />
    </View>
  )
})

export const MilkProductionsListItem = ({ milkProduction }: { milkProduction: MilkProductionListItem }) => {
  return (
    <List.Item
      title={`${formatNumberWithSpaces(milkProduction.liters.toFixed(3))} L.`}
      description={`${milkProduction.totalProductions} ${
        milkProduction.totalProductions === 1 ? 'producción' : 'producciones'
      }`}
      right={() => <Right date={milkProduction.productionDate} />}
      onPress={() => {}}
    />
  )
}

const styles = StyleSheet.create({
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  }
})
