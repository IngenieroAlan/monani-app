import Cattle from '@/database/models/Cattle'
import { TableName } from '@/database/schema'
import { useDatabase, withObservables } from '@nozbe/watermelondb/react'
import React, { forwardRef, memo, Ref, useEffect, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Chip, Icon, List, Text } from 'react-native-paper'

const observeCattle = withObservables(['cattle'], ({ cattle }: { cattle: Cattle }) => ({
  cattle
}))

const ListHeaderComponent = () => {
  return (
    <View style={styles.chipsContainer}>
      <Chip
        mode='outlined'
        icon='filter-outline'
        onPress={() => {}}
      >
        Filtrar por
      </Chip>
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
  return (
    <List.Item
      title={<ListItemTitle cattle={cattle} />}
      description={<Text variant='bodyMedium'>{cattle.cattleStatus}</Text>}
      right={() => <ListItemRight cattleWeight={cattle.weight} />}
      onPress={() => {}}
    />
  )
})

const CattleList = (
  { onScroll }: { onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void },
  ref: Ref<FlatList>
) => {
  const database = useDatabase()

  const [cattleList, setCattleList] = useState<Cattle[]>([])

  useEffect(() => {
    const fetchCattle = async () => {
      setCattleList(await database.collections.get<Cattle>(TableName.CATTLE).query().fetch())
    }
    fetchCattle()
  }, [database])

  return (
    <FlatList
      ref={ref}
      onScroll={onScroll}
      renderItem={({ item }) => <CattleItem cattle={item} />}
      data={cattleList}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={() => <ListHeaderComponent />}
      ListFooterComponent={() => <View style={{ height: 152 }}></View>}
    />
  )
}

const styles = StyleSheet.create({
  chipsContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row'
  }
})

export default memo(forwardRef(CattleList))
