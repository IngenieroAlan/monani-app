import DailyMilkProduction from '@/database/models/DailyMilkProduction'
import useAppTheme from '@/theme'
import { formatNumberWithSpaces } from '@/utils/helpers'
import { withObservables } from '@nozbe/watermelondb/react'
import { useNavigation } from '@react-navigation/native'
import dayjs from 'dayjs'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, List, Text } from 'react-native-paper'

const DateDisplay = memo(({ date }: { date: Date }) => {
  return (
    <View style={styles.dateContainer}>
      <Text variant='labelLarge'>{dayjs(date).format('DD')}</Text>
      <Text
        variant='labelSmall'
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {dayjs(date).format(`MMM.${dayjs().isSame(date, 'year') ? '' : ' YY'}`)}
      </Text>
    </View>
  )
})

const withObserver = withObservables(
  ['milkProduction'],
  ({ milkProduction }: { milkProduction: DailyMilkProduction }) => ({ milkProduction })
)

export const MilkProductionsListItem = memo(
  withObserver(({ milkProduction }: { milkProduction: DailyMilkProduction }) => {
    const theme = useAppTheme()
    const navigation = useNavigation()

    return (
      <View style={styles.container}>
        <DateDisplay date={milkProduction.producedAt} />
        <List.Item
          style={[{ borderColor: theme.colors.outlineVariant, flex: 1 }, styles.listItem]}
          title={<Text variant='titleMedium'>{formatNumberWithSpaces(milkProduction.liters.toFixed(3))} L.</Text>}
          borderless
          description={() => (
            <Text
              variant='labelSmall'
              style={{ color: theme.colors.onSurfaceVariant, opacity: 0.7 }}
            >
              {milkProduction.totalProductions} {milkProduction.totalProductions === 1 ? 'producción' : 'producciones'}
            </Text>
          )}
          right={({ style }) => (
            <View style={style}>
              <Icon
                size={24}
                source='chevron-right'
              />
            </View>
          )}
          onPress={() => navigation.navigate('DailyProductionDetailsView')}
        />
      </View>
    )
  })
)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 12
  },
  listItem: {
    borderWidth: 0.5,
    borderRadius: 12,
    paddingRight: 16
  },
  dateContainer: {
    alignItems: 'center',
    paddingTop: 4,
    width: 52
  }
})
