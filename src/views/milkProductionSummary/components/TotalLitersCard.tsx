import { formatNumberWithSpaces } from '@/utils/helpers'
import { StyleSheet, View } from 'react-native'
import { Card, Text } from 'react-native-paper'
import { useMilkProductionSummary } from '../hooks/useMilkProductionSummary'

export const TotalLitersCard = () => {
  const { totalLiters, avgProduction } = useMilkProductionSummary()

  return (
    <Card mode='outlined'>
      <Card.Content style={{ padding: 16 }}>
        <Text variant='labelMedium'>Litros totales producidos</Text>
        <Text variant='displayMedium'>{formatNumberWithSpaces(totalLiters.toFixed(3))}</Text>
        <View style={styles.footer}>
          <Text variant='titleSmall'>Litros anuales promedio</Text>
          <Text variant='bodyMedium'>{formatNumberWithSpaces(avgProduction.toFixed(3))}</Text>
        </View>
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12
  }
})
