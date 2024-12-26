import { SurfaceContainer } from '@/components/SurfaceContainer'
import { FeedProvider } from '@/contexts'
import { useAppDispatch } from '@/hooks/useRedux'
import useScrollFab from '@/hooks/useScrollFab'
import { show } from '@/redux/slices/uiVisibilitySlice'
import CreateFeedDialog, { CREATE_FEED_DIALOG_ID } from '@/views/feeds/components/CreateFeedDialog'
import DeleteFeedDialog from '@/views/feeds/components/DeleteFeedDialog'
import EditFeedDialog from '@/views/feeds/components/EditFeedDialog'
import FeedsList from '@/views/feeds/components/FeedsList'
import FeedsSnackbarContainer from '@/views/feeds/components/FeedsSnackbarContainer'
import { useNavigation } from '@react-navigation/native'
import { StyleSheet } from 'react-native'
import { AnimatedFAB, Appbar } from 'react-native-paper'

const FeedsView = () => {
  const dispatch = useAppDispatch()
  const navigation = useNavigation()
  const { onScroll, isFabExtended } = useScrollFab()

  return (
    <>
      <FeedProvider>
        <SurfaceContainer>
          <Appbar.Header>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title='Alimentos' />
          </Appbar.Header>
          <FeedsList onScroll={onScroll} />
          <AnimatedFAB
            style={styles.animatedFab}
            icon='plus'
            label='Añadir'
            extended={isFabExtended}
            onPress={() => dispatch(show(CREATE_FEED_DIALOG_ID))}
          />
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
