import Cattle from "@/database/models/Cattle"
import { useAppDispatch } from "@/hooks/useRedux"
import { withObservables } from "@nozbe/watermelondb/react"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { View } from "react-native"
import { Divider, Icon, IconButton, List, Menu, Text, useTheme } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const observeCattle = withObservables(['cattle'], ({ cattle }: { cattle: Cattle }) => ({
  cattle
}))

export const SetMother = ({ mother }: { mother?: Cattle }) => {
  const navigation = useNavigation()
  const ListItemMenu = () => {
    const theme = useTheme()
    const dispatch = useAppDispatch()
    const insets = useSafeAreaInsets()
    const [menuVisible, setMenuVisible] = useState(false)

    return (
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchorPosition='bottom'
        statusBarHeight={insets.top}
        anchor={
          <IconButton
            icon='dots-vertical'
            onPress={() => setMenuVisible(true)}
          />
        }
      >
        <Menu.Item
          title='Editar'
          leadingIcon='pencil-outline'
          onPress={() => {
            setMenuVisible(false);
            navigation.navigate('SearchMother');
          }}
        />
        <Menu.Item
          theme={{ colors: { onSurface: theme.colors.onSurface } }}
          title='Eliminar'
          leadingIcon='minus'
          onPress={() => {
            setMenuVisible(false);

          }}
        />
      </Menu>
    )
  }
  const ListItemRight = ({ cattleWeight }: { cattleWeight: number }) => {
    const decimals = cattleWeight.toString().split('.')[1]
    const formattedWeight = `${Math.trunc(cattleWeight)}.${decimals ? decimals.padEnd(3, '0') : '000'}`

    return (
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Text variant='labelSmall'>{`${formattedWeight} kg.`}</Text>
      </View>
    )
  }

  const ListItemTitle = ({ cattle }: { cattle: Cattle }) => {
    const title = cattle.name ? `No. ${cattle.tagId}: ${cattle.name}` : `No. ${cattle.tagId}`

    return (
      <View>
        <Text variant='labelMedium'>{`Producción ${cattle.productionType.toLocaleLowerCase()}`}</Text>
        <Text variant='bodyLarge'>{title}</Text>
      </View>
    )
  }

  const CattleItem = observeCattle(({ cattle }: { cattle: Cattle }) => {
    return (
      <List.Item
        title={<ListItemTitle cattle={cattle} />}
        description={<Text variant='bodyMedium'>{cattle.cattleStatus}</Text>}
        right={() => <ListItemRight cattleWeight={cattle.weight} />}
        onPress={() => console.log('Navigate to cattle details')}
      />
    )
  })

  return mother ? (<>
    <CattleItem cattle={mother} />
    <Divider />
  </>) : (<>
    <List.Item
      title='Asignar madre'
      right={() => <List.Icon icon='plus' />}
      style={{ paddingHorizontal: 16, paddingVertical: 8, gap: 16 }}
      onPress={() => navigation.navigate('SearchMother')}
    />
    <Divider />
  </>)
}