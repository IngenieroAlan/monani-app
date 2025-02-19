import Cattle from '@/database/models/Cattle'
import CattleSale from '@/database/models/CattleSale'
import useCattleArchive from '@/hooks/collections/useCattleArchive'
import { useAppSelector } from '@/hooks/useRedux'
import { withObservables } from '@nozbe/watermelondb/react'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useMemo, useRef } from 'react'
import { Animated } from 'react-native'
import { Appbar, FAB } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import DeleteCattleAction from './DeleteCattleAction'
import UnarchiveCattleAction from './UnarchiveCattleAction'

const BOTTOM_APPBAR_HEIGHT = 80

const withCattleSaleObserver = withObservables(['cattle'], ({ cattle }: { cattle: Cattle }) => ({
  cattle: cattle,
  sale: cattle.sale
}))

const CattleBottomAppBar = withCattleSaleObserver(({ cattle, sale }: { cattle: Cattle; sale: CattleSale[] }) => {
  const navigation = useNavigation()
  const { bottom } = useSafeAreaInsets()
  const { cattleArchive } = useCattleArchive(cattle)
  const screen = useAppSelector((state) => state.ui.screen)
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: screen === 'DietRoute' ? 1 : 0,
      duration: 100,
      useNativeDriver: true
    }).start()
  }, [screen])

  const fabIcon = useMemo(() => {
    if (cattleArchive) {
      return 'archive-edit-outline'
    }

    if (screen === 'InfoRoute' || screen === 'GenealogyRoute') {
      return 'pencil-outline'
    }

    return 'plus'
  }, [screen, cattleArchive])

  const navigateTo = () => {
    if (cattleArchive) {
      navigation.navigate('CattleStack', { screen: 'EditCattleArchiveView' })
      return
    }

    switch (screen) {
      case 'InfoRoute':
        navigation.navigate('CattleStack', { screen: 'EditCattleInfoView' })
        break
      case 'DietRoute':
        navigation.navigate('CattleStack', { screen: 'CreateDietFeedView' })
        break
      case 'MedicationRoute':
        navigation.navigate('CattleStack', { screen: 'MedicationScheduleRoute' })
        break
      case 'WeightRoute':
        console.log('Navigate to add')
        break
      case 'MilkyRoute':
        navigation.navigate('CattleStack', { screen: 'CreateMilkReportView' })
        break
      case 'GenealogyRoute':
        navigation.navigate('CattleStack', { screen: 'SearchOffspringView' })
        break
      default:
        console.log('Navigate to')
        break
    }
  }

  if (sale.length > 0) return

  return (
    <Appbar
      elevated
      safeAreaInsets={{ bottom }}
      style={{ height: BOTTOM_APPBAR_HEIGHT + bottom }}
    >
      <DeleteCattleAction />
      {cattleArchive ? (
        <UnarchiveCattleAction />
      ) : (
        <>
          <Appbar.Action
            icon='archive-arrow-down-outline'
            onPress={() => navigation.navigate('CattleStack', { screen: 'CreateCattleArchiveView' })}
          />
          <Appbar.Action
            icon='tag-outline'
            onPress={() => navigation.navigate('CattleStack', { screen: 'CreateCattleSaleView' })}
          />

          <Animated.View style={{ opacity: fadeAnim }}>
            <Appbar.Action
              icon='cog-outline'
              onPress={() => {
                screen === 'DietRoute' && navigation.navigate('CattleStack', { screen: 'EditDietProportionsView' })
              }}
            />
          </Animated.View>
        </>
      )}

      <FAB
        mode='flat'
        icon={fabIcon}
        onPress={navigateTo}
        style={{
          marginLeft: 'auto',
          marginRight: 12
        }}
      />
    </Appbar>
  )
})

export default CattleBottomAppBar
