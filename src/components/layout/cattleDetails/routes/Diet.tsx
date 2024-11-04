import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { cattleDetails } from '@/styles/main'
import { IconButton, Menu, Text } from 'react-native-paper'

export const DietRoute = () => {

    return (
        <ScrollView style={[cattleDetails.container, cattleDetails.cardsContainer]}>
            <ActionsMenu food={"Alfalfa"} cuantity={10} />
            <ActionsMenu food={"Concentrado"} cuantity={5} />
            <ActionsMenu food={"Heno"} cuantity={5} />
        </ScrollView>
    )
}

interface ActionProps {
    food: String;
    cuantity: number;
    onEdit?: () => {};
    onDelete?: () => {};
}

const ActionsMenu = ({ food, cuantity, onEdit, onDelete }: ActionProps) => {
    const [visible, setVisible] = useState(false);
    return <View style={cattleDetails.actionMenu}>
        <View>
            <Text variant='labelLarge'>
                {food}
            </Text>
            <Text variant='labelSmall'>
                {cuantity} kg.
            </Text>
        </View>
        <Menu
            visible={visible}
            onDismiss={() => setVisible(false)}
            anchorPosition='bottom'
            anchor={<IconButton icon={"dots-vertical"} onPress={() => setVisible(!visible)} />}>
            <Menu.Item leadingIcon={"pencil-outline"} onPress={onEdit} title="Editar" />
            <Menu.Item leadingIcon={"minus"} onPress={onDelete} title="Remover" />
        </Menu>
    </View>
}
