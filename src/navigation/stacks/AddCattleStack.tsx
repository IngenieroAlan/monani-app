import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Cattle from "../../database/models/Cattle";
import Genealogy from "../../database/models/Genealogy";
import { CattleForm } from '../../views/addCattle/CattleForm';
import { FeedForm } from "../../views/addCattle/FeedForm";

interface AddCattleProps {
    cattle: Partial<Cattle>;
    genealogy: Partial<Genealogy>;
    inQuarantine: boolean;
}

export type AddCattleStackParams = {
    CattleForm: AddCattleProps | undefined;
    FeedForm: AddCattleProps | undefined;
}

const Stack = createStackNavigator<AddCattleStackParams>();

const AddCattleStack = () => {
    return (
        
        <Stack.Navigator>
            <Stack.Screen name="CattleForm" options={{ title: 'Información' }} component={CattleForm} />
            <Stack.Screen
                name="FeedForm"
                options={{
                    title: 'Dieta',
                    headerRight: () => null
                }}
                component={FeedForm} />
        </Stack.Navigator>
    );
};

export default AddCattleStack;