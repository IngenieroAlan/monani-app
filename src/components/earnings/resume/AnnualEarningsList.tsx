import AnnualEarnings from '@/database/models/AnnualEarnings'
import useAnnualEarnings from '@/hooks/collections/useAnnualEarnings'
import useNumberFormat from '@/hooks/useNumberFormat'
import { useNavigation } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useCallback } from 'react'
import { View } from 'react-native'
import { Icon, List, Text } from 'react-native-paper'
import EarningsDifference from '../EarningsDifference'

const ListItem = ({ item, prevEarnings }: { item: AnnualEarnings; prevEarnings?: number }) => {
  const navigation = useNavigation()

  return (
    <List.Item
      title={item.year}
      description=' '
      right={() => (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ alignItems: 'flex-end' }}>
            <Text variant='labelSmall'>{`$${useNumberFormat(item.totalEarnings.toFixed(2))}`}</Text>
            {prevEarnings && <EarningsDifference difference={item.totalEarnings - prevEarnings} />}
          </View>
          <Icon
            size={24}
            source='menu-right'
          />
        </View>
      )}
      onPress={() =>
        navigation.navigate('AnnualEarningsView', {
          year: item.year,
          totalEarnings: item.totalEarnings,
          totalCattleEarnings: item.totalCattleSales,
          totalMilkEarnings: item.totalMilkSales,
          difference: prevEarnings ? item.totalEarnings - prevEarnings : 0
        })
      }
    />
  )
}

const AnnualEarningsList = () => {
  const { annualEarningsRecords } = useAnnualEarnings()

  const renderItem = useCallback(
    ({ index, item }: { item: AnnualEarnings; index: number }) => {
      const prevEarnings =
        index + 1 <= annualEarningsRecords.length - 1 ? annualEarningsRecords[index + 1].totalEarnings : undefined

      return (
        <ListItem
          item={item}
          prevEarnings={prevEarnings}
        />
      )
    },
    [annualEarningsRecords]
  )

  const keyExtractor = useCallback((item: any, index: number) => {
    return index.toString()
  }, [])

  return (
    <FlashList
      estimatedItemSize={69}
      data={annualEarningsRecords}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
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
