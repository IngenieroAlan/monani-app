import { Feed } from "@/interfaces/cattleInterfaces";
import React from "react";
import { Control, Controller, FieldError, FieldPath, FieldValues } from "react-hook-form";
import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View, ViewProps } from "react-native";
import { HelperText, Text, useTheme } from "react-native-paper";

// definition of the Item, which will be rendered in the FlatList
type TonChange = (feedId: string) => () => void

const FeedItem = (
    { feedId, name, feedType, onChange }: { feedId: string; name: string; feedType: string; onChange: TonChange }
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
    control,
    containerStyle,
}: ListProps<T>) => {
    const renderItem = ({ item, onChange }: { item: Feed; onChange: TonChange }) => {
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
    return (
        <SafeAreaView style={{
            position: "absolute",
            zIndex: 1,
            backgroundColor: theme.colors.surface,
            margin: 16,
            top: 68,
            width: "100%",
        }}>
            <View style={containerStyle}>
                <Controller
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
                            <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item.feedId} />
                        </View>
                    )}
                />
                {
                    errors && <HelperText type="error">
                        {helperText}
                    </HelperText>
                }

            </View>
        </SafeAreaView >
    );
};

export default SearchFeedList;
