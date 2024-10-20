import { Feed } from "@/interfaces/cattleInterfaces";
import React from "react";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

// definition of the Item, which will be rendered in the FlatList
const FeedItem = ({ name, feedType }: Feed) => (
    <View style={{ margin: 10 }}>
        <Text variant="bodyMedium">{name}</Text>
        <Text variant="labelSmall">{feedType}</Text>
    </View>
);

//The filter
interface ListProps {
    searchPhrase: string;
    setClicked: (clicked: boolean) => void;
    data: Feed[];
}
const FeedList = ({ searchPhrase, setClicked, data }: ListProps) => {
    const renderItem = ({ item }: { item: Feed }) => {
        // if the searchPhrase is empty, return null
        if (searchPhrase === "") {
            return null;
        }
        // filter of the name
        if (item.name.toUpperCase().includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ""))) {
            return <FeedItem feedId={item.feedId} name={item.name} feedType={item.feedType} />;
        }
        // filter of the description
        if (item.feedType.toUpperCase().includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ""))) {
            return <FeedItem feedId={item.feedId} name={item.name} feedType={item.feedType} />;
        }
        return null;
    };

    const theme = useTheme();
    return (
        <SafeAreaView style={{ width: '100%', flex: 1 }}>
            <View
                onStartShouldSetResponder={() => {
                    setClicked(false);
                    return true;
                }}>
                <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item.feedId} />
            </View>
        </SafeAreaView>
    );
};

export default FeedList;
