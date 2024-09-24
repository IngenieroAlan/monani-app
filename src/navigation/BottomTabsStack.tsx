import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { FAB, Icon } from 'react-native-paper';
import { HomeView } from '../views/home/Home';
import { MilkProductionView } from '../views/milkProduction/MilkProduction';
import { StyleSheet, View } from 'react-native';
import { type StackNavigation } from "./Navigator";

interface HomeScreenProps {
  navigation: StackNavigation;
}

const Tab = createMaterialBottomTabNavigator();

const BottomTabsStack: React.FC<HomeScreenProps> = ({navigation}) => {

  const handleOnNavigate = () => navigation.navigate("AddCattle");

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator>
        <Tab.Screen
          name="Ganado"
          component={HomeView}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon source="account-group-outline" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Prod.lechera"
          component={MilkProductionView}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon source="train-car" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Ganancias"
          component={HomeView}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon source="bookmark-outline" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Notificaciones"
          component={HomeView}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon source="bell-outline" color={color} size={24} />
            ),
          }}
        />
      </Tab.Navigator>
      <FAB
        style={styles.fab}
        size='small'
        icon="plus"
        label='Añadir ganado'
        onPress={handleOnNavigate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 8,
    bottom: 80,
  },
});

export default BottomTabsStack;
