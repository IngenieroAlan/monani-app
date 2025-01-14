import { formatNumberWithSpaces } from '@/utils/helpers'
import { StyleSheet, View } from 'react-native'
import { Card, Text } from 'react-native-paper'

type TotalLitersCardProps = {
  liters: number
  years: number
}

export const TotalLitersCard = ({ liters, years }: TotalLitersCardProps) => {
  return (
    <Card mode='outlined'>
      <Card.Content style={{ padding: 16 }}>
        <Text variant='labelMedium'>Litros totales producidos</Text>
        <Text variant='displayMedium'>{formatNumberWithSpaces(liters.toFixed(3))}</Text>
        <View style={styles.footer}>
          <Text variant='titleSmall'>Litros anuales promedio</Text>
          <Text variant='bodyMedium'>{formatNumberWithSpaces((liters / years).toFixed(3))}</Text>
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
