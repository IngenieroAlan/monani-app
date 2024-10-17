import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Cattle from "../../database/models/Cattle";
import Genealogy from "../../database/models/Genealogy";
import ButtonFeedSettingsDialog from "@/components/cattle/ButtonFeedSettingsDialog";
import { IconButton, Text } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParams } from "../Navigator";
import { CattleForm } from "@/views/addCattle/CattleForm";
import { FeedForm } from "@/views/addCattle/FeedForm";
import { TouchableOpacity, View } from "react-native";
import FeedFormDialog from "@/components/cattle/FeedFormDialog";


interface AddCattleProps {
    cattle: Partial<Cattle>;
    genealogy: Partial<Genealogy>;
    inQuarantine: boolean;
}

export type AddCattleStackParams = {
    CattleForm: AddCattleProps | undefined;
    FeedForm: AddCattleProps | undefined;
    FeedSettingsDialog: undefined;
    FeedFormDialog: undefined;
}

const Stack = createStackNavigator<AddCattleStackParams>();
type StackParams = RootStackParams & AddCattleStackParams;
type Prop = NativeStackScreenProps<StackParams>;

const AddCattleStack = ({ navigation }: Prop) => {

    const BackButton = () => {
        const goHome = () => {
            // todo: clear data with cattleReducer
            navigation.navigate('HomeView')
        }
        return (
            <IconButton
                icon="arrow-left"
                size={24}
                onPress={goHome}
            />
        );
    }

    const ButtonAddFeed = () => {
        return (
            <TouchableOpacity activeOpacity={0.8}>
                <IconButton
                    icon="plus"
                    size={24}
                    onPress={() => navigation.navigate('FeedFormDialog')}
                />
            </TouchableOpacity>
        );
    }

    const SaveFeed = () => {
        // todo: save feed to db or with cattleReducer
        return (
            <TouchableOpacity activeOpacity={0.8}>
                <Text>Guardar</Text>
            </TouchableOpacity>
        )
    }

    return (
        <Stack.Navigator>
            <Stack.Screen name="CattleForm" options={{
                title: 'Información',
                headerLeft: () => BackButton(),
            }} component={CattleForm} />
            <Stack.Screen
                name="FeedForm"
                options={{
                    title: 'Dieta',
                    headerLeft: () => BackButton(),
                    headerRight: () => (<View style={{ display: "flex", flexDirection: "row" }}>
                        <ButtonAddFeed />
                        <ButtonFeedSettingsDialog />
                    </View>)
                }}
                component={FeedForm} />

            <Stack.Screen name="FeedFormDialog" options={{
                title: 'Agregar alimento',
                presentation: "modal",
                headerLeft: () =>
                    <IconButton
                        icon="close"
                        size={24}
                    />,
                headerRight: () => <SaveFeed />
            }} component={FeedFormDialog} />

        </Stack.Navigator>
    );
};

export default AddCattleStack;