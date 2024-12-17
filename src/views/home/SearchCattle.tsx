import CattleList from '@/components/CattleList/CattleList'
import { CattleFiltersProvider, useCattleFilters } from '@/contexts/CattleFiltersContext'
import Cattle from '@/database/models/Cattle'
import { useAppDispatch } from '@/hooks/useRedux'
import { setCattleInfo } from '@/redux/slices/cattles'
import { StackActions, useNavigation } from '@react-navigation/native'
import { memo, useCallback, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, List, Portal, Searchbar, Text, useTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

const ListEmptyComponent = () => {
  return (
    <View style={styles.listEmptyView}>
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

const CattleSearchbar = () => {
  const navigation = useNavigation()
  const tagId = useCattleFilters('tagId')
  const setTagId = useCattleFilters('setTagId')

  return (
    <Searchbar
      keyboardType='numeric'
      placeholder='Buscar no. de identificación'
      value={tagId}
      onChangeText={(text) => setTagId(text)}
      mode='view'
      icon={() => (
        <Icon
          size={24}
          source='arrow-left'
        />
      )}
      onIconPress={navigation.goBack}
    />
  )
}

const SearchCattle = () => {
  const theme = useTheme()

  const renderItem = useCallback(({ item }: { item: Cattle }) => <CattleItem cattle={item} />, [])

  return (
    <CattleFiltersProvider>
      <Portal.Host>
        <SafeAreaView
          style={{
            backgroundColor: theme.colors.elevation.level3,
            flex: 1
          }}
        >
          <CattleSearchbar />
          <CattleList
            flashListProps={{
              estimatedItemSize: 78,
              keyboardShouldPersistTaps: 'handled',
              onEndReachedThreshold: 1.5,
              ListEmptyComponent: <ListEmptyComponent />
            }}
            filters={
              <>
                <CattleList.StatusFilterChip />
                <CattleList.ProductionFilterChip />
                <CattleList.FlagFilterChip />
                <CattleList.QuarantineFilterChip />
              </>
            }
          >
            {renderItem}
          </CattleList>
        </SafeAreaView>
      </Portal.Host>
    </CattleFiltersProvider>
  )
}

export default SearchCattle

const styles = StyleSheet.create({
  listEmptyView: {
    alignItems: 'center',
    padding: 16,
    gap: 8
  }
})
