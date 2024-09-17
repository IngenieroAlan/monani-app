import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { Navigator } from "./src/navigation/Navigator";

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
        <Navigator />
      </PaperProvider>
    </NavigationContainer>
  );
}
