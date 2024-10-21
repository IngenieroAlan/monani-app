import CreateFeedDialog, { CREATE_FEED_DIALOG_ID } from '@/components/resources/CreateFeedDialog'
import DeleteFeedDialog from '@/components/resources/DeleteFeedDialog'
import EditFeedDialog from '@/components/resources/EditFeedDialog'
import FeedsList from '@/components/resources/FeedsList'
import ResourcesSnackbarContainer from '@/components/resources/ResourcesSnackbarContainer'
import { useAppDispatch } from '@/hooks/useRedux'
import { reset, show } from '@/redux/slices/uiVisibilitySlice'
import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { AnimatedFAB, Appbar, useTheme } from 'react-native-paper'

const Feeds = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => dispatch(reset()))

    return unsubscribe
  }, [navigation])

  return (
    <>
      <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
        <Appbar.Header>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title='Alimentos' />
        </Appbar.Header>
        <FeedsList />
        <AnimatedFAB
          style={styles.animatedFab}
          icon='plus'
          label='Añadir'
          extended={true}
          onPress={() => dispatch(show(CREATE_FEED_DIALOG_ID))}
        />
      </View>

      <CreateFeedDialog />
      <EditFeedDialog />
      <DeleteFeedDialog />

      <ResourcesSnackbarContainer />
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
