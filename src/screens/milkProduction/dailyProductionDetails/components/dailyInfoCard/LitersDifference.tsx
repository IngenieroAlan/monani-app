import NumericDifference from '@/components/NumericDifference'
import { DailyMilkProductionsCol, TableName } from '@/database/constants'
import DailyMilkProduction from '@/database/models/DailyMilkProduction'
import { milkProductionsKeys } from '@/queries/milkProduction/queryKeyFactory'
import useAppTheme from '@/theme'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from 'moti/skeleton'
import { useColorScheme } from 'react-native'
import { Text } from 'react-native-paper'

type Props = {
  totalLiters: number
  productionTimestamp: number
}

export const LitersDifference = ({ productionTimestamp, totalLiters }: Props) => {
  const db = useDatabase()
  const theme = useAppTheme()
  const scheme = useColorScheme()

  const dayBeforeQuery = useQuery({
    queryKey: milkProductionsKeys.dayBefore(productionTimestamp),
    queryFn: () =>
      db
        .get<DailyMilkProduction>(TableName.DAILY_MILK_PRODUCTIONS)
        .query(
          Q.where(DailyMilkProductionsCol.PRODUCED_AT, Q.lt(productionTimestamp)),
          Q.sortBy(DailyMilkProductionsCol.PRODUCED_AT, Q.desc),
          Q.take(1)
        )
        .fetch()
  })

  return (
    <Skeleton
      show={dayBeforeQuery.isLoading}
      width='100%'
      radius={4}
      colorMode={scheme === 'dark' ? 'dark' : 'light'}
    >
      {dayBeforeQuery.data && dayBeforeQuery.data.length > 0 ? (
        <NumericDifference
          variant='labelMedium'
          difference={totalLiters - dayBeforeQuery.data[0].liters}
          fractionDigits={3}
          suffix=' L. comparado a la producción anterior'
        />
      ) : (
        <Text
          variant='labelMedium'
          style={{ color: theme.colors.onSurfaceVariant, opacity: 0.7 }}
        >
          No se ha encontrado una producción anterior
        </Text>
      )}
    </Skeleton>
  )
}
