import { CattleStatus, ProductionType } from '@/database/models/Cattle'
import { memo } from 'react'
import { View } from 'react-native'
import { Card, Divider, Text } from 'react-native-paper'

type ProductionStatusCardProps = {
  productionType: ProductionType
  cattleStatus: CattleStatus
}

const ProductionStatusCard = (props: ProductionStatusCardProps) => {
  return (
    <Card mode='outlined'>
      <Card.Content>
        <Text variant='titleLarge'>Estado productivo</Text>
        <Divider
          horizontalInset
          style={{ marginVertical: 16 }}
        />
        <View style={{ gap: 12 }}>
          <View>
            <Text variant='labelMedium'>Producción</Text>
            <Text variant='bodyLarge'>{props.productionType}</Text>
          </View>
          <View>
            <Text variant='labelMedium'>Estado</Text>
            <Text variant='bodyLarge'>{props.cattleStatus}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  )
}

export default memo(ProductionStatusCard)
