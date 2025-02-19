import NumericDifference from '@/components/NumericDifference'
import { DailyMilkProductionsCol, TableName } from '@/database/constants'
import DailyMilkProduction from '@/database/models/DailyMilkProduction'
import { milkProductionsKeys } from '@/queries/milkProduction/queryKeyFactory'
import useAppTheme from '@/theme'
import { formatNumberWithSpaces } from '@/utils/helpers'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from 'moti/skeleton'
import { useColorScheme, View } from 'react-native'
import { Card, Text } from 'react-native-paper'

type Props = {
  totalLiters: number
  productionTimestamp: number
}

export const DailyInfoCard = ({ totalLiters, productionTimestamp }: Props) => {
  const db = useDatabase()
  const theme = useAppTheme()
  const scheme = useColorScheme()

  const { data, isLoading } = useQuery({
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
    <Card mode='outlined'>
      <Card.Content style={{ gap: 12 }}>
        <View style={{ gap: 4 }}>
          <View>
            <Text
              variant='labelMedium'
              style={{ color: theme.colors.onSurfaceVariant, opacity: 0.7 }}
            >
              Total de litros producidos
            </Text>
            <Text variant='displayMedium'>{formatNumberWithSpaces(totalLiters.toFixed(3))} L.</Text>
          </View>
          <Skeleton
            show={isLoading}
            width='100%'
            radius={4}
            colorMode={scheme === 'dark' ? 'dark' : 'light'}
          >
            {data && data.length > 0 ? (
              <NumericDifference
                variant='labelMedium'
                difference={totalLiters - data[0].liters}
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
        </View>
      </Card.Content>
    </Card>
  )
}
