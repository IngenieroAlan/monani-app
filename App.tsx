import { NavigationContainer } from '@react-navigation/native'
import { PaperProvider } from 'react-native-paper'
import { es, registerTranslation } from 'react-native-paper-dates'
import { initializeDatabase, resetDatabase } from './src/db'
import seedDatabase from './src/db/seeders/seeder'
import { Navigator } from './src/navigation/Navigator'

const setDatabase = async () => {
  await resetDatabase()
  await initializeDatabase()
  await seedDatabase()
}

export default function App() {
  registerTranslation('es', es)
  // setDatabase()

  return (
    <NavigationContainer>
      <PaperProvider>
        <Navigator />
      </PaperProvider>
    </NavigationContainer>
  )
}
