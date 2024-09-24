import React from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { PaperModal } from "../../components/PaperModal";
import mainStyles from "../../styles/main";
export const HomeView = () => {
  return (
    <View style={mainStyles.container}>
      <Text variant="titleLarge" style={{color:'#000'}}>Hola papu!</Text>
      <PaperModal content="Hola usuario" btnText="Presioname" />
      <StatusBar style="auto" />
    </View>
  );
};

