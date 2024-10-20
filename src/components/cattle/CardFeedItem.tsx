import { DietFeed, Feed } from "@/interfaces/cattleInterfaces";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, IconButton, Text } from "react-native-paper";

interface Props {
    dietFeed: DietFeed;
    navigation: any;
}

export const CardFeedItem = ({ dietFeed, navigation }: Props) => {
    // todo: fetch feed from db by id and then memoize it

    // temporal feeds
    const feeds: Feed[] = [
        { feedId: '1', name: "Maiz", feedType: "Alimento" },
        { feedId: '2', name: "Alfalfa", feedType: "Alimento" },
        { feedId: '3', name: "Heno", feedType: "Alimento" },
        { feedId: '4', name: "Meat Builder Mix", feedType: "Concentrado de engorda" },
        { feedId: '5', name: "Efectivo Plus", feedType: "Concentrado lechero" },
    ]

    const feed = feeds.find(f => f.feedId === dietFeed.feedId) as Feed

    return (
        <View style={styles.container}>
            <View>
                <Text variant="labelLarge">{feed.name}</Text>
                <Text variant="bodySmall">{dietFeed.feedAmount} kg.</Text>
            </View>
            <TouchableOpacity activeOpacity={0.8}>
                <IconButton
                    icon={"dots-vertical"}
                    size={24}
                    onPress={() => navigation.navigate('FeedFormDialog', { feed, dietFeed })}
                    style={{ margin: 0 }}
                />
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        width: "100%",
        justifyContent: 'space-between',
        marginVertical: 5,
        flexDirection: 'row'
    },
    infoContainer: {
        flex: 1,
    }
});
