import NumericDifference from '@/components/NumericDifference'
import MonthlyMilkProduction from '@/database/models/MonthlyMilkProduction'
import { formatNumberWithSpaces } from '@/utils/helpers'
import { withObservables } from '@nozbe/watermelondb/react'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, List, Text } from 'react-native-paper'
import { EMPTY, from, mergeMap, of } from 'rxjs'
import { MonthlyProductionListItem } from './MonthlyProductionListItem'

type Props = {
  monthlyProductions: [string, (MonthlyMilkProduction | null)[]]
  nextMonthlyProductions: [string, (MonthlyMilkProduction | null)[]] | undefined
}

const withObserver = withObservables(
  ['monthlyProductions', 'nextMonthlyProductions'],
  ({ monthlyProductions, nextMonthlyProductions }: Props) => ({
    _1: from(monthlyProductions[1]).pipe(mergeMap((record) => record?.observe() ?? EMPTY)),
    _2: nextMonthlyProductions
      ? from(nextMonthlyProductions?.[1] ?? null).pipe(mergeMap((record) => record?.observe() ?? EMPTY))
      : of(null)
  })
)

export const AnnualProductionSection = memo(
  withObserver(({ monthlyProductions, nextMonthlyProductions }: Props) => {
    const totalLiters = monthlyProductions[1].reduce((acc, record) => acc + (record?.liters ?? 0), 0)
    const nextTotalLiters = nextMonthlyProductions?.[1].reduce((acc, record) => acc + (record?.liters ?? 0), 0) ?? 0

    return (
      <List.Accordion
        title={monthlyProductions[0]}
        right={({ isExpanded }) => (
          <View style={styles.rightContainer}>
            <View style={styles.litersContainer}>
              <Text variant='labelSmall'>{formatNumberWithSpaces(totalLiters.toFixed(3))} L.</Text>
              {nextMonthlyProductions && (
                <NumericDifference
                  difference={totalLiters - nextTotalLiters}
                  suffix=' L.'
                  fractionDigits={3}
                />
              )}
            </View>
            <Icon
              size={24}
              source={isExpanded ? 'chevron-up' : 'chevron-down'}
            />
          </View>
        )}
      >
        {monthlyProductions[1].map((record, index) => (
          <MonthlyProductionListItem
            key={index}
            milkProduction={record}
            index={index}
          />
        ))}
      </List.Accordion>
    )
  })
)

const styles = StyleSheet.create({
  rightContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center'
  },
  litersContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end'
  }
})
