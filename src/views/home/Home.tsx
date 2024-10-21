import BottomSheetProductionFilter from '@/components/home/BottomSheetProductionFilter'
import BottomSheetStatusFilter from '@/components/home/BottomSheetStatusFilter'
import CattleList from '@/components/home/CattleList'
import useScrollFab from '@/hooks/useScrollFab'
import { LivestockStackParams } from '@/navigation/stacks/LivestockStack'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import React, { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { AnimatedFAB, Appbar, FAB, useTheme } from 'react-native-paper'

type ScreenNavigationProp = NativeStackScreenProps<LivestockStackParams>

export const HomeView = ({ navigation }: ScreenNavigationProp) => {
  const theme = useTheme()
  const flatListRef = useRef<FlatList>(null)
  const { isFabExtended, isScrollAtTop, onScroll } = useScrollFab()

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
        <CattleList // TODO: Implement infinite scroll and paginate query results. (VirtualizedList)
          onScroll={onScroll}
          ref={flatListRef}
        />
        <View style={styles.fabsContainer}>
          <FAB
            visible={isScrollAtTop}
            size='small'
            icon='chevron-up'
            variant='secondary'
            onPress={() => flatListRef.current?.scrollToOffset({ animated: true, offset: 0 })}
          />
          <View style={{ flexDirection: 'row' }}>
            <AnimatedFAB
              style={{ position: 'relative' }}
              extended={isFabExtended}
              icon='plus'
              label='Añadir'
              onPress={() => navigation.navigate('AddCattleStack')}
            />
          </View>
        </View>
      </View>
      <BottomSheetStatusFilter />
      <BottomSheetProductionFilter />
    </>
  )
}

const styles = StyleSheet.create({
  fabsContainer: {
    position: 'absolute',
    alignItems: 'flex-end',
    gap: 24,
    right: 16,
    bottom: 16
  }
})
