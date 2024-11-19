import Cattle from '@/database/models/Cattle'
import { TableName } from '@/database/schema'
import { useAppDispatch } from '@/hooks/useRedux'
import { setCattleInfo } from '@/redux/slices/cattles'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { StackActions, useNavigation } from '@react-navigation/native'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { ActivityIndicator, Icon, List, Searchbar, Text, useTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

const ListEmptyComponent = ({ search, isFetching }: { search: string; isFetching: boolean }) => {
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
            source={search === '' ? 'magnify' : 'cow-off'}
          ></Icon>
          <Text
            style={{ textAlign: 'center' }}
            variant='titleMedium'
          >
            {search === ''
              ? 'Escribe un no. identificador para empezar a buscar.'
              : 'No se han encontrado coincidencias.'}
          </Text>
        </>
      )}
    </View>
  )
}

const ListItemLeft = ({ iconName }: { iconName: string }) => {
  return (
    <View style={{ paddingStart: 16 }}>
      <Icon
        source={iconName}
        size={24}
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

const CattleItem = memo(({ cattle }: { cattle: Cattle }) => {
  const navigation = useNavigation()
  const dispatch = useAppDispatch()

  const status = useMemo(() => {
    if (cattle.isActive) {
      return 'Activo'
    } else if (cattle.isArchived) {
      return 'Archivado'
    } else {
      return 'Vendido'
    }
  }, [cattle])

  const icon = useMemo(() => {
    switch (status) {
      case 'Activo':
        return 'check'
      case 'Archivado':
        return 'archive-outline'
      case 'Vendido':
        return 'tag-outline'
    }
  }, [status])

  return (
    <List.Item
      title={<ListItemTitle cattle={cattle} />}
      description={status}
      left={() => <ListItemLeft iconName={icon} />}
      onPress={() => {
        dispatch(setCattleInfo(cattle))
        navigation.dispatch(
          StackActions.replace('CattleDetailsLayout', {
            screen: 'InfoRoute'
          })
        )
      }}
    />
  )
})

const SearchCattle = () => {
  const navigation = useNavigation()
  const theme = useTheme()
  const database = useDatabase()
  const [search, setSearch] = useState('')
  const [cattle, setCattle] = useState<Cattle[]>([])
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    if (search === '') {
      setCattle([])
      return
    }

    const fetch = async () => {
      setIsFetching(true)

      const results = await database.collections
        .get<Cattle>(TableName.CATTLE)
        .query(Q.where('tag_id', Q.like(`${Q.sanitizeLikeString(search)}%`)))
        .fetch()

      setIsFetching(false)
      setCattle(results)
    }

    fetch()
  }, [search])

  const renderItem = useCallback(({ item }: { item: Cattle }) => <CattleItem cattle={item} />, [])
  const keyExtractor = useCallback((item: Cattle) => item.id, [])
  const listEmptyComponent = useCallback(
    () => (
      <ListEmptyComponent
        search={search}
        isFetching={isFetching}
      />
    ),
    [cattle, isFetching]
  )

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.elevation.level3,
        flex: 1
      }}
    >
      <Searchbar
        keyboardType='numeric'
        autoFocus
        placeholder='Buscar no. de identificación'
        value={search}
        onChangeText={(text) => setSearch(text)}
        mode='view'
        icon={() => (
          <Icon
            size={24}
            source='arrow-left'
          />
        )}
        onIconPress={navigation.goBack}
      />
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps='handled'
        data={cattle}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={listEmptyComponent}
      />
    </SafeAreaView>
  )
}

export default SearchCattle

const styles = StyleSheet.create({
  emtpyListContainer: {
    marginVertical: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 16
  }
})
