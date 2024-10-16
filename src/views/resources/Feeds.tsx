import { useNavigation } from '@react-navigation/native'
import { View } from 'react-native'
import { Appbar, useTheme } from 'react-native-paper'

const Feeds = () => {
  const theme = useTheme()
  const navigation = useNavigation()

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title='Alimentos' />
      </Appbar.Header>
    </View>
  )
}

export default Feeds
