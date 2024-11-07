import { useAppSelector } from '@/hooks/useRedux';
import { cattleDetails } from '@/styles/main';
import React, { useEffect, useState } from 'react'
import { FlatList, View } from 'react-native';
import { IconButton, Menu, Text } from 'react-native-paper';
import { MedicationType } from '../../../../database/models/Medication';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { withObservables } from '@nozbe/watermelondb/react';
import { TableName } from '@/database/schema';
import Cattle from '@/database/models/Cattle';

interface CowMedications {
    name: string;
    type: MedicationType;
    nextDoseAt: Date;
}
const observeCattle = withObservables([TableName.CATTLE], ({ cattle }: { cattle: Cattle }) => ({
    cattle
    //TODO: This should be based on the relation
}));

export const CattleMedicationsDetails = observeCattle(({ cattle }: { cattle: Cattle }) => {
    const { cattleInfo } = useAppSelector(state => state.cattles);
    const [medications, setMedications] = useState<CowMedications[]>();
    useEffect(() => {
        const fetch = async () => {
            const medicationSchedules = await cattleInfo?.medicationSchedules;
            const AllMedications = await Promise.all(
                medicationSchedules!.map(async (schedule) => {
                    const medication = await schedule.medication;
                    return {
                        name: medication.name,
                        type: medication.medicationType,
                        nextDoseAt: schedule.nextDoseAt
                    };
                })
            );
            setMedications(AllMedications)
        };
        fetch();
    }, []);



    return (
        <FlatList
            data={medications}
            style={[cattleDetails.container, cattleDetails.cardsContainer]}
            renderItem={({ item }) => (
                <ActionsMenu
                    title={item.name}
                    subtitle={item.type}
                    date={item.nextDoseAt}
                />
            )}
        />
    );
});

interface ActionProps {
    title: string;
    subtitle: string;
    date: Date;
    onEdit?: () => void;
    onDelete?: () => void;
}

const ActionsMenu = ({ title, subtitle, date, onEdit, onDelete }: ActionProps) => {
    const [visible, setVisible] = useState(false);
    return (
        <View style={cattleDetails.actionMenu}>
            <View>
                <Text variant='labelSmall'>
                    {subtitle}
                </Text>
                <Text variant='titleMedium'>
                    {title}
                </Text>
                <Text variant='labelMedium'>
                    Próxima dosis: {format(date, "d 'de' MMMM 'de' yyyy", { locale: es })}
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
