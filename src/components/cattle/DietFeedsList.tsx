import Feed from '@/database/models/Feed'
import { DietFeedItem } from '@/interfaces/cattleInterfaces'
import { useDatabase } from '@nozbe/watermelondb/react'
import { forwardRef, memo, Ref, useState } from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Icon, IconButton, List, Menu, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'

const ListItemMenu = ({ dietFeedId }: { dietFeedId: string; }) => {
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

const ListItem = ({ dietFeed }: { dietFeed: DietFeedItem }) => {
    return (
        <List.Item
            style={{ paddingVertical: 2, paddingRight: 8 }}
            title={dietFeed.name}
            description={dietFeed.feedProportion === 'Por porcentaje' ? `${dietFeed.percentage}%` : `${dietFeed.feedAmount} kg`}
            right={() => (
                <ListItemMenu
                    dietFeedId={dietFeed.dietFeedId}
                />
            )}
        />
    )
}

const DietFeedsList = (
    { dietFeeds }: { dietFeeds: DietFeedItem[] }
) => {
    const database = useDatabase()

    return (
        <FlatList
            data={dietFeeds}
            renderItem={({ item }) => (
                <ListItem
                    dietFeed={item}
                />
            )}
            keyExtractor={(item) => item.dietFeedId}
            ListFooterComponent={() => <View style={{ height: 88 }} />}
        />
    )
}

export default memo(DietFeedsList)
