import Cattle from '@/database/models/Cattle'
import { useAppDispatch } from '@/hooks/useRedux'
import { setCattleInfo } from '@/redux/slices/cattles'
import { withObservables } from '@nozbe/watermelondb/react'
import { useNavigation } from '@react-navigation/native'
import { View } from 'react-native'
import { Icon, List, Text } from 'react-native-paper'

const Right = () => {
  return (
    <View style={{ justifyContent: 'center' }}>
      <Icon
        size={24}
        source='chevron-right'
      />
    </View>
  )
}

const Title = ({ cattle }: { cattle: Cattle }) => {
  const title = cattle.name ? `No. ${cattle.tagId}: ${cattle.name}` : `No. ${cattle.tagId}`

  return (
    <View>
      <Text variant='labelMedium'>{`Producción ${cattle.productionType.toLowerCase()}`}</Text>
      <Text variant='bodyLarge'>{title}</Text>
    </View>
  )
}

const observeCattle = withObservables(['cattle'], ({ cattle }: { cattle: Cattle }) => ({
  cattle
}))

const HomeListItem = ({ cattle }: { cattle: Cattle }) => {
  const navigator = useNavigation()
  const dispatch = useAppDispatch()

  return (
    <List.Item
      title={<Title cattle={cattle} />}
      description={<Text variant='bodyMedium'>{cattle.cattleStatus}</Text>}
      right={() => <Right />}
      onPress={() => {
        dispatch(setCattleInfo(cattle))
        navigator.navigate('CattleInfoTabsStack', { screen: 'InfoRoute' })
      }}
    />
  )
}

export default observeCattle(HomeListItem)
