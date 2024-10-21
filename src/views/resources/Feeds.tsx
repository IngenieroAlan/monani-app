import CreateFeedDialog, { CREATE_FEED_DIALOG_ID } from '@/components/resources/CreateFeedDialog'
import FeedsList from '@/components/resources/FeedsList'
import ResourcesSnackbarContainer from '@/components/resources/ResourcesSnackbarContainer'
import { reset, show } from '@/redux/slices/uiVisibilitySlice'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { AnimatedFAB, Appbar, useTheme } from 'react-native-paper'
import { useDispatch } from 'react-redux'

const Feeds = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigation = useNavigation()
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
