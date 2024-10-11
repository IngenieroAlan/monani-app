import { CattleProvider } from '@/context/CattleProvider'
import database, { initializeDatabase, resetDatabase } from '@/database'
import seedDatabase from '@/database/seeders/seeder'
import { Navigator } from '@/navigation/Navigator'
import { DatabaseProvider } from '@nozbe/watermelondb/react'
import { NavigationContainer } from '@react-navigation/native'
import * as SplashScreen from 'expo-splash-screen'
import { useCallback, useEffect, useState } from 'react'
import { PaperProvider } from 'react-native-paper'
import { es, registerTranslation } from 'react-native-paper-dates'
import { Provider } from 'react-redux'
import { store } from './src/redux/store/store'

interface Props {
  children: JSX.Element | JSX.Element[]
}

const setDatabase = async () => {
  await resetDatabase()
  await initializeDatabase()
  await seedDatabase()
}

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    async function prepare() {
      registerTranslation('es', es)

      await setDatabase()
      setAppIsReady(true)
    }

    prepare()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) await SplashScreen.hideAsync()
  }, [appIsReady])

  if (!appIsReady) return null

  return (
    <Provider store={store}>
      <DatabaseProvider database={database}>
        <NavigationContainer onReady={onLayoutRootView}>
          <PaperProvider>
            <AppState>
              <Navigator />
            </AppState>
          </PaperProvider>
        </NavigationContainer>
      </DatabaseProvider>
    </Provider>
  )
}

const AppState = ({ children }: Props) => {
  return (
    <CattleProvider>
      {children}
    </CattleProvider>
  )
}
