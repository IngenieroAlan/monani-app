
import DietFeedForm from "@/components/cattle/DietFeedForm";
import DietSettings from "@/components/cattle/DietSettings";
import MedicationForm from "@/components/cattle/MedicationForm";
import { CattleForm } from "@/views/addCattle/CattleForm";
import { Diet } from "@/views/addCattle/Diet";
import { Medications } from "@/views/addCattle/Medications";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { IconButton } from "react-native-paper";

export type AddCattleStackParams = {
    CattleForm: undefined;
    Diet: undefined;
    DietSettings: undefined;
    DietFeedForm: undefined;
    Medications: undefined;
    MedicationsForm: undefined;
}

const Stack = createStackNavigator<AddCattleStackParams>();
const AddCattleStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="CattleForm"
                component={CattleForm}
            />
            <Stack.Screen
                name="Diet"
                component={Diet}
            />

            <Stack.Screen
                name="Medications"
                component={Medications}
            />

            <Stack.Screen
                name="DietFeedForm"
                component={DietFeedForm}
                options={{
                    presentation: "modal",
                }}
            />

            <Stack.Screen
                name="DietSettings"
                options={{
                    presentation: "modal",
                }}
                component={DietSettings}
            />

            <Stack.Screen
                name="MedicationsForm"
                options={{
                    presentation: "modal",
                }}
                component={MedicationForm}
            />

        </Stack.Navigator>
    );
};

export default AddCattleStack;