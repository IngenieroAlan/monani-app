import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { Navigator } from "./src/navigation/Navigator";
import { es, registerTranslation } from 'react-native-paper-dates'

export default function App() {
  registerTranslation('es', es)
  return (
    <NavigationContainer>
      <PaperProvider>
        <Navigator />
      </PaperProvider>
    </NavigationContainer>
  );
}
