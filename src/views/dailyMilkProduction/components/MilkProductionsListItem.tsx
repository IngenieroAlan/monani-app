import DailyMilkProduction from '@/database/models/DailyMilkProduction'
import { formatNumberWithSpaces } from '@/utils/helpers'
import { withObservables } from '@nozbe/watermelondb/react'
import { format } from 'date-fns'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, List, Text } from 'react-native-paper'

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

const withObserver = withObservables(
  ['milkProduction'],
  ({ milkProduction }: { milkProduction: DailyMilkProduction }) => ({
    milkProduction
  })
)

export const MilkProductionsListItem = withObserver(({ milkProduction }: { milkProduction: DailyMilkProduction }) => {
  return (
    <List.Item
      title={`${formatNumberWithSpaces(milkProduction.liters.toFixed(3))} L.`}
      description={`${milkProduction.totalProductions} ${
        milkProduction.totalProductions === 1 ? 'producción' : 'producciones'
      }`}
      right={() => <Right date={format(milkProduction.producedAt, 'dd/MM/yyyy')} />}
      onPress={() => {}}
    />
  )
})

const styles = StyleSheet.create({
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  }
})
