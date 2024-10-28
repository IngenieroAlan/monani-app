
import React, { memo, ReactNode, useState } from "react";
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
// import { FlatList } from "react-native-gesture-handler";
import { HelperText, List, Searchbar, SearchbarProps, TouchableRipple, useTheme } from "react-native-paper";

// definition of the Item, which will be rendered in the FlatList
const Item = memo((props: SearchBarDataItem & {
  onChange: (...event: any[]) => void,
  setSearchQuery: (query: string) => void,
  setSearchBarFocused: (focused: boolean) => void,
}) => {
  const { title, description, value, onChange, setSearchQuery, setSearchBarFocused } = props
  return (<TouchableRipple
    style={styles.container}
    rippleColor="rgba(0, 0, 0, .32)"
    onPress={() => {
      setSearchQuery(title)
      setSearchBarFocused(false)
      onChange(value)
    }}
  >
    <List.Item
      style={{ paddingVertical: 2, paddingRight: 8 }}
      title={title}
      description={description}
    />
  </TouchableRipple>)
})

export type SearchBarDataItem = {
  id: string;
  title: string;
  description?: string | ReactNode;
  value: any;
}

// interface MSearchBarProps {
//   name: FieldPath<FieldValues>;
//   control: Control<FieldValues>;
//   data: ArrayLike<SearchBarDataItem> | null | undefined;
//   errorMessage: string;
// }
const RenderController = (
  props: Omit<SearchbarProps, 'value'> & {
    onChange: (...event: any[]) => void
    data: ArrayLike<SearchBarDataItem> | null | undefined
    initialQuery?: string,
    maxHeight?: number
  }
) => {
  const theme = useTheme()
  const [searchQuery, setSearchQuery] = useState(props.initialQuery || '')
  const [searchBarFocused, setSearchBarFocused] = useState(false)
  const [activeList, setActiveList] = useState(false)

  const renderItem = ({ item }: { item: SearchBarDataItem }) => {
    // if the searchQuery is empty, return null
    if (searchQuery === "") {
      return null;
    }
    // filter of the name
    if (item.title.toUpperCase().includes(searchQuery.toUpperCase().trim().replace(/\s/g, ""))) {
      return <Item
        id={item.id}
        title={item.title}
        description={item.description}
        value={item.value}
        onChange={props.onChange}
        setSearchQuery={setSearchQuery}
        setSearchBarFocused={setSearchBarFocused}
      />;
    }
    // filter of the description
    // if the description is not null and a string and the description includes the searchQuery
    if (item.description &&
      typeof item.description === 'string' &&
      item.description.toUpperCase().includes(searchQuery.toUpperCase().trim().replace(/\s/g, ""))) {
      return <Item
        id={item.id}
        title={item.title}
        description={item.description}
        value={item.value}
        onChange={props.onChange}
        setSearchQuery={setSearchQuery}
        setSearchBarFocused={setSearchBarFocused}
      />;
    }
    return null;
  }

  return (
    <SafeAreaView>
      <Searchbar
        mode="bar"
        theme={{ roundness: 1 }}
        onChangeText={setSearchQuery}
        value={searchQuery}
        onFocus={() => setSearchBarFocused(true)}
        onBlur={() => activeList ? setSearchBarFocused(false) : setSearchBarFocused(true)}
        {...props}
      />


      {searchBarFocused && (
        <View style={{
          position: "absolute",
          zIndex: 999,
          backgroundColor: theme.colors.surface,
          top: 64,
          width: "100%",
          borderRadius: 10,
          elevation: 5,
          paddingVertical: 8
        }}>
          <View
            onStartShouldSetResponder={() => {
              setSearchBarFocused(false)
              setActiveList(false)
              return true;
            }}
            style={{
              maxHeight: props.maxHeight || 200,
              overflow: "hidden",
            }}
          >
            <FlatList
              data={props.data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      )}
    </SafeAreaView >
  );
};

const MSearchBar = <T extends FieldValues>(
  props: Omit<SearchbarProps, 'value'> & {
    name: FieldPath<T>
    control?: Control<T>
    errroMessage?: string
    data: ArrayLike<SearchBarDataItem> | null | undefined;
    initialQuery?: string,
    maxHeight?: number
  }
) => {
  return (
    <View>
      <Controller
        name={props.name}
        control={props.control}
        render={({ field: { onChange } }) => (
          <RenderController
            onChange={onChange}
            {...props}
          />
        )}
      />
      {props.errroMessage && <HelperText type='error'>{props.errroMessage}</HelperText>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: 'row'
  },
  infoContainer: {
    flex: 1,
  }
});


export default MSearchBar;
