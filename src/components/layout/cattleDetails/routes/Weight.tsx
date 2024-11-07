import { useAppSelector } from '@/hooks/useRedux';
import { cattleDetails } from '@/styles/main';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useEffect, useState } from 'react'
import { FlatList, View } from 'react-native'
import { IconButton, Menu, Text } from 'react-native-paper';
import { CattleWeightDetails } from '../Components/CattleWeightDetails';



export const WeightRoute = () => {
    const { cattleInfo } = useAppSelector(state => state.cattles);
   return(
    <>
    {
        cattleInfo && <CattleWeightDetails cattle={cattleInfo}/>
    }
    </>
   );
}

interface ActionProps {
    weight: number;
    weightDiference: number;
    date: Date;
    onEdit?: () => void;
    onDelete?: () => void;
}

const ActionsMenu = ({ weight, weightDiference, date, onEdit, onDelete }: ActionProps) => {
    const [visible, setVisible] = useState(false);
    return (
        <View style={cattleDetails.actionMenu}>
            <View style={{ flex: 2 }}>
                <Text variant='titleMedium'>
                    {weight} kg.
                </Text>
                <Text variant='labelSmall' style={{ color: weightDiference > 0 ? "green" : "red" }}>
                    {weightDiference > 0 && "+"}{weightDiference} kg. promedio al día
                </Text>
            </View>
            <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "flex-end" }}>
                <Text variant='labelSmall'>
                    {format(date, "dd/MM/yy", { locale: es })}
                </Text>
            </View>
            <Menu
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchorPosition='bottom'
                anchor={<IconButton icon={"dots-vertical"} onPress={() => setVisible(!visible)} />}
            >
                <Menu.Item leadingIcon={"pencil-outline"} onPress={onEdit} title="Editar" />
                <Menu.Item leadingIcon={"minus"} onPress={onDelete} title="Remover" />
            </Menu>
        </View>
    );
};