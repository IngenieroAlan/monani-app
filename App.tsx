import { SurfaceContainer } from '@/components/SurfaceContainer'
import database, { initializeDatabase, resetDatabase } from '@/database'
import seedDatabase from '@/database/seeders/seeder'
import { MainStack } from '@/navigation/MainStack'
import onBackgroundEventHandler from '@/notifee/eventHandlers/onBackgroundEventHandler'
import { CattleNotificationEventType } from '@/notifee/types'
import useOnForegroundEvent from '@/notifee/useOnForegroundEvent'
import store from '@/redux/store/store'
import { CustomDarkTheme, CustomLightTheme } from '@/theme'
import notifee, { AndroidImportance, AuthorizationStatus } from '@notifee/react-native'
import { DatabaseProvider } from '@nozbe/watermelondb/react'
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import * as SplashScreen from 'expo-splash-screen'
import { enableMapSet } from 'immer'
import { useCallback, useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { es, registerTranslation } from 'react-native-paper-dates'
import { Provider } from 'react-redux'

const setup = async () => {
  await notifee.cancelAllNotifications()

  await resetDatabase()
  await initializeDatabase()
  await seedDatabase()
}

dayjs.extend(localeData)

enableMapSet()
SplashScreen.preventAutoHideAsync()

notifee.onBackgroundEvent(onBackgroundEventHandler)

notifee.createChannel({
  id: 'monani',
  name: 'Monani',
  importance: AndroidImportance.HIGH
})
notifee.setNotificationCategories([
  {
    id: 'monani',
    actions: [
      {
        id: CattleNotificationEventType.MARK_AS_READ,
        title: 'Marcar como leído'
      }
    ]
  }
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'always',
      staleTime: Infinity
    },
    mutations: { networkMode: 'always' }
  }
})

export default function App() {
  const scheme = useColorScheme()

  return (
    <Provider store={store}>
      <DatabaseProvider database={database}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer
            theme={scheme === 'dark' ? DarkTheme : DefaultTheme} // To prevent white flashes while navigating.
          >
            <PaperProvider theme={scheme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
              <AppState>
                <MainStack />
              </AppState>
            </PaperProvider>
          </NavigationContainer>
        </QueryClientProvider>
      </DatabaseProvider>
    </Provider>
  )
}

const AppState = ({ children }: { children: JSX.Element }) => {
  const [appIsReady, setAppIsReady] = useState(false)

  useOnForegroundEvent()

  useEffect(() => {
    ;(async () => {
      registerTranslation('es', es)

      await setup()

      const settings = await notifee.getNotificationSettings()
      if (
        settings.authorizationStatus === AuthorizationStatus.DENIED ||
        settings.authorizationStatus < AuthorizationStatus.AUTHORIZED
      ) {
        await notifee.requestPermission()
      }

      setAppIsReady(true)
    })()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) await SplashScreen.hideAsync()
  }, [appIsReady])

  if (!appIsReady) return null

  return <SurfaceContainer onLayout={onLayoutRootView}>{children}</SurfaceContainer>
}
