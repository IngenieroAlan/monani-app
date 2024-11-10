import Cattle from "@/database/models/Cattle"
import useMother from "@/hooks/collections/useMother"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { View } from "react-native"
import { Divider, IconButton, List, Menu, Text, useTheme } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"


export const SetMother = ({ cattle, onSelectedCattle }: { cattle: Cattle, onSelectedCattle: (cattle: Cattle) => void }) => {
  const navigation = useNavigation()
  const { mother } = useMother(cattle)

  // CattleItem components - start
  const ListItemMenu = () => {
    const theme = useTheme()
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
            size={20}
            onPress={() => setMenuVisible(true)}
          />
        }
      >
        <Menu.Item
          title='Editar'
          leadingIcon='pencil-outline'
          onPress={() => {
            setMenuVisible(false);
            navigation.navigate('SearchMotherView', { edit: true });
          }}
        />
        <Menu.Item
          theme={{ colors: { onSurface: theme.colors.onSurface } }}
          title='Eliminar'
          leadingIcon='minus'
          onPress={async () => {
            try {
              await cattle.removeMother()
            } catch (error) {
              console.log(error);
            }
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
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text variant='labelSmall'>{`${formattedWeight} kg.`}</Text>
        <ListItemMenu />
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
  const CattleItem = ({ cattle }: { cattle: Cattle }) => {
    return (
      <List.Item
        title={<ListItemTitle cattle={cattle} />}
        description={<Text variant='bodyMedium'>{cattle.cattleStatus}</Text>}
        right={() => <ListItemRight cattleWeight={cattle.weight} />}
        onPress={() => onSelectedCattle(cattle)}
      />
    )
  }
  // CattleItem components - end

  // Render
  return mother ? (<>
    <CattleItem cattle={mother} />
    <Divider />
  </>) : (<>
    <List.Item
      title='Asignar madre'
      right={() => <List.Icon icon='plus' />}
      style={{ paddingHorizontal: 16, paddingVertical: 8, gap: 16 }}
      onPress={() => navigation.navigate('SearchMotherView')}
    />
    <Divider />
  </>)
}