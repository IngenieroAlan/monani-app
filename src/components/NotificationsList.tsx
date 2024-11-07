import { colors } from '@/utils/colors';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { IconButton, List, Menu } from 'react-native-paper';
//import { Navigator } from '../navigation/Navigator';
import Notification from '@/database/models/Notification';
import { useAppDispatch } from '../hooks/useRedux';
import { deleteNotification, markAsReadNoti } from '@/redux/slices/notificationsSlice';
import { useDatabase } from '@nozbe/watermelondb/react';
import { Database } from '@nozbe/watermelondb';
import { StackNavigationProp } from '@react-navigation/stack';
import { NotificationsStackParams } from '@/navigation/stacks/NotificationsStack';
import { setCattleInfo } from '@/redux/slices/cattles';
import useCattle from '@/hooks/collections/useCattle';
import { RootStackParamList } from '@/navigation/types';

type ScreenNavigationProp = StackNavigationProp<RootStackParamList>

const MenuItems = [
    {
        icon: "checkbox-outline",
        text: "Marcar como leído"
    },
    {
        icon: "trash-can-outline",
        text: "Eliminar"
    },
]

interface Props {
    day: string;
    dayNotifications: Notification[];
}

export const NotificationsList = ({ day, dayNotifications }: Props) => {
    const database = useDatabase();


    return (
        <List.Section>
            <List.Subheader style={{ fontWeight: 'bold', fontSize: 16 }}>{day}</List.Subheader>
            {
                dayNotifications && dayNotifications.map((dayNotification) => (
                    <NotificationItemList key={dayNotification.id} database={database} dayNotification={dayNotification} />
                ))
            }
        </List.Section>
    )
}

interface itemProps {
    dayNotification: Notification;
    database: Database;
}
export const NotificationItemList = ({ dayNotification, database }: itemProps) => {
    const { cattleRecords } = useCattle();
    const navigator = useNavigation<ScreenNavigationProp>();
    const dispatch = useAppDispatch();
    const [visible, setVisible] = useState(false);
    const onPress = async () => {
        dispatch(markAsReadNoti(dayNotification));
        try {
            const res = cattleRecords.find(cow => cow.id === (dayNotification.cattle).id);
            dispatch(setCattleInfo(res))
        } catch (error) {
            console.log(error);

        }

        navigator.navigate("CattleDetailsLayout")
    }
    const handleMarkAsRead = (notification: Notification) => {
        dispatch(markAsReadNoti(notification));
        setVisible(false);
    };
    const onDelete = () => {
        dispatch(deleteNotification(database, dayNotification));
        setVisible(false);
    }
    return (
        <List.Item
            style={{
                backgroundColor: dayNotification.isMarkedAsRead
                    ? colors.notification.read
                    : colors.notification.default,
            }}
            onPress={onPress}
            title={dayNotification.title}
            description={dayNotification.description}
            left={() => <List.Icon icon={dayNotification.iconName!} style={{ width: "15%" }} color={colors.icons.main} />}
            right={() =>
                <Menu
                    anchorPosition='bottom'
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    anchor={<IconButton icon={"dots-vertical"} size={24} iconColor={colors.icons.main} onPress={() => setVisible(true)} />}
                >
                    <Menu.Item title="Marcar como leído" leadingIcon="checkbox-outline" onPress={() => handleMarkAsRead(dayNotification)} />
                    <Menu.Item title="Eliminar" leadingIcon="trash-can-outline" onPress={onDelete} />
                </Menu>
            }
        />
    )
}