import CreateFeedDialog, { CREATE_FEED_DIALOG_ID } from '@/components/resources/feeds/CreateFeedDialog'
import DeleteFeedDialog from '@/components/resources/feeds/DeleteFeedDialog'
import EditFeedDialog from '@/components/resources/feeds/EditFeedDialog'
import FeedsList from '@/components/resources/feeds/FeedsList'
import ResourcesSnackbarContainer from '@/components/resources/feeds/ResourcesSnackbarContainer'
import { useAppDispatch } from '@/hooks/useRedux'
import useScrollFab from '@/hooks/useScrollFab'
import { reset, show } from '@/redux/slices/uiVisibilitySlice'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { AnimatedFAB, Appbar, useTheme } from 'react-native-paper'

const Feeds = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigation = useNavigation()
  const flatListRef = useRef<FlatList>(null)
  const { onScroll, isFabExtended } = useScrollFab()

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
          ref={flatListRef}
          onScroll={onScroll}
        />
        <AnimatedFAB
          style={styles.animatedFab}
          icon='plus'
          label='Añadir'
          extended={isFabExtended}
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
