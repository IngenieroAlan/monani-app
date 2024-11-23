import MilkSale from '@/database/models/MilkSale'
import { formatNumberWithSpaces } from '@/utils/helpers'
import { useCallback } from 'react'
import { View } from 'react-native'
import { Icon, List, Text } from 'react-native-paper'

const MilkListItem = ({ record }: { record: MilkSale }) => {
  const title = useCallback(() => {
    return (
      <View>
        <Text variant='labelMedium'>{record.details}</Text>
        <Text variant='bodyLarge'>Venta de leche</Text>
      </View>
    )
  }, [record])

  const right = useCallback(() => {
    return (
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Text variant='labelSmall'>{`$${formatNumberWithSpaces(record.soldBy.toFixed(2))}`}</Text>
        <Icon
          size={24}
          source='menu-right'
        />
      </View>
    )
  }, [record])

  return (
    <List.Item
      title={title}
      description={`${formatNumberWithSpaces(record.liters.toFixed(3))} L.`}
      left={() => (
        <Icon
          size={24}
          source='beer-outline'
        />
      )}
      right={right}
      onPress={() => {}}
      style={{ paddingStart: 16 }}
    />
  )
}

export default MilkListItem
