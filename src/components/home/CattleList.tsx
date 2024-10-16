import Cattle from '@/database/models/Cattle'
import { TableName } from '@/database/schema'
import { open } from '@/redux/slices/bottomSheetSlice'
import { setEqProductionTypeBind, setOneOfCattleStatusBind } from '@/redux/slices/homeCattleListQuerySlice'
import { clearCattleStatusFilter, setProductionTypeFilter } from '@/redux/slices/homeStatusFilterSlice'
import { RootState } from '@/redux/store/store'
import { Q } from '@nozbe/watermelondb'
import { useDatabase, withObservables } from '@nozbe/watermelondb/react'
import React, { forwardRef, memo, Ref, useEffect, useRef, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { ActivityIndicator, Icon, List, Text } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import FilterChip from '../FilterChip'

const observeCattle = withObservables(['cattle'], ({ cattle }: { cattle: Cattle }) => ({
  cattle
}))

const ListEmptyComponent = ({ isFetching }: { isFetching: boolean }) => {
  return (
    <View style={styles.emtpyListContainer}>
      {isFetching ? (
        <ActivityIndicator
          animating={true}
          size='large'
        />
      ) : (
        <>
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
        </>
      )}
    </View>
  )
}
const ListHeaderComponent = memo(() => {
  const dispatch = useDispatch()
  const statusFilter = useSelector((state: RootState) => state.homeFilters.cattleStatusFilter)
  const productionFilter = useSelector((state: RootState) => state.homeFilters.productionTypeFilter)

  return (
    <View style={styles.chipsContainer}>
      <FilterChip
        filters={productionFilter === null ? [] : [productionFilter]}
        mode='outlined'
        onPress={() => dispatch(open('homeProductionFilter'))}
        onClose={() => {
          dispatch(setProductionTypeFilter(null))
          dispatch(setEqProductionTypeBind(null))
        }}
      >
        Producción
      </FilterChip>
      <FilterChip
        filters={[...statusFilter]}
        mode='outlined'
        onPress={() => dispatch(open('homeStatusFilter'))}
        onClose={() => {
          dispatch(clearCattleStatusFilter())
          dispatch(setOneOfCattleStatusBind([]))
        }}
      >
        Estado
      </FilterChip>
    </View>
  )
})

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
  const oneOfCattleStatusBind = useSelector(
    (state: RootState) => state.homeCattleListQuery.whereBinds.oneOfCattleStatus
  )
  const eqProductionTypeBind = useSelector((state: RootState) => state.homeCattleListQuery.whereBinds.eqProductionType)
  const [cattleList, setCattleList] = useState<Cattle[]>([])
  const isFetching = useRef(false)

  useEffect(() => {
    const fetchCattle = async () => {
      isFetching.current = true

      const queries = [Q.where('is_active', true)]

      if (oneOfCattleStatusBind.length > 0) {
        queries.push(Q.where('cattle_status', Q.oneOf(oneOfCattleStatusBind)))
      }
      if (eqProductionTypeBind !== null) {
        queries.push(Q.where('production_type', eqProductionTypeBind))
      }

      setCattleList(await database.collections.get<Cattle>(TableName.CATTLE).query(queries).fetch())

      isFetching.current = false
    }

    setCattleList([])
    fetchCattle()
  }, [database, oneOfCattleStatusBind, eqProductionTypeBind])

  return (
    <FlatList
      contentContainerStyle={{ flexGrow: 1 }}
      ref={ref}
      onScroll={onScroll}
      data={cattleList}
      renderItem={({ item }) => <CattleItem cattle={item} />}
      keyExtractor={(item: Cattle) => item.id}
      ListHeaderComponent={() => <ListHeaderComponent />}
      ListFooterComponent={() => <View style={{ height: 152 }} />}
      ListEmptyComponent={() => <ListEmptyComponent isFetching={isFetching.current} />}
    />
  )
}

const styles = StyleSheet.create({
  chipsContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8
  },
  emtpyListContainer: {
    marginVertical: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 16
  }
})

export default memo(forwardRef(CattleList))
