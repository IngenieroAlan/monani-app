import DietFeed from '@/database/models/DietFeed'
import Feed from '@/database/models/Feed'
import { TableName } from '@/database/schema'
import { show } from '@/redux/slices/uiVisibilitySlice'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { memo, useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Icon, IconButton, List, Menu, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'

type FeedsCount = { feed_id: string }

const ListItemMenu = ({ feedId }: { feedId: string; }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const insets = useSafeAreaInsets()
    const [visible, setVisible] = useState(false)

    return (
        <Menu
            visible={visible}
            onDismiss={() => setVisible(false)}
            anchorPosition='bottom'
            statusBarHeight={insets.top}
            anchor={
                <IconButton
                    icon='dots-vertical'
                    onPress={() => setVisible(true)}
                />
            }
        >
            <Menu.Item
                title='Editar'
                leadingIcon='pencil-outline'
                onPress={() => {

                }}
            />
            <Menu.Item
                theme={{ colors: { onSurface: theme.colors.onSurface } }}
                title='Eliminar'
                leadingIcon={() => (
                    <Icon
                        size={24}
                        source='trash-can-outline'
                        color={theme.colors.onSurface}
                    />
                )}
                onPress={() => {

                }}
            />
        </Menu>
    )
}

const ListItem = ({ feed }: { feed: Feed }) => {
    return (
        <List.Item
            style={{ paddingVertical: 2, paddingRight: 8 }}
            title={feed.name}
            description={feed.feedType}
            right={() => (
                <ListItemMenu
                    feedId={feed.id}
                />
            )}
        />
    )
}

const DietFeedsList = ({ feeds }: { feeds: Feed[] }) => {
    const database = useDatabase()

    return (
        <FlatList
            data={feeds}
            renderItem={({ item }) => (
                <ListItem
                    feed={item}
                />
            )}
            keyExtractor={(item) => item.id}
            ListFooterComponent={() => <View style={{ height: 88 }} />}
        />
    )
}

export default memo(DietFeedsList)
