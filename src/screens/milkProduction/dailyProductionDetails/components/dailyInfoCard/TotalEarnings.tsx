import MilkProduction from '@/database/models/MilkProduction'
import { milkProductionsKeys } from '@/queries/milkProduction/queryKeyFactory'
import { formatNumberWithSpaces } from '@/utils/helpers'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Skeleton } from 'moti/skeleton'
import { useMemo } from 'react'
import { useColorScheme, View } from 'react-native'
import { Text } from 'react-native-paper'

export const TotalEarnings = ({ productionTimestamp }: { productionTimestamp: number }) => {
  const scheme = useColorScheme()
  const queryClient = useQueryClient()

  const salesQuery = useQuery({
    queryKey: milkProductionsKeys.earnings(productionTimestamp),
    queryFn: () => {
      const productions = queryClient.getQueryData<MilkProduction[]>(
        milkProductionsKeys.groupedByDate(productionTimestamp)
      )

      return Promise.all((productions ?? []).map(async (prod) => (await prod.sale)[0]))
    }
  })

  const earnings = useMemo(
    () => salesQuery.data?.reduce((acc, sale) => acc + (sale?.soldBy ?? 0), 0) ?? 0,
    [salesQuery.data]
  )

  return (
    <Skeleton
      show={salesQuery.isLoading}
      width='100%'
      radius={4}
      colorMode={scheme === 'dark' ? 'dark' : 'light'}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text variant='titleSmall'>Ganancias totales</Text>
        <Text variant='bodyMedium'>
          ${salesQuery.data && salesQuery.data.length > 0 && formatNumberWithSpaces(earnings.toFixed(2))}
        </Text>
      </View>
    </Skeleton>
  )
}
