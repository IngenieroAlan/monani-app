import Cattle from '@/database/models/Cattle'
import { withObservables } from '@nozbe/watermelondb/react'
import { FlashList } from '@shopify/flash-list'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, List, Text } from 'react-native-paper'

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
  return (
    <List.Item
      title={<ListItemTitle cattle={cattle} />}
      description={<Text variant='bodyMedium'>{cattle.cattleStatus}</Text>}
      right={() => <ListItemRight cattleWeight={cattle.weight} />}
    />
  )
})

const GenealogyList = ({offspring}:{offspring: Cattle[] | undefined}) => {
  const [index, setIndex] = useState(0)

  return (
    <FlashList
      estimatedItemSize={88}
      data={offspring}
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

export default GenealogyList
