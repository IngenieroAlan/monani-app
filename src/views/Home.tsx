import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { PaperModal } from "../components/paperModal";
export const HomeView = () => {
  return (
    <View style={styles.container}>
      <Text variant="titleLarge" theme={{colors:{primary:'black'}}} style={{color:'#000'}}>Hola papu!</Text>
      <PaperModal content="Hola usuario" btnText="Presioname" />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
