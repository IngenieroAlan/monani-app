import { ResourcesStackParams } from '@/navigation/stacks/ResourcesStack'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { useCallback } from 'react'
import { View } from 'react-native'
import { Appbar, Divider, Icon, List, ListItemProps, useTheme } from 'react-native-paper'

type ScreenNavigationProp = NativeStackScreenProps<ResourcesStackParams>

const ListItem = (props: ListItemProps & { iconName: string }) => {
  const left = useCallback(() => {
    return (
      <View style={{ paddingStart: 16 }}>
        <Icon
          size={24}
          source={props.iconName}
        />
      </View>
    )
  }, [props.iconName])

  return (
    <List.Item
      {...props}
      left={left}
      right={() => (<Icon size={24} source='menu-right' />)}
    />
  )
}

const Resources = ({ navigation }: ScreenNavigationProp) => {
  const theme = useTheme()

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <StatusBar />
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title='Recursos' />
      </Appbar.Header>
      <ListItem
        title='Alimentos'
        iconName='grass'
        onPress={() => navigation.navigate('FeedsView')}
      />
      <Divider horizontalInset />
      <ListItem
        title='Medicamentos'
        iconName='needle'
        onPress={() => navigation.navigate('MedicationsView')}
      />
    </View>
  )
}

export default Resources
