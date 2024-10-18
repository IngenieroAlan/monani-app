import BackButton from "@/components/cattle/BackButton";
import FeedFormDialog from "@/components/cattle/FeedFormDialog";
import { CattleForm } from "@/views/addCattle/CattleForm";
import { FeedForm } from "@/views/addCattle/FeedForm";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import Cattle from "../../database/models/Cattle";
import Genealogy from "../../database/models/Genealogy";
import ButtonSaveFeed from "@/components/cattle/ButtonSaveFeed";
import ButtonFeedSettingsDialog from "@/components/cattle/ButtonFeedSettingsDialog";
import ButtonSaveSettings from "@/components/cattle/ButtonSaveSettings";
import { MedicationsForm } from "@/views/addCattle/MedicationsForm";
import MedicationsFormDialog from "@/components/cattle/MedicationFormDialog";
import ButtonSaveMedication from "@/components/cattle/ButtonSaveMedication";


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
    MedicationsForm: undefined;
    MedicationsFormDialog: undefined;
}

const Stack = createStackNavigator<AddCattleStackParams>();
type Prop = NativeStackScreenProps<AddCattleStackParams>;

const AddCattleStack = ({ navigation, route }: Prop) => {
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
    };

    const ButtonAddMedication = () => {
        return (
            <TouchableOpacity activeOpacity={0.8}>
                <IconButton
                    icon="plus"
                    size={24}
                    onPress={() => navigation.navigate('MedicationsFormDialog')}
                />
            </TouchableOpacity>
        );
    };


    return (
        <Stack.Navigator>
            <Stack.Screen
                name="CattleForm"
                options={{
                    title: 'Información',
                    headerLeft: () => <BackButton />,
                }}
                component={CattleForm}
            />
            <Stack.Screen
                name="FeedForm"
                options={{
                    title: 'Dieta',
                    headerLeft: () => <BackButton />,
                    headerRight: () => (<View style={{ display: "flex", flexDirection: "row" }}>
                        <ButtonAddFeed />
                        <ButtonFeedSettingsDialog />
                    </View>)
                }}
                component={FeedForm}
            />

            <Stack.Screen
                name="MedicationsForm"
                options={{
                    title: 'Medicación',
                    headerLeft: () => <BackButton />,
                    headerRight: () => <ButtonAddMedication />
                }}
                component={MedicationsForm}
            />

            <Stack.Screen
                name="FeedFormDialog"
                options={{
                    title: 'Agregar alimento',
                    presentation: "modal",
                    headerBackImage: () =>
                        <IconButton
                            icon="close"
                            size={24}
                        />,
                    headerRight: () => <ButtonSaveFeed />
                }}
                component={FeedFormDialog}
            />

            <Stack.Screen
                name="FeedSettingsDialog"
                options={{
                    title: 'Ajustes de proporciones',
                    presentation: "modal",
                    headerBackImage: () =>
                        <IconButton
                            icon="close"
                            size={24}
                        />,
                    headerRight: () => <ButtonSaveSettings />
                }}
                component={FeedFormDialog}
            />

            <Stack.Screen
                name="MedicationsFormDialog"
                options={{
                    title: 'Agregar Medicación',
                    presentation: "modal",
                    headerBackImage: () =>
                        <IconButton
                            icon="close"
                            size={24}
                        />,
                    headerRight: () => <ButtonSaveMedication />
                }}
                component={MedicationsFormDialog}
            />

        </Stack.Navigator>
    );
};

export default AddCattleStack;