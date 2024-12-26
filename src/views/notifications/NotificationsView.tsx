import useAppTheme from '@/theme'
import NotificationsAppbar from '@/views/notifications/components/NotificationsAppbar'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NotificationsList } from './components/NotificationsList/NotificationsList'

const NotificationsView = () => {
  const theme = useAppTheme()

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <NotificationsAppbar />
      <StatusBar />
      <NotificationsList />
    </SafeAreaView>
  )
}

export default NotificationsView

const styles = StyleSheet.create({
  notificationsEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  }
})
