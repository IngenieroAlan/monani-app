import { NavigationContainer } from '@react-navigation/native'
import { PaperProvider } from 'react-native-paper'
import { es, registerTranslation } from 'react-native-paper-dates'
import { initializeDatabase, resetDatabase } from './src/database'
import seedDatabase from './src/database/seeders/seeder'
import { Navigator } from './src/navigation/Navigator'
import { CattleProvider } from './src/context/CattleProvider'

interface Props {
  children: JSX.Element | JSX.Element[];
}

const setDatabase = async () => {
  await resetDatabase()
  await initializeDatabase()
  await seedDatabase()
}

export default function App() {
  registerTranslation('es', es)
  setDatabase()

  return (
    <NavigationContainer>
      <PaperProvider>
        <AppState>
          <Navigator />
        </AppState>
      </PaperProvider>
    </NavigationContainer>
  )
}

const AppState = ({ children }: Props) => {
  return (
    <CattleProvider>
      {children}
    </CattleProvider>
  );
};
