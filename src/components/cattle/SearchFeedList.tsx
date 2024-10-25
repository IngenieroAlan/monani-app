import { Feed } from "@/interfaces/cattleInterfaces";
import React from "react";
import { Control, Controller, FieldError, FieldPath, FieldValues } from "react-hook-form";
import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View, ViewProps } from "react-native";
import { HelperText, Text, useTheme } from "react-native-paper";

// definition of the Item, which will be rendered in the FlatList
const FeedItem = (
    { feedId, name, feedType, onChange }: { feedId: string; name: string; feedType: string; onChange: (feedId: string) => () => string }
) => (
    <TouchableOpacity activeOpacity={0.8} onPress={onChange(feedId)}>
        <View style={{ margin: 10 }}>
            <Text variant="bodyMedium">{name}</Text>
            <Text variant="labelSmall">{feedType}</Text>
        </View>
    </TouchableOpacity>
);

//The filter
interface ListProps<T extends FieldValues> {
    searchPhrase: string;
    setClicked: (clicked: boolean) => void;
    data: Feed[];

    label: string;
    helperText: string;
    control: Control<T>;
    name: FieldPath<T>;
    errors: FieldError | undefined;
    containerStyle?: ViewProps;
}
const SearchFeedList = <T extends FieldValues>({
    searchPhrase,
    setClicked,
    data,
    name,
    errors,
    helperText,
    control
}: ListProps<T>) => {
    // onChange function
    const onChange = (value: string) => () => {
        setClicked(true);
        return value;
    };

    const renderItem = ({ item }: { item: Feed }) => {
        // if the searchPhrase is empty, return null
        if (searchPhrase === "") {
            return null;
        }
        // filter of the name
        if (item.name.toUpperCase().includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ""))) {
            return <FeedItem feedId={item.feedId} name={item.name} feedType={item.feedType} onChange={onChange} />;
        }
        // filter of the description
        if (item.feedType.toUpperCase().includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ""))) {
            return <FeedItem feedId={item.feedId} name={item.name} feedType={item.feedType} onChange={onChange} />;
        }
        return null;
    };

    const theme = useTheme();
    console.log(data);
    
    return (
        <SafeAreaView style={{ width: '100%', flex: 1 }}>
            <View
                onStartShouldSetResponder={() => {
                    setClicked(false);
                    return false;
                }}
            >
                <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item.feedId} />
            </View>

            {/* <Controller
                    name={name}
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View
                            onStartShouldSetResponder={() => {
                                onChange(value);
                                setClicked(false);
                                return false;
                            }}
                        >
                        </View>
                    )}
                />
                {
                    errors && <HelperText type="error">
                        {helperText}
                    </HelperText>
                } */}
        </SafeAreaView >
    );
};

export default SearchFeedList;
