import { View } from 'react-native'
import { Icon, List, ListItemProps } from 'react-native-paper'

const ResourcesListItem = (props: Omit<ListItemProps, 'left' | 'right'> & { iconName: string }) => {
  return (
    <List.Item
      {...props}
      left={() => (
        <View style={{ paddingStart: 16 }}>
          <Icon
            size={24}
            source={props.iconName}
          />
        </View>
      )}
      right={() => (
        <Icon
          size={24}
          source='menu-right'
        />
      )}
    />
  )
}

export default ResourcesListItem
