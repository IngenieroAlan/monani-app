import CattleSale from '@/database/models/CattleSale'
import useAppTheme from '@/theme'
import { formatNumberWithSpaces } from '@/utils/helpers'
import { withObservables } from '@nozbe/watermelondb/react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { memo, useMemo } from 'react'
import { View } from 'react-native'
import { Avatar, Card, Divider, Text } from 'react-native-paper'

const withSaleObserver = withObservables(['sale'], ({ sale }: { sale: CattleSale }) => ({
  sale
}))

const SaleCard = withSaleObserver(({ sale }: { sale: CattleSale }) => {
  const theme = useAppTheme()

  const saleDate = useMemo(() => {
    return format(sale.soldAt, 'PPPP', { locale: es })
  }, [sale.soldAt])

  return (
    <Card mode='outlined'>
      <Card.Content>
        <View style={{ alignItems: 'center', gap: 12 }}>
          <Avatar.Icon
            size={52}
            icon='tag-outline'
            color={theme.colors.inverseOnSurface}
          />
          <Text variant='titleLarge'>Ganado vendido</Text>
        </View>
        <Divider
          horizontalInset
          style={{ marginVertical: 16 }}
        />
        <View style={{ gap: 12 }}>
          <View>
            <Text variant='labelMedium'>Vendido por</Text>
            <Text variant='bodyLarge'>${formatNumberWithSpaces(sale.soldBy.toFixed(2))}</Text>
          </View>
          <View>
            <Text variant='labelMedium'>Fecha</Text>
            <Text variant='bodyLarge'>{saleDate.charAt(0).toUpperCase() + saleDate.slice(1)}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  )
})

export default memo(SaleCard)
