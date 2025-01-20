import MilkProduction from '@/database/models/MilkProduction'
import { formatNumberWithSpaces } from '@/utils/helpers'
import { withObservables } from '@nozbe/watermelondb/react'
import { merge, of } from '@nozbe/watermelondb/utils/rx'
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

const withObserver = withObservables(['productions'], ({ productions }: { productions: MilkProduction[] }) => ({
  _: merge(...productions.map((production) => production.observe())),
  productions: of(productions)
}))

export const MilkProductionsListItem = withObserver(({ productions }: { productions: MilkProduction[] }) => {
  return (
    <List.Item
      title={`${formatNumberWithSpaces(
        productions.reduce((acc, production) => acc + production.liters, 0).toFixed(3)
      )} L.`}
      description={`${productions.length} ${productions.length === 1 ? 'producción' : 'producciones'}`}
      right={() => <Right date={format(productions[0].producedAt, 'dd/MM/yyyy')} />}
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
