import database, { initializeDatabase, resetDatabase } from '@/database'
import seedDatabase from '@/database/seeders/seeder'
import { Navigator } from '@/navigation/Navigator'
import onBackgroundEventHandler from '@/notifee/eventHandlers/onBackgroundEventHandler'
import { CattleNotificationEventType } from '@/notifee/types'
import useOnForegroundEvent from '@/notifee/useOnForegroundEvent'
import store from '@/redux/store/store'
import useAppTheme, { CustomDarkTheme, CustomLightTheme } from '@/theme'
import notifee, { AndroidImportance, AndroidVisibility, AuthorizationStatus } from '@notifee/react-native'
import { DatabaseProvider } from '@nozbe/watermelondb/react'
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import * as SplashScreen from 'expo-splash-screen'
import { enableMapSet } from 'immer'
import { useCallback, useEffect, useState } from 'react'
import { useColorScheme, View } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { es, registerTranslation } from 'react-native-paper-dates'
import { Provider } from 'react-redux'

const setup = async () => {
  await notifee.cancelAllNotifications()

  await resetDatabase()
  await initializeDatabase()
  await seedDatabase()
}

enableMapSet()
SplashScreen.preventAutoHideAsync()

notifee.onBackgroundEvent(onBackgroundEventHandler)

notifee.createChannel({
  id: 'monani',
  name: 'Monani',
  importance: AndroidImportance.HIGH,
  visibility: AndroidVisibility.PUBLIC
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

export default function App() {
  const scheme = useColorScheme()

  return (
    <Provider store={store}>
      <DatabaseProvider database={database}>
        <NavigationContainer
          theme={scheme === 'dark' ? DarkTheme : DefaultTheme} // To prevent white flashes while navigating.
        >
          <PaperProvider theme={scheme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
            <AppState>
              <Navigator />
            </AppState>
          </PaperProvider>
        </NavigationContainer>
      </DatabaseProvider>
    </Provider>
  )
}

const AppState = ({ children }: { children: JSX.Element }) => {
  const theme = useAppTheme()
  const [appIsReady, setAppIsReady] = useState(false)

  useOnForegroundEvent()

  useEffect(() => {
    async function prepare() {
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
    }

    prepare()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) await SplashScreen.hideAsync()
  }, [appIsReady])

  if (!appIsReady) return null

  return (
    <View
      style={{ backgroundColor: theme.colors.surface, flex: 1 }}
      onLayout={onLayoutRootView}
    >
      {children}
    </View>
  )
}
