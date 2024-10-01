import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { Icon } from 'react-native-paper';
import { HomeView } from '../views/home/Home';
import { MilkProductionView } from '../views/milkProduction/MilkProduction';
import { createStackNavigator } from '@react-navigation/stack';
import { AddCattleView } from '../views/addCattle/addCattle';

const Tab = createStackNavigator();

const BottomTabsStack: React.FC = ({  }) => {

    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Agregar ganado"
                component={AddCattleView}
                
            />
        </Tab.Navigator>
    );
}

export default BottomTabsStack;
