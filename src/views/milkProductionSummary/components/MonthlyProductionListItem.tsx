import MonthlyMilkProduction from '@/database/models/MonthlyMilkProduction'
import { formatNumberWithSpaces } from '@/utils/helpers'
import { withObservables } from '@nozbe/watermelondb/react'
import { of } from '@nozbe/watermelondb/utils/rx'
import dayjs from 'dayjs'
import { memo } from 'react'
import { List, Text } from 'react-native-paper'

dayjs.locale('es-mx')

type Props = {
  milkProduction: MonthlyMilkProduction | null
  index: number
}

const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1)

const withObserver = withObservables(
  ['milkProduction'],
  ({ milkProduction }: { milkProduction: MonthlyMilkProduction | null }) => ({
    milkProduction: milkProduction ?? of(null)
  })
)

export const MonthlyProductionListItem = memo(
  withObserver(({ milkProduction, index }: Props) => {
    return (
      <List.Item
        key={index}
        style={{ opacity: milkProduction ? 1 : 0.4, paddingLeft: 16 }}
        title={() => (
          <Text variant='bodyMedium'>
            {capitalizeFirstLetter(dayjs.months()[milkProduction ? milkProduction.month : 11 - index])}
          </Text>
        )}
        right={() => (
          <Text variant='labelSmall'>
            {formatNumberWithSpaces((milkProduction ? milkProduction.liters : 0).toFixed(3))} L.
          </Text>
        )}
      />
    )
  })
)
