import { colors } from '@/utils/colors';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { IconButton, List, Menu, Icon } from 'react-native-paper';
import { Navigator } from '../navigation/Navigator';
import Notification from '@/database/models/Notification';
import { useAppDispatch } from '../hooks/useRedux';
import { deleteNotification, getNotifications, markAsReadNoti } from '@/redux/slices/notificationsSlice';
import { useDatabase } from '@nozbe/watermelondb/react';
import { Database } from '@nozbe/watermelondb';

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
    const dispatch = useAppDispatch();
    const [visible, setVisible] = useState(false);
    const navigator = useNavigation();
    const onPress = () => {
        dispatch(markAsReadNoti(dayNotification));
        //navigator.navigate('notificationsDetails');
    }
    const onMarkAsRead = () => {
        dispatch(markAsReadNoti(dayNotification));
        setVisible(false);
    }
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
                    <Menu.Item title="Marcar como leído" leadingIcon="checkbox-outline" onPress={onMarkAsRead} />
                    <Menu.Item title="Eliminar" leadingIcon="trash-can-outline" onPress={onDelete} />
                </Menu>
            }
        />
    )
}