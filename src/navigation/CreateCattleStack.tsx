import DietSettings from '@/components/addCattle/DietSettings'
import { useAppDispatch } from '@/hooks/useRedux'
import { reset } from '@/redux/slices/uiVisibilitySlice'
import { CattlInfo } from '@/screens/addCattle/CattleInfo'
import { Diet } from '@/screens/addCattle/Diet'
import DietFeed from '@/screens/addCattle/DietFeed'
import Medication from '@/screens/addCattle/Medication'
import { Medications } from '@/screens/addCattle/Medications'
import { createStackNavigator } from '@react-navigation/stack'
import { CreateCattleStackParamList } from './types'

const Stack = createStackNavigator<CreateCattleStackParamList>()

export const CreateCattleStack = () => {
  const dispatch = useAppDispatch()

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      screenListeners={{
        blur: () => dispatch(reset())
      }}
    >
      <Stack.Screen
        name='CattleInfo'
        component={CattlInfo}
      />
      <Stack.Screen
        name='Diet'
        component={Diet}
      />
      <Stack.Screen
        name='Medications'
        component={Medications}
      />
      <Stack.Screen
        name='DietFeed'
        component={DietFeed}
        options={{
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name='DietSettings'
        options={{
          presentation: 'modal'
        }}
        component={DietSettings}
      />
      <Stack.Screen
        name='Medication'
        options={{
          presentation: 'modal'
        }}
        component={Medication}
      />
    </Stack.Navigator>
  )
}
