
import Feed from "@/database/models/Feed";
import useFeeds from "@/hooks/collections/useFeeds";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setFeeds } from "@/redux/slices/feedsSlice";
import { RootState } from "@/redux/store/store";
import DietFeedSchema from "@/validationSchemas/DietFeedSchema";
import React, { memo, useEffect } from "react";
import { Control, Controller, FieldError, FieldPath, FieldValues } from "react-hook-form";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { HelperText, List, TouchableRipple, useTheme } from "react-native-paper";
import { z } from "zod";

// definition of the Item, which will be rendered in the FlatList
const FeedItem = memo((
    { feedId, name, feedType, onChange, setSearchQuery, setSearchBarFocused }: {
        feedId: string;
        name: string;
        feedType: string;
        onChange: (...event: any[]) => void
        setSearchQuery: (query: string) => void,
        setSearchBarFocused: (focused: boolean) => void
    }
) => (
    <TouchableRipple
        style={styles.container}
        rippleColor="rgba(0, 0, 0, .32)"
        onPress={() => {
            setSearchQuery(name)
            setSearchBarFocused(false)
            onChange(feedId)
        }}
    >
        <List.Item
            style={{ paddingVertical: 2, paddingRight: 8 }}
            title={name}
            description={feedType}
        />
    </TouchableRipple>
))

type DietFeedFields = z.infer<typeof DietFeedSchema>
interface ListProps<T extends FieldValues> {
    searchPhrase: string;
    setClicked: (clicked: boolean) => void;
    setSearchQuery: (query: string) => void;
    setSearchBarFocused: (focused: boolean) => void;
    name: FieldPath<DietFeedFields>;
    errors: FieldError | undefined;
    helperText: string;
    control: Control<DietFeedFields>;
}
const SearchFeedList = <T extends FieldValues>({
    searchPhrase,
    setClicked,
    setSearchQuery,
    setSearchBarFocused,
    name,
    errors,
    helperText,
    control
}: ListProps<T>) => {
    const feeds = useAppSelector((state: RootState) => state.feeds.records)
    const { getFeeds } = useFeeds()
    const dispatch = useAppDispatch()

    useEffect(() => {
        const fetchFeeds = async () => {
            dispatch(setFeeds(await getFeeds()))
        }

        if (feeds.length === 0) fetchFeeds()
    }, [feeds])

    const renderItem = (
        { item, onChange }: {
            item: Feed, onChange: (...event: any[]) => void
        },
    ) => {
        // if the searchPhrase is empty, return null
        if (searchPhrase === "") {
            return null;
        }
        // filter of the name
        if (item.name.toUpperCase().includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ""))) {
            return <FeedItem
                feedId={item.id}
                name={item.name}
                feedType={item.feedType}
                onChange={onChange}
                setSearchQuery={setSearchQuery}
                setSearchBarFocused={setSearchBarFocused}
            />;
        }
        // filter of the description
        if (item.feedType.toUpperCase().includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ""))) {
            return <FeedItem
                feedId={item.id}
                name={item.name}
                feedType={item.feedType}
                onChange={onChange}
                setSearchQuery={setSearchQuery}
                setSearchBarFocused={setSearchBarFocused}
            />;
        }
        return null;
    };

    const theme = useTheme();

    return (
        <SafeAreaView>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value } }) => {
                    return (
                        <View
                            onStartShouldSetResponder={() => {
                                setClicked(false);
                                return false;
                            }}
                        >
                            <FlatList data={feeds} renderItem={({ item }) => renderItem({ item, onChange })} keyExtractor={(item) => item.id} />
                        </View>
                    )
                }}
            />

            {
                errors && <HelperText type="error">
                    {helperText}
                </HelperText>
            }
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: 'row'
    },
    infoContainer: {
        flex: 1,
    }
});


export default memo(SearchFeedList);
