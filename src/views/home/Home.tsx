import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { FAB, Text } from "react-native-paper";
import { PaperModal } from "../../components/PaperModal";
import mainStyles from "../../styles/main";
import { LivestockStackParams } from '../../navigation/stacks/LivestockStack';
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type ScreenNavigationProp = NativeStackScreenProps<LivestockStackParams>;

export const HomeView = ({ navigation }: ScreenNavigationProp) => {
  return (
    <View style={mainStyles.container}>
      <Text variant="titleLarge" style={{ color: '#000' }}>Hola papu!</Text>
      <PaperModal content="Hola usuario" btnText="Presioname" />
      <StatusBar style="auto" />
      <FAB
        style={styles.fab}
        size='small'
        icon="plus"
        label='Añadir ganado'
        onPress={() => navigation.navigate('AddCattleStack')}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 8,
    bottom: 8,
  },
});

