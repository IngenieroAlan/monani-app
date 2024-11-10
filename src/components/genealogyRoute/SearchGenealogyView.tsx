import Cattle from '@/database/models/Cattle'
import { TableName } from '@/database/schema'
import useOffsprings from '@/hooks/collections/useOffsprings'
import { useAppSelector } from '@/hooks/useRedux'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { useNavigation } from '@react-navigation/native'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { ActivityIndicator, Button, Divider, Icon, List, Searchbar, Text, useTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

// CattleItem components - start
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
const CattleItem = memo(({ cattle, selectCattle, editOffspring }:
  {
    cattle: Cattle,
    selectCattle: (cattle: Cattle) => void
    editOffspring?: boolean
  }) => {
  const theme = useTheme()

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
      right={() => editOffspring && <Icon size={24} source='close' />}
      onPress={() => selectCattle(cattle)}
      style={{ backgroundColor: editOffspring ? theme.colors.elevation.level1 : theme.colors.elevation.level3 }}
    />
  )
})
// CattleItem components - end

const OffspringsList = ({ offsprings, setOffsprings, setIsDirty }: {
  offsprings: Cattle[],
  setOffsprings: (offsprings: Cattle[]) => void
  setIsDirty: (isDirty: boolean) => void
}
) => {
  const theme = useTheme()
  return (
    <List.Accordion
      title='Descendencia'
      left={() => (<>
        <View style={{ paddingStart: 16, alignSelf: 'center' }}>
          <Icon source='cow' size={24} />
        </View>
      </>)}
      style={{ backgroundColor: theme.colors.elevation.level1 }}
    >
      {offsprings.map((cattle) => (
        <CattleItem
          key={cattle.id}
          cattle={cattle}
          editOffspring
          selectCattle={() => {
            setOffsprings(offsprings.filter(offspring => offspring.id !== cattle.id))
            setIsDirty(true)
          }} />
      ))}
    </List.Accordion>
  )
}

type SearchGenealogyViewProps = {
  action: () => void;
  isSubmitting?: boolean;
  selectedCattle?: Cattle;
  setSelectedCattle: (cattle: Cattle) => void;
  editOffspring?: boolean;
  offsprings?: Cattle[];
  setOffsprings?: (offsprings: Cattle[]) => void;
}

const SearchGenealogyView = ({
  action,
  isSubmitting,
  setSelectedCattle,
  selectedCattle,
  editOffspring,
  offsprings,
  setOffsprings
}: SearchGenealogyViewProps
) => {
  const navigation = useNavigation()
  const theme = useTheme()
  const database = useDatabase()
  const [search, setSearch] = useState('')
  const [cattles, setCattles] = useState<Cattle[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  const { cattleInfo } = useAppSelector(state => state.cattles);

  // Fetch cattles
  useEffect(() => {
    if (search === '') {
      setCattles([])
      return
    }

    const fetch = async () => {
      setIsFetching(true)

      const results = await database.collections
        .get<Cattle>(TableName.CATTLE)
        .query(Q.where('tag_id', Q.like(`${Q.sanitizeLikeString(search)}%`)))
        .fetch()

      setIsFetching(false)
      setCattles(results)
    }

    fetch()
  }, [search])

  // Actions on select cattle
  const selectCattle = (cattle: Cattle) => {
    if (editOffspring) {
      const exists = offsprings?.find(offspring => offspring.id === cattle.id)
      if (!exists) {
        setOffsprings!([...offsprings!, cattle])
      } else return
    }
    editOffspring ? setSearch('') : setSearch(cattle.tagId)
    setSelectedCattle(cattle)
    setIsDirty(true)
  }

  // List components
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
    [cattles, isFetching]
  )

  // Validation
  useEffect(() => {
    setIsValid(selectedCattle !== undefined)
  }, [selectedCattle])

  useEffect(() => {
    setIsValid(true)
  }, [isDirty])

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
            onPress={action}
            disabled={!isValid && !isSubmitting || !isDirty || !cattleInfo}
          >
            Guardar
          </Button>
        }
        style={{ paddingVertical: 8 }}
      />
      <Divider bold />
      {editOffspring && (<>
        <OffspringsList
          offsprings={offsprings!}
          setOffsprings={setOffsprings!}
          setIsDirty={setIsDirty}
        />
        <Divider bold />
      </>)}
      <List.Subheader>Resultados</List.Subheader>
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps='handled'
        data={cattles}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={listEmptyComponent}
      />
    </SafeAreaView>
  )
}

export default memo(SearchGenealogyView)

const styles = StyleSheet.create({
  emtpyListContainer: {
    marginVertical: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 16
  }
})
