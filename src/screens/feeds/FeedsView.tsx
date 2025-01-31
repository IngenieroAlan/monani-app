import { SurfaceContainer } from '@/components/SurfaceContainer'
import { FeedProvider } from '@/contexts'
import { useAppDispatch } from '@/hooks/useRedux'
import useScrollFab from '@/hooks/useScrollFab'
import { show } from '@/redux/slices/uiVisibilitySlice'
import CreateFeedDialog, { CREATE_FEED_DIALOG_ID } from '@/screens/feeds/components/CreateFeedDialog'
import DeleteFeedDialog from '@/screens/feeds/components/DeleteFeedDialog'
import EditFeedDialog from '@/screens/feeds/components/EditFeedDialog'
import FeedsSnackbarContainer from '@/screens/feeds/components/FeedsSnackbarContainer'
import { useNavigation } from '@react-navigation/native'
import { StyleSheet } from 'react-native'
import { AnimatedFAB, Appbar } from 'react-native-paper'
import { FeedsList } from './components/FeedsList/FeedsList'

const List = () => {
  const dispatch = useAppDispatch()
  const { onScroll, isFabExtended } = useScrollFab()

  return (
    <>
      <FeedsList flashListProps={{ onScroll }} />
      <AnimatedFAB
        style={styles.animatedFab}
        icon='plus'
        label='Añadir'
        extended={isFabExtended}
        onPress={() => dispatch(show(CREATE_FEED_DIALOG_ID))}
      />
    </>
  )
}

const FeedsView = () => {
  const navigation = useNavigation()

  return (
    <>
      <FeedProvider>
        <SurfaceContainer>
          <Appbar.Header>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title='Alimentos' />
          </Appbar.Header>
          <List />
        </SurfaceContainer>
        <EditFeedDialog />
        <DeleteFeedDialog />
      </FeedProvider>
      <CreateFeedDialog />
      <FeedsSnackbarContainer />
    </>
  )
}

const styles = StyleSheet.create({
  animatedFab: {
    bottom: 16,
    right: 16
  }
})

export default FeedsView
