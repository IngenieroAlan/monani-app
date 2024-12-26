import { SurfaceContainer } from '@/components/SurfaceContainer'
import NotificationsAppbar from '@/views/notifications/components/NotificationsAppbar'
import { StatusBar } from 'expo-status-bar'
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
