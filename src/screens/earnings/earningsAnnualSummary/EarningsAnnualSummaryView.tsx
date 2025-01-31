import { SurfaceContainer } from '@/components/SurfaceContainer'
import { useAppDispatch } from '@/hooks/useRedux'
import { MainStackParamList } from '@/navigation/types'
import { setYear } from '@/redux/slices/collections/earningsQuerySlice'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { View } from 'react-native'
import { Appbar, Divider, Portal } from 'react-native-paper'
import AnnualEarningsCard from './components/AnnualEarningsCard'
import ExpandableEarningsList, { ANNUAL_EARNINGS_LIST_ID } from './components/ExpandableEarningsList'

type ScreenProps = NativeStackScreenProps<MainStackParamList, 'EarningsAnnualSummaryView'>

const EarningsAnnualSummaryView = ({ route, navigation }: ScreenProps) => {
  const dispatch = useAppDispatch()
  const { year, totalEarnings, totalCattleEarnings, totalMilkEarnings, difference } = route.params

  useEffect(() => {
    dispatch(setYear({ listId: ANNUAL_EARNINGS_LIST_ID, year }))
  }, [])

  return (
    <Portal.Host>
      <SurfaceContainer>
        <StatusBar />
        <Appbar.Header>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title={`Ganancias en ${year}`} />
        </Appbar.Header>
        <View style={{ flex: 1 }}>
          <View style={{ padding: 16 }}>
            <AnnualEarningsCard
              totalEarnings={totalEarnings}
              totalCattleEarnings={totalCattleEarnings}
              totalMilkEarnings={totalMilkEarnings}
              difference={difference}
            />
          </View>
          <Divider />
          <ExpandableEarningsList />
        </View>
      </SurfaceContainer>
    </Portal.Host>
  )
}

export default EarningsAnnualSummaryView
