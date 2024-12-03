import CreateFeedDialog, { CREATE_FEED_DIALOG_ID } from '@/components/resources/feeds/CreateFeedDialog'
import DeleteFeedDialog from '@/components/resources/feeds/DeleteFeedDialog'
import EditFeedDialog from '@/components/resources/feeds/EditFeedDialog'
import FeedsList from '@/components/resources/feeds/FeedsList'
import FeedsSnackbarContainer from '@/components/resources/feeds/FeedsSnackbarContainer'
import { FeedProvider } from '@/contexts'
import { useAppDispatch } from '@/hooks/useRedux'
import useScrollFab from '@/hooks/useScrollFab'
import { show } from '@/redux/slices/uiVisibilitySlice'
import { useNavigation } from '@react-navigation/native'
import { StyleSheet, View } from 'react-native'
import { AnimatedFAB, Appbar, useTheme } from 'react-native-paper'

const Feeds = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigation = useNavigation()
  const { onScroll, isFabExtended } = useScrollFab()

  return (
    <>
      <FeedProvider>
        <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
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
        </View>
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

export default Feeds
