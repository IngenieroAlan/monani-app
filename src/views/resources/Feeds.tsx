import CreateFeedDialog, { CREATE_FEED_DIALOG_ID } from '@/components/resources/CreateFeedDialog'
import FeedsList from '@/components/resources/FeedsList'
import { hide, reset, show } from '@/redux/slices/uiVisibilitySlice'
import { RootState } from '@/redux/store/store'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { AnimatedFAB, Appbar, Snackbar, useTheme } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'

const Feeds = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const feedInUseVisible = useSelector((state: RootState) => state.uiVisibility['feedInUseSnackbar'])
  const feedStoredVisible = useSelector((state: RootState) => state.uiVisibility['feedStoredSnackbar'])
  const [fetchFeeds, setFetchFeeds] = useState(false) // State lifted up.

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
        <FeedsList
          fetchFeeds={fetchFeeds}
          setFetchFeeds={setFetchFeeds}
        />
        <AnimatedFAB
          style={styles.animatedFab}
          icon='plus'
          label='Añadir'
          extended={true}
          onPress={() => dispatch(show(CREATE_FEED_DIALOG_ID))}
        />
      </View>

      <CreateFeedDialog setFetchFeeds={setFetchFeeds} />
      <Snackbar
        style={styles.snackbar}
        duration={5000}
        visible={feedInUseVisible}
        onDismiss={() => dispatch(hide('feedInUseSnackbar'))}
      >
        El alimento está actualmente en uso.
      </Snackbar>
      <Snackbar
        style={styles.snackbar}
        duration={5000}
        visible={feedStoredVisible}
        onDismiss={() => dispatch(hide('feedStoredSnackbar'))}
      >
        Alimento guardado con éxito.
      </Snackbar>
    </>
  )
}

const styles = StyleSheet.create({
  animatedFab: {
    bottom: 16,
    right: 16
  },
  snackbar: {
    bottom: 78,
    marginHorizontal: 16
  }
})

export default Feeds
