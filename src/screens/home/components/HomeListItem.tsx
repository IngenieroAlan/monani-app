import { TableName } from '@/database/constants'
import Cattle from '@/database/models/Cattle'
import { useAppDispatch } from '@/hooks/useRedux'
import { setCattleInfo } from '@/redux/slices/cattles'
import { useDatabase, withObservables } from '@nozbe/watermelondb/react'
import { useNavigation } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import { memo, useEffect } from 'react'
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

const withCattleObserver = withObservables(['cattle'], ({ cattle }: { cattle: Cattle }) => ({
  cattle
}))

const HomeListItem = ({ cattle }: { cattle: Cattle }) => {
  const db = useDatabase()
  const dispatch = useAppDispatch()
  const navigation = useNavigation()
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['cattle', cattle.id],
      queryFn: () => db.get<Cattle>(TableName.CATTLE).find(cattle.id),
      initialData: cattle,
      initialDataUpdatedAt: () => queryClient.getQueryState(['cattle'])?.dataUpdatedAt
    })
  }, [cattle.id])

  return (
    <List.Item
      title={<Title cattle={cattle} />}
      description={<Text variant='bodyMedium'>{cattle.cattleStatus}</Text>}
      right={() => <Right />}
      onPress={() => {
        dispatch(setCattleInfo(cattle))
        navigation.navigate('CattleStack', {
          screen: 'CattleProfileTabsStack',
          params: { screen: 'InfoRoute' }
        })
      }}
    />
  )
}

export default memo(withCattleObserver(HomeListItem))
