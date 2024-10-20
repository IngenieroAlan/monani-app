import { FeedProportion } from "@/database/models/DietFeed";
import { Feed } from "@/interfaces/cattleInterfaces";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Searchbar, TextInput, useTheme } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import FeedList from "./FeedList";

export default function FeedFormDialog() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchBarFocused, setSearchBarFocused] = useState(false);
    const [feed, setFeed] = useState<Feed | null>(null);
    const [feedProportion, setFeedProportion] = useState<FeedProportion>('Por porcentaje');
    const [amount, setAmount] = useState<string>('');
    const theme = useTheme();

    // temporal feeds
    const feeds: Feed[] = [
        { feedId: '1', name: "Maiz", feedType: "Alimento" },
        { feedId: '2', name: "Alfalfa", feedType: "Alimento" },
        { feedId: '3', name: "Heno", feedType: "Alimento" },
        { feedId: '4', name: "Meat Builder Mix", feedType: "Concentrado de engorda" },
        { feedId: '5', name: "Efectivo Plus", feedType: "Concentrado lechero" },
    ]



    return (
        
        <ScrollView style={{ padding: 16, gap: 10, flex: 1 }}>
            <Searchbar
                placeholder="Alimento"
                mode="view"
                onChangeText={setSearchQuery}
                value={searchQuery}
                onFocus={() => setSearchBarFocused(true)}
                onBlur={() => setSearchBarFocused(false)}
            />

            {searchBarFocused && (
                <View style={{
                    position: "absolute",
                    zIndex: 1,
                    backgroundColor: theme.colors.surface,
                    margin: 16,
                    top: 76,
                    width: "100%",
                }}>
                    <FeedList searchPhrase={searchQuery} data={feeds} setClicked={() => { }} />
                </View>
            )}

            <Dropdown
                label="Proporción"
                placeholder="Select Gender"
                mode="outlined"
                options={[
                    { label: 'Por porcentaje', value: 'Por porcentaje' },
                    { label: 'Fija', value: 'Fija' },
                ]}
                value={feedProportion}
                onSelect={(value) => setFeedProportion(value as FeedProportion)}
            />

            <TextInput
                label="Cantidad"
                mode="outlined"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
            />

        </ScrollView>
    )
}