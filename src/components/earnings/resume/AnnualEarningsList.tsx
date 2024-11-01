import AnnualEarnings from '@/database/models/AnnualEarnings'
import useAnnualEarnings from '@/hooks/collections/useAnnualEarnings'
import useNumberFormat from '@/hooks/useNumberFormat'
import { FlashList } from '@shopify/flash-list'
import { useCallback } from 'react'
import { View } from 'react-native'
import { Icon, List, Text } from 'react-native-paper'

const ListItem = ({ item }: { item: AnnualEarnings }) => {
  return (
    <List.Item
      title={item.year}
      description=' '
      right={() => (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Text variant='labelSmall'>{`$${useNumberFormat(item.totalEarnings.toFixed(2))}`}</Text>
          <Icon
            size={24}
            source='menu-right'
          />
        </View>
      )}
      onPress={() => {}}
    />
  )
}

const AnnualEarningsList = () => {
  const { annualEarningsRecords } = useAnnualEarnings()

  const renderItem = useCallback(({ item }: { item: AnnualEarnings }) => {
    return <ListItem item={item} />
  }, [])

  return (
    <FlashList
      data={annualEarningsRecords}
      renderItem={renderItem}
      estimatedItemSize={63}
      ListHeaderComponent={() => (
        <Text
          variant='titleMedium'
          style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 }}
        >
          Reportes anuales
        </Text>
      )}
    />
  )
}

export default AnnualEarningsList
