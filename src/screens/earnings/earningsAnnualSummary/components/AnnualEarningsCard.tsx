import NumericDifference from '@/components/NumericDifference'
import useAppTheme from '@/theme'
import { formatNumberWithSpaces } from '@/utils/helpers'
import { StyleSheet, View } from 'react-native'
import { Card, Divider, Text } from 'react-native-paper'

type AnnualEarningsCardProps = {
  totalEarnings: number
  totalCattleEarnings: number
  totalMilkEarnings: number
  difference: number
}

const AnnualEarningsCard = ({
  totalEarnings,
  totalCattleEarnings,
  totalMilkEarnings,
  difference
}: AnnualEarningsCardProps) => {
  const theme = useAppTheme()

  return (
    <Card mode='outlined'>
      <Card.Content style={{ gap: 12 }}>
        <View>
          <Text variant='labelMedium'>Ganancias totales</Text>
          <Text variant='displayMedium'>{`$${formatNumberWithSpaces(totalEarnings.toFixed(2))}`}</Text>
          {difference !== 0 && (
            <Text
              style={{ color: difference < 0 ? theme.colors.error : theme.colors.success }}
              variant='labelSmall'
            >
              <NumericDifference
                difference={difference}
                prefix='$'
                fractionDigits={2}
              />{' '}
              comparado al año pasado.
            </Text>
          )}
        </View>
        <View style={styles.salesContainer}>
          <Text variant='titleSmall'>Venta de ganado</Text>
          <Text variant='bodyMedium'>{`$${formatNumberWithSpaces(totalCattleEarnings.toFixed(2))}`}</Text>
        </View>
        <View style={styles.salesContainer}>
          <Text variant='titleSmall'>Venta de leche</Text>
          <Text variant='bodyMedium'>{`$${formatNumberWithSpaces(totalMilkEarnings.toFixed(2))}`}</Text>
        </View>
        <Divider horizontalInset />
        <View style={styles.salesContainer}>
          <Text variant='titleSmall'>Ganancias mensuales promedio</Text>
          <Text variant='bodyMedium'>{`$${formatNumberWithSpaces((totalEarnings / 12).toFixed(2))}`}</Text>
        </View>
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  salesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

export default AnnualEarningsCard
