import Cattle from '@/database/models/Cattle'
import useOffsprings from '@/hooks/collections/useOffsprings'
import { FlashList } from '@shopify/flash-list'
import React, { useMemo, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, List, Text } from 'react-native-paper'
import CattleDetailsBottomSheet from './CattleDetailsBottomSheet'
import BottomSheet from '@gorhom/bottom-sheet'

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

const CattleItem = ({ cattle, onSelectedCattle }: { cattle: Cattle, onSelectedCattle: (cattle: Cattle) => void }) => {
  return (<>
    <List.Item
      title={<ListItemTitle cattle={cattle} />}
      description={<Text variant='bodyMedium'>{cattle.cattleStatus}</Text>}
      right={() => <ListItemRight cattleWeight={cattle.weight} />}
      onPress={() => onSelectedCattle(cattle)}
    />
  </>)
}

const GenealogyList = ({ cattle }: { cattle: Cattle }) => {
  const [index, setIndex] = useState(0)
  const { offsprings } = useOffsprings(cattle)
  const [cattleBottomSheet, setCattleBottomSheet] = useState(-1)
  const [selectedCattle, setSelectedCattle] = useState<Cattle | null>(null)


  const onSelectedCattle = (cattle: Cattle) => {
    setSelectedCattle(cattle)
    setCattleBottomSheet(0)
  }

  return (<>
    <Text
      variant='titleMedium'
      style={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 4
      }}
    >
      Descendencia
    </Text>
    <FlashList
      estimatedItemSize={88}
      data={offsprings}
      renderItem={({ item }) => <CattleItem cattle={item} onSelectedCattle={onSelectedCattle} />}
      keyExtractor={(item: Cattle) => item.id}
      ListFooterComponent={() => <View style={{ height: 88 }} />}
      ListEmptyComponent={() => <ListEmptyComponent />}
      onEndReachedThreshold={2}
      onEndReached={() => setIndex(index + 1)}
    />
    {selectedCattle && (
      <CattleDetailsBottomSheet
        cattleBottomSheet={cattleBottomSheet}
        setCattleBottomSheet={setCattleBottomSheet}
        cattle={selectedCattle!}
      />
    )}
  </>)
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

export default GenealogyList
