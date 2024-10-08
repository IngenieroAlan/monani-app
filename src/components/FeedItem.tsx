import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface Props {
    milkAverage: number;
    totalMilk: number;
    date: string;
    updateMilk?: number;
}

export const MilkProductionItem = ({
    updateMilk,
    totalMilk,
    milkAverage,
    date,
}: Props) => {
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.8}>
            <View style={styles.infoContainer}>
                <Text variant="labelSmall" style={{ color: "#49454F" }}>
                    {milkAverage} L. Promedio por vaca
                </Text>
                <Text variant="bodyLarge" style={{ color: "#1D1B20" }}>
                    {totalMilk} L.
                </Text>
                {updateMilk && updateMilk != 0 && (
                    <Text
                        variant="bodyMedium"
                        style={{ color: updateMilk > 0 ? "#4FA96E" : "#B3261E" }}
                    >
                        {updateMilk} L.
                    </Text>
                )}
            </View>
            <View style={[styles.infoContainer, { alignItems: 'flex-end' }]}>
                <View style={{ flexDirection: 'row' }}>
                    <Text variant="labelSmall" style={{ color: "#49454F" }}>
                        {date}
                    </Text>
                    <Icon source="menu-right" color={'#49454F'} size={24} />
                </View>
            </View>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 5,

        flexDirection: 'row'
    },
    infoContainer: {
        flex: 1,
    }
});
