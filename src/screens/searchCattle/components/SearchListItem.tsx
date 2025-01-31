import Cattle from '@/database/models/Cattle'
import { useAppDispatch } from '@/hooks/useRedux'
import { setCattleInfo } from '@/redux/slices/cattles'
import { useNavigation } from '@react-navigation/native'
import { useMemo } from 'react'
import { View } from 'react-native'
import { Icon, List, Text } from 'react-native-paper'

const Left = ({ iconName }: { iconName: string }) => {
  return (
    <View style={{ paddingStart: 16 }}>
      <Icon
        source={iconName}
        size={24}
      />
    </View>
  )
}

const Title = ({ cattle }: { cattle: Cattle }) => {
  const title = cattle.name ? `No. ${cattle.tagId}: ${cattle.name}` : `No. ${cattle.tagId}`

  return (
    <View>
      <Text variant='labelMedium'>{`Producción ${cattle.productionType.toLocaleLowerCase()}`}</Text>
      <Text variant='bodyLarge'>{title}</Text>
    </View>
  )
}

const SearchListItem = ({ cattle }: { cattle: Cattle }) => {
  const navigation = useNavigation()
  const dispatch = useAppDispatch()

  const status = useMemo(() => {
    if (cattle.isActive) {
      return 'Activo'
    } else if (cattle.isArchived) {
      return 'Archivado'
    } else {
      return 'Vendido'
    }
  }, [cattle])

  const icon = useMemo(() => {
    switch (status) {
      case 'Activo':
        return 'check'
      case 'Archivado':
        return 'archive-outline'
      case 'Vendido':
        return 'tag-outline'
    }
  }, [status])

  return (
    <List.Item
      title={<Title cattle={cattle} />}
      description={status}
      left={() => <Left iconName={icon} />}
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

export default SearchListItem
