import Cattle from '@/database/models/Cattle'
import { useAppDispatch } from '@/hooks/useRedux'
import { setCattleInfo } from '@/redux/slices/cattles'
import useAppTheme from '@/theme'
import { withObservables } from '@nozbe/watermelondb/react'
import { useNavigation } from '@react-navigation/native'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
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
  const theme = useAppTheme()
  const title = cattle.name ? `No. ${cattle.tagId}: ${cattle.name}` : `No. ${cattle.tagId}`

  return (
    <View>
      <Text
        variant='labelMedium'
        style={{ color: theme.colors.onSurfaceVariant, opacity: 0.9 }}
      >{`Producción ${cattle.productionType.toLowerCase()}`}</Text>
      <Text
        variant='bodyLarge'
        style={{ fontWeight: 'bold' }}
      >
        {title}
      </Text>
    </View>
  )
}

const withObserver = withObservables(['cattle'], ({ cattle }: { cattle: Cattle }) => ({ cattle }))

const HomeListItem = ({ cattle }: { cattle: Cattle }) => {
  const theme = useAppTheme()
  const dispatch = useAppDispatch()
  const navigation = useNavigation()

  return (
    <List.Item
      style={[{ borderColor: theme.colors.outlineVariant }, styles.listItem]}
      borderless
      title={<Title cattle={cattle} />}
      description={
        <Text
          variant='bodyMedium'
          style={{ color: theme.colors.onSurfaceVariant, opacity: 0.9 }}
        >
          {cattle.cattleStatus}
        </Text>
      }
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

export default memo(withObserver(HomeListItem))

const styles = StyleSheet.create({
  listItem: {
    borderWidth: 0.5,
    marginHorizontal: 16,
    borderRadius: 12
  }
})
