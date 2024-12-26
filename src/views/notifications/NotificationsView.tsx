import { SurfaceContainer } from '@/components/SurfaceContainer'
import NotificationsAppbar from '@/views/notifications/components/NotificationsAppbar'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet } from 'react-native'
import { NotificationsList } from './components/NotificationsList/NotificationsList'

const NotificationsView = () => {
  return (
    <SurfaceContainer>
      <NotificationsAppbar />
      <StatusBar />
      <NotificationsList />
    </SurfaceContainer>
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
