import BottomSheetProductionFilter from '@/components/home/BottomSheetProductionFilter'
import BottomSheetStatusFilter from '@/components/home/BottomSheetStatusFilter'
import CattleList from '@/components/home/CattleList'
import CattleListFilters from '@/components/home/CattleListFilters'
import HomeSnackbarContainer from '@/components/home/HomeSnackbarContainer'
import useScrollFab from '@/hooks/useScrollFab'
import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { AnimatedFAB, Appbar, useTheme } from 'react-native-paper'

export const HomeView = () => {
  const theme = useTheme()
  const { isFabExtended, onScroll } = useScrollFab()
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
        <CattleListFilters />
        <CattleList onScroll={onScroll} />
        <AnimatedFAB
          style={styles.fab}
          extended={isFabExtended}
          icon='plus'
          label='Añadir'
          onPress={() => navigation.navigate('AddCattleStack')}
        />
      </View>
      <BottomSheetStatusFilter />
      <BottomSheetProductionFilter />
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
