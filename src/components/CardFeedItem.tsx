import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface Props {
    feed_id: string;
    name: string;
    quantity: number;
}

export const CardFeedItem = ({ feed_id, name, quantity }: Props) => {
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.8}>
            <Text variant="titleMedium">{name}</Text>
            <View style={styles.infoContainer}>
                <Text variant="bodyMedium">Cantidad: {quantity}</Text>
            </View>
            <Icon source={"dots-vertical"} size={30} />
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
