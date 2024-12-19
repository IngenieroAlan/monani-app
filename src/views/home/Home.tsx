import CattleList from '@/components/CattleList/CattleList'
import useScrollFab from '@/hooks/useScrollFab'
import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { AnimatedFAB, Appbar, useTheme } from 'react-native-paper'
import HomeListItem from './components/HomeListItem'
import HomeSnackbarContainer from './components/HomeSnackbarContainer'

const Filters = memo(() => {
  return (
    <>
      <CattleList.StatusFilterChip />
      <CattleList.ProductionFilterChip />
    </>
  )
})

const List = () => {
  const navigation = useNavigation()
  const { isFabExtended, onScroll } = useScrollFab()

  return (
    <>
      <CattleList
        filters={<Filters />}
        flashListProps={{
          estimatedItemSize: 88,
          onScroll: onScroll,
          onEndReachedThreshold: 1.5,
          ListFooterComponent: () => <View style={{ height: 88 }} />
        }}
      >
        {({ item }) => <HomeListItem cattle={item} />}
      </CattleList>
      <AnimatedFAB
        style={styles.fab}
        extended={isFabExtended}
        icon='plus'
        label='Añadir'
        onPress={() => navigation.navigate('AddCattleStack')}
      />
    </>
  )
}

export const HomeView = () => {
  const theme = useTheme()
  const navigation = useNavigation()

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.surface
        }}
      >
        <StatusBar />
        <Appbar.Header>
          <Appbar.Content title='Monani' />
          <Appbar.Action
            icon='magnify'
            onPress={() => navigation.navigate('SearchCattleView')}
          />
          <Appbar.Action
            icon='shape-outline'
            onPress={() => navigation.navigate('ResourcesStack')}
          />
        </Appbar.Header>
        <List />
      </View>
      <HomeSnackbarContainer />
    </>
  )
}

const styles = StyleSheet.create({
  fab: {
    right: 16,
    bottom: 16
  }
})
