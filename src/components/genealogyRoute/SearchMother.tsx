import Cattle from '@/database/models/Cattle'
import { TableName } from '@/database/schema'
import { useAppSelector } from '@/hooks/useRedux'
import { Q } from '@nozbe/watermelondb'
import { useDatabase, withObservables } from '@nozbe/watermelondb/react'
import { useNavigation } from '@react-navigation/native'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { ActivityIndicator, Appbar, Button, Divider, Icon, IconButton, List, Searchbar, Text, useTheme } from 'react-native-paper'
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

const CattleItem = memo(({ cattle, selectCattle }:
  {
    cattle: Cattle,
    selectCattle: (cattle: Cattle) => void
  }) => {
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
      onPress={() => selectCattle(cattle)}
    />
  )
})

const SearchMother = () => {
  const navigation = useNavigation()
  const theme = useTheme()
  const database = useDatabase()
  const [search, setSearch] = useState('')
  const [cattlesList, setCattlesList] = useState<Cattle[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [cattleId, setCattleId] = useState<string | undefined>(undefined)
  const [isValid, setIsValid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { selectedCattle, cattles } = useAppSelector(state => state.cattles);
  const [cattle, setCattle] = useState<Cattle | undefined>(undefined);

  useEffect(() => {
    if (selectedCattle) {
      const selected = cattles.find(cow => cow.id === selectedCattle);
      selected && setCattle(selected);
    }
  }, [selectedCattle, cattles])


  useEffect(() => {
    if (search === '') {
      setCattlesList([])
      return
    }

    const fetch = async () => {
      setIsFetching(true)

      const results = await database.collections
        .get<Cattle>(TableName.CATTLE)
        .query(Q.where('tag_id', Q.like(`${Q.sanitizeLikeString(search)}%`)))
        .fetch()

      setIsFetching(false)
      setCattlesList(results)
    }

    fetch()
  }, [search])

  const renderItem = ({ item }: { item: Cattle }) => {
    return <CattleItem cattle={item} selectCattle={selectCattle} />
  }
  const keyExtractor = useCallback((item: Cattle) => item.id, [])
  const listEmptyComponent = useCallback(
    () => (
      <ListEmptyComponent
        search={search}
        isFetching={isFetching}
      />
    ),
    [cattlesList, isFetching]
  )

  async function setMother() {
    setIsSubmitting(true)
    await cattle?.setMother(cattleId!)
    setIsSubmitting(false)
    navigation.goBack()
  }

  const selectCattle = (cattle: Cattle) => {
    setCattleId(cattle.id)
    setSearch(cattle.tagId)
  }

  useEffect(() => {
    setIsValid(cattleId !== undefined)
  }, [cattleId])

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
        mode='bar'
        icon='close'
        onIconPress={navigation.goBack}
        right={props =>
          <Button
            {...props}
            onPress={setMother}
            disabled={!isValid && !isSubmitting}
          >
            Guardar
          </Button>
        }
        style={{ paddingVertical: 8 }}
      />
      <Divider bold />
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps='handled'
        data={cattlesList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={listEmptyComponent}
      />
    </SafeAreaView>
  )
}

export default SearchMother

const styles = StyleSheet.create({
  emtpyListContainer: {
    marginVertical: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 16
  }
})
