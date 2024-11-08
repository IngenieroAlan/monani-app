import Cattle from '@/database/models/Cattle'
import useCattle from '@/hooks/collections/useCattle'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { setCattleInfo } from '@/redux/slices/cattles'
import { RootState } from '@/redux/store/store'
import { withObservables } from '@nozbe/watermelondb/react'
import { useNavigation } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { memo, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native'
import { Icon, List, Text } from 'react-native-paper'

const ITEMS_PER_PAGINATE = 25

const observeCattle = withObservables(['cattle'], ({ cattle }: { cattle: Cattle }) => ({
  cattle
}))

const ListEmptyComponent = () => {
  return (
    <View style={styles.emtpyListContainer}>
      <Icon
        size={56}
        source='cow-off'
      ></Icon>
      <Text
        style={{ textAlign: 'center' }}
        variant='titleMedium'
      >
        No se han encontrado coincidencias.
      </Text>
    </View>
  )
}

const ListItemRight = ({ cattleWeight }: { cattleWeight: number }) => {
  const decimals = cattleWeight.toString().split('.')[1]
  const formattedWeight = `${Math.trunc(cattleWeight)}.${decimals ? decimals.padEnd(3, '0') : '000'}`

  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Text variant='labelSmall'>{`${formattedWeight} kg.`}</Text>
      <Icon
        size={24}
        source='menu-right'
      />
    </View>
  )
}

const ListItemTitle = ({ cattle }: { cattle: Cattle }) => {
  const title = cattle.name ? `No. ${cattle.tagId}: ${cattle.name}` : `No. ${cattle.tagId}`

  return (
    <View>
      <Text variant='labelMedium'>{`Producción ${cattle.productionType.toLocaleLowerCase()}`}</Text>
      <Text variant='bodyLarge'>{title}</Text>
    </View>
  )
}

const CattleItem = observeCattle(({ cattle }: { cattle: Cattle }) => {
  const navigator = useNavigation()
  const dispatch = useAppDispatch()

  return (
    <List.Item
      title={<ListItemTitle cattle={cattle} />}
      description={<Text variant='bodyMedium'>{cattle.cattleStatus}</Text>}
      right={() => <ListItemRight cattleWeight={cattle.weight} />}
      onPress={() => {
        dispatch(setCattleInfo(cattle))
        navigator.navigate('CattleDetailsLayout', {
          screen: 'InfoRoute'
        })
      }}
    />
  )
})

const CattleList = ({ onScroll }: { onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void }) => {
  const [index, setIndex] = useState(0)
  const { oneOfCattleStatus, eqProductionType } = useAppSelector((state: RootState) => state.cattleQuery)
  const { cattleRecords } = useCattle({
    cattleStatus: oneOfCattleStatus,
    productionType: eqProductionType,
    isActive: true,
    take: ITEMS_PER_PAGINATE + ITEMS_PER_PAGINATE * index
  })

  return (
    <FlashList
      onScroll={onScroll}
      estimatedItemSize={88}
      data={cattleRecords}
      renderItem={({ item }) => <CattleItem cattle={item} />}
      keyExtractor={(item: Cattle) => item.id}
      ListFooterComponent={() => <View style={{ height: 88 }} />}
      ListEmptyComponent={() => <ListEmptyComponent />}
      onEndReachedThreshold={2}
      onEndReached={() => setIndex(index + 1)}
    />
  )
}

const styles = StyleSheet.create({
  emtpyListContainer: {
    height: '100%',
    marginVertical: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 16
  }
})

export default memo(CattleList)
