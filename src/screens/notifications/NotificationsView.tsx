import { SurfaceContainer } from '@/components/SurfaceContainer'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import NotificationsAppbar from './components/NotificationsAppbar'
import { NotificationsList } from './components/NotificationsList/NotificationsList'

const NotificationsView = () => {
  return (
    <SurfaceContainer Component={SafeAreaView}>
      <NotificationsAppbar />
      <StatusBar />
      <NotificationsList />
    </SurfaceContainer>
  )
}

export default NotificationsView
