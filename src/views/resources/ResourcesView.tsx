import { ResourcesStackParamList } from '@/navigation/types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { Appbar, Divider, useTheme } from 'react-native-paper'
import ResourcesListItem from './components/ResourcesListItem'

type ScreenProps = NativeStackScreenProps<ResourcesStackParamList>

const ResourcesView = ({ navigation }: ScreenProps) => {
  const theme = useTheme()

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <StatusBar />
      <Appbar.Header>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title='Recursos' />
      </Appbar.Header>
      <ResourcesListItem
        title='Alimentos'
        iconName='silverware'
        onPress={() => navigation.navigate('FeedsView')}
      />
      <Divider horizontalInset />
      <ResourcesListItem
        title='Medicamentos'
        iconName='needle'
        onPress={() => navigation.navigate('MedicationsView')}
      />
    </View>
  )
}

export default ResourcesView
