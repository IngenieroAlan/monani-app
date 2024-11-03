import CattleSale from '@/database/models/CattleSale'
import useNumberFormat from '@/hooks/useNumberFormat'
import { useCallback } from 'react'
import { View } from 'react-native'
import { Icon, List, Text } from 'react-native-paper'

const CattleListItem = ({ record }: { record: CattleSale }) => {
  const title = useCallback(() => {
    return (
      <View>
        <Text variant='labelMedium'>{record.details}</Text>
        <Text variant='bodyLarge'>Venta de ganado</Text>
      </View>
    )
  }, [record])

  const right = useCallback(() => {
    return (
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Text variant='labelSmall'>{`$${useNumberFormat(record.soldBy.toFixed(2))}`}</Text>
        <Icon size={24} source='menu-right' />
      </View>
    )
  }, [record])

  return (
    <List.Item
      title={title}
      description={`${useNumberFormat(record.kg.toFixed(3))} kg.`}
      left={() => <Icon size={24} source='cow' />}
      right={right}
      onPress={() => {}}
      style={{ paddingStart: 16 }}
    />
  )
}

export default CattleListItem
