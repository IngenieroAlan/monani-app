import BottomSheetProductionFilter from '@/components/home/BottomSheetProductionFilter'
import BottomSheetStatusFilter from '@/components/home/BottomSheetStatusFilter'
import CattleList from '@/components/home/CattleList'
import CattleListFilters from '@/components/home/CattleListFilters'
import useScrollFab from '@/hooks/useScrollFab'
import { LivestockStackParams } from '@/navigation/stacks/LivestockStack'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { AnimatedFAB, Appbar, useTheme } from 'react-native-paper'

type ScreenNavigationProp = NativeStackScreenProps<LivestockStackParams>

export const HomeView = ({ navigation }: ScreenNavigationProp) => {
  const theme = useTheme()
  const { isFabExtended, onScroll } = useScrollFab()

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
            icon='hammer-screwdriver'
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
    </>
  )
}

const styles = StyleSheet.create({
  fab: {
    right: 16,
    bottom: 16
  }
})
