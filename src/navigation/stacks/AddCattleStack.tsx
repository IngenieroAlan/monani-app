import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Cattle from "../../db/model/Cattle";
import Genealogy from "../../db/model/Genealogy";
import { CattleForm } from '../../views/addCattle/CattleForm';
import { FeedForm } from "../../views/addCattle/FeedForm";

interface AddCattleProps {
    cattle: Partial<Cattle>;
    genealogy: Partial<Genealogy>;
    inQuarantine: boolean;
}

export type AddCattleStackParams = {
    CattleForm: AddCattleProps | undefined;
    FeedForm: AddCattleProps;
}

const Stack = createStackNavigator<AddCattleStackParams>();

const AddCattleStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="CattleForm" options={{ title: 'Información' }} component={CattleForm} />
            <Stack.Screen name="FeedForm" options={{ title: 'Dieta' }} component={FeedForm} />
        </Stack.Navigator>
    );
};

export default AddCattleStack;
