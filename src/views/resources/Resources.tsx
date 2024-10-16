import { ResourcesStackParams } from '@/navigation/stacks/ResourcesStack'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { Appbar, useTheme } from 'react-native-paper'

type ScreenNavigationProp = NativeStackScreenProps<ResourcesStackParams>

const Resources = ({ navigation }: ScreenNavigationProp) => {
  const theme = useTheme()

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <StatusBar />
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title='Recursos' />
      </Appbar.Header>
    </View>
  )
}

export default Resources
