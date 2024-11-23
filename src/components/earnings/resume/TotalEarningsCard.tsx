import useAnnualEarnings from '@/hooks/collections/useAnnualEarnings'
import { formatNumberWithSpaces } from '@/utils/helpers'
import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Card, Divider, Text } from 'react-native-paper'

const TotalEarningsCard = () => {
  const { annualEarningsRecords } = useAnnualEarnings()

  const total = useMemo(() => {
    return annualEarningsRecords.reduce((acc, item) => acc + item.totalEarnings, 0)
  }, [annualEarningsRecords])

  const totalCattle = useMemo(() => {
    return annualEarningsRecords.reduce((acc, item) => acc + item.totalCattleSales, 0)
  }, [annualEarningsRecords])

  const totalMilk = useMemo(() => {
    return annualEarningsRecords.reduce((acc, item) => acc + item.totalMilkSales, 0)
  }, [annualEarningsRecords])

  const avgAnnualEarnings = useMemo(() => {
    return total / annualEarningsRecords.length
  }, [annualEarningsRecords])

  return (
    <Card mode='outlined'>
      <Card.Content style={{ gap: 12 }}>
        <View>
          <Text variant='labelMedium'>Ganancias totales</Text>
          <Text variant='displayMedium'>{`$${formatNumberWithSpaces(total.toFixed(2))}`}</Text>
        </View>
        <View style={styles.salesContainer}>
          <Text variant='titleSmall'>Venta de ganado</Text>
          <Text variant='bodyMedium'>{`$${formatNumberWithSpaces(totalCattle.toFixed(2))}`}</Text>
        </View>
        <View style={styles.salesContainer}>
          <Text variant='titleSmall'>Venta de leche</Text>
          <Text variant='bodyMedium'>{`$${formatNumberWithSpaces(totalMilk.toFixed(2))}`}</Text>
        </View>
        <Divider horizontalInset />
        <View style={styles.salesContainer}>
          <Text variant='titleSmall'>Ganancias anuales promedio</Text>
          <Text variant='bodyMedium'>{`$${formatNumberWithSpaces(avgAnnualEarnings.toFixed(2))}`}</Text>
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

export default TotalEarningsCard
