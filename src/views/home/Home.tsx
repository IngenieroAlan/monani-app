import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { FAB, Text } from "react-native-paper";
import { PaperModal } from "../../components/PaperModal";
import mainStyles from "../../styles/main";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { LivestockStackParams } from '../../navigation/stacks/LivestockStack';

type ScreenNavigationProp = StackNavigationProp<LivestockStackParams>;

export const HomeView = () => {
  const navigator = useNavigation<ScreenNavigationProp>();
  const handleOnNavigate = () => navigator.navigate('AddCattleView');
  return (
    <View style={mainStyles.container}>
      <Text variant="titleLarge" style={{color:'#000'}}>Hola papu!</Text>
      <PaperModal content="Hola usuario" btnText="Presioname" />
      <StatusBar style="auto" />
      <FAB
        style={styles.fab}
        size='small'
        icon="plus"
        label='Añadir ganado'
        onPress={handleOnNavigate}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 8,
    bottom: 80,
  },
});

