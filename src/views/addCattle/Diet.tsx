import DietFeedList from '@/components/addCattle/DietFeedList'
import DismissDialog from '@/components/DismissDialog'
import { HomeSnackbarId } from '@/views/home/components/HomeSnackbarContainer'
import DietSnackbarContainer from '@/components/layout/cattleDetails/Components/dietFeed/DietSnackbarContainer'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { AddCattleStackParamsList, BottomTabsParamList } from '@/navigation/types'
import { reset } from '@/redux/slices/addCattleSlice'
import { show } from '@/redux/slices/uiVisibilitySlice'
import { RootState } from '@/redux/store/store'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useCallback, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Appbar, Button, List, useTheme } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export type AddDietNavigationProps = NativeStackScreenProps<AddCattleStackParamsList & BottomTabsParamList, 'Diet'>
const DISMISS_DIALOG_ID = 'createCattleDismissDialog'

export const Diet = ({ navigation }: AddDietNavigationProps) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { dietFeeds, diet } = useAppSelector((state: RootState) => state.addCattle)
  const [isValid, setIsValid] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    if (diet.matterProportion === undefined || diet.waterAmount === undefined || dietFeeds.length === 0) {
      setIsValid(false)
      return
    }
    if (dietFeeds.length > 0 && diet.matterProportion === 'Sin definir') {
      setIsValid(true)
      return
    }
    if (dietFeeds.length > 0) {
      setIsValid(totalAmount === diet.matterAmount)
    }
  }, [dietFeeds, diet, totalAmount])

  useEffect(() => {
    setTotalAmount(dietFeeds.reduce((acc, dietFeed) => acc + parseFloat(dietFeed.feedAmount.toString()), 0))
  }, [dietFeeds, diet])

  const goBack = useCallback(() => {
    dispatch(reset())
    navigation.navigate('Ganado')
  }, [dispatch, navigation])

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => dispatch(show(DISMISS_DIALOG_ID))} />
        <Appbar.Content title='Dieta' />
        <Appbar.Action
          icon='plus'
          onPress={() => navigation.navigate('DietFeed')}
        />
        <Appbar.Action
          icon='cog'
          onPress={() => navigation.navigate('DietSettings')}
        />
      </Appbar.Header>

      <SafeAreaProvider style={{ backgroundColor: theme.colors.surface }}>
        {diet.matterProportion !== 'Sin definir' && (
          <List.Subheader>
            {totalAmount}kg. en alimentos de {diet.matterAmount}kg.{' '}
          </List.Subheader>
        )}
        <DietFeedList dietFeeds={dietFeeds} />
        <View style={styles.navigationButtons}>
          <Button
            icon='arrow-left'
            mode='elevated'
            onPress={() => navigation.goBack()}
          >
            Atras
          </Button>
          <Button
            icon='arrow-right'
            mode='elevated'
            disabled={!isValid}
            onPress={() => navigation.navigate('Medications')}
          >
            Siguiente
          </Button>
        </View>
        <DismissDialog
          id={DISMISS_DIALOG_ID}
          dismissSnackbarId={HomeSnackbarId.CREATE_CATTLE_DISMISS}
          onConfirm={goBack}
        />
      </SafeAreaProvider>
      <DietSnackbarContainer />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 10
  },
  navigationButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    gap: 10,
    padding: 16
  }
})
