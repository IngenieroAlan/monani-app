import useNumberFormat from '@/hooks/useNumberFormat'
import useAppTheme from '@/theme'
import { StyleSheet, View } from 'react-native'
import { Card, Divider, Text } from 'react-native-paper'
import EarningsDifference from '../EarningsDifference'

type Props = {
  totalEarnings: number
  totalCattleEarnings: number
  totalMilkEarnings: number
  difference: number
}

const AnnualEarningsCard = ({ totalEarnings, totalCattleEarnings, totalMilkEarnings, difference }: Props) => {
  const theme = useAppTheme()

  return (
    <Card mode='outlined'>
      <Card.Content style={{ gap: 12 }}>
        <View>
          <Text variant='labelMedium'>Ganancias totales</Text>
          <Text variant='displayMedium'>{`$${useNumberFormat(totalEarnings.toFixed(2))}`}</Text>
          {difference !== 0 && (
            <Text
              style={{ color: difference < 0 ? theme.colors.error : theme.colors.success }}
              variant='labelSmall'
            >
              <EarningsDifference difference={difference} /> comparado al año pasado.
            </Text>
          )}
        </View>
        <View style={styles.salesContainer}>
          <Text variant='titleSmall'>Venta de ganado</Text>
          <Text variant='bodyMedium'>{`$${useNumberFormat(totalCattleEarnings.toFixed(2))}`}</Text>
        </View>
        <View style={styles.salesContainer}>
          <Text variant='titleSmall'>Venta de leche</Text>
          <Text variant='bodyMedium'>{`$${useNumberFormat(totalMilkEarnings.toFixed(2))}`}</Text>
        </View>
        <Divider horizontalInset />
        <View style={styles.salesContainer}>
          <Text variant='titleSmall'>Ganancias mensuales promedio</Text>
          <Text variant='bodyMedium'>{`$${useNumberFormat((totalEarnings / 12).toFixed(2))}`}</Text>
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
