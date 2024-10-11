import { CattleProvider } from '@/context/CattleProvider'
import database, { initializeDatabase, resetDatabase } from '@/database'
import seedDatabase from '@/database/seeders/seeder'
import { Navigator } from '@/navigation/Navigator'
import { DatabaseProvider } from '@nozbe/watermelondb/react'
import { NavigationContainer } from '@react-navigation/native'
import { PaperProvider } from 'react-native-paper'
import { es, registerTranslation } from 'react-native-paper-dates'

interface Props {
  children: JSX.Element | JSX.Element[]
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
    <DatabaseProvider database={database}>
      <NavigationContainer>
        <PaperProvider>
          <AppState>
            <Navigator />
          </AppState>
        </PaperProvider>
      </NavigationContainer>
    </DatabaseProvider>
  )
}

const AppState = ({ children }: Props) => {
  return (
    <CattleProvider>
      {children}
    </CattleProvider>
  )
}
