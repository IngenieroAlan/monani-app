import { useAppSelector } from '@/hooks/useRedux'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useMemo, useRef } from 'react'
import { Animated } from 'react-native'
import { Appbar, FAB } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const BOTTOM_APPBAR_HEIGHT = 80

const Footer = () => {
  const { bottom } = useSafeAreaInsets()
  const screen = useAppSelector((state) => state.ui.screen)
  const navigation = useNavigation()
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: screen === 'DietRoute' ? 1 : 0,
      duration: 100,
      useNativeDriver: true
    }).start()
  }, [screen])

  const fabIcon = useMemo(() => {
    if (screen === 'InfoRoute' || screen === 'GenealogyRoute') {
      return 'pencil'
    }

    return 'plus'
  }, [screen])

  const navigateTo = () => {
    switch (screen) {
      case 'InfoRoute':
        console.log('Navigate to edit')
        break
      case 'DietRoute':
        navigation.navigate('DietFeedRoute')
        break
      case 'MedicationRoute':
        navigation.navigate('MedicationScheduleRoute')
        break
      case 'WeightRoute':
        console.log('Navigate to add')
        break
      case 'MilkyRoute':
        console.log('Navigate to add')
        break
      case 'GenealogyRoute':
        navigation.navigate('SearchOffspringView')
        break
      default:
        console.log('Navigate to')
        break
    }
  }

  return (
    <Appbar
      elevated
      safeAreaInsets={{ bottom }}
      style={{ height: BOTTOM_APPBAR_HEIGHT + bottom }}
    >
      <Appbar.Action
        icon='trash-can-outline'
        onPress={() => {}}
      />
      <Appbar.Action
        icon='package-down'
        onPress={() => {}}
      />
      <Appbar.Action
        icon='tag-outline'
        onPress={() => {}}
      />

      <Animated.View style={{ opacity: fadeAnim }}>
        <Appbar.Action
          icon='cog-outline'
          onPress={() => {
            screen === 'DietRoute' && navigation.navigate('DietSettingsRoute')
          }}
        />
      </Animated.View>

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
}

export default Footer
