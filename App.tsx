import { PaperProvider } from "react-native-paper";
import { HomeView } from "./src/views/Home";

export default function App() {
  return (
    <PaperProvider>
      <HomeView/>
    </PaperProvider>
  );
}