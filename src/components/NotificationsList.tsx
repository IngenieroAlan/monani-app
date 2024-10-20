import { Notification } from '@/interfaces/notificationsInterfaces';
import { colors } from '@/utils/colors';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { IconButton, List, Menu, Icon } from 'react-native-paper';
import { Navigator } from '../navigation/Navigator';

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
    return (
        <List.Section>
            <List.Subheader>{day}</List.Subheader>
            {
                dayNotifications.map((dayNotification) => (
                    <NotificationItemList key={dayNotification.id} dayNotification={dayNotification} />
                ))
            }
        </List.Section>
    )
}

interface itemProps {
    dayNotification: Notification;
}
export const NotificationItemList = ({ dayNotification }: itemProps) => {
    const [visible, setVisible] = useState(false);
    const navigator = useNavigation();
    const onPress = () => {
        console.log("se presiono");
        dayNotification.isMarkedAsRead = true;
        //navigator.navigate();
    }
    return (
        <List.Item
            style={{
                backgroundColor: dayNotification.isMarkedAsRead
                    ? colors.notification.read
                    : colors.notification.default,
            }}
            onPress={onPress}
            contentStyle={{ width: "80%" }}
            title={dayNotification.title}
            description={dayNotification.description}
            left={() => <List.Icon icon={dayNotification.iconName!} style={{ width: "10%" }} color={colors.icons.main} />}
            right={() =>
                <Menu
                    anchorPosition='bottom'
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    anchor={<IconButton icon={"dots-vertical"} size={24} iconColor={colors.icons.main} onPress={() => setVisible(true)} />}
                >
                    <Menu.Item title="Marcar como leído" leadingIcon="checkbox-outline" onPress={() => { dayNotification.isMarkedAsRead = true }} />
                    <Menu.Item title="Eliminar" leadingIcon="trash-can-outline" onPress={() => { dayNotification.isMarkedAsRead = false }} />
                </Menu>
            }
        />
    )
}