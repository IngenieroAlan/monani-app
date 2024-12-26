import { SurfaceContainer } from '@/components/SurfaceContainer'
import { ResourcesStackParamList } from '@/navigation/types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { Appbar, Divider } from 'react-native-paper'
import ResourcesListItem from './components/ResourcesListItem'

type ScreenProps = NativeStackScreenProps<ResourcesStackParamList>

const ResourcesView = ({ navigation }: ScreenProps) => {
  return (
    <SurfaceContainer>
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
    </SurfaceContainer>
  )
}

export default ResourcesView
