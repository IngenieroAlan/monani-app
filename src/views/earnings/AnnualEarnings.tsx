import AnnualEarningsCard from '@/components/earnings/annualEarnings/AnnualEarningsCard'
import ExpandableEarningsList, {
  ANNUAL_EARNINGS_LIST_ID
} from '@/components/earnings/annualEarnings/ExpandableEarningsList'
import { useAppDispatch } from '@/hooks/useRedux'
import { RootStackParamList } from '@/navigation/types'
import { setYear } from '@/redux/slices/collections/earningsQuerySlice'
import useAppTheme from '@/theme'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { View } from 'react-native'
import { Appbar, Divider, Portal } from 'react-native-paper'

type ScreenProps = NativeStackScreenProps<RootStackParamList, 'AnnualEarningsView'>

const AnnualEarningsView = ({ route, navigation }: ScreenProps) => {
  const theme = useAppTheme()
  const dispatch = useAppDispatch()
  const { year, totalEarnings, totalCattleEarnings, totalMilkEarnings, difference } = route.params

  useEffect(() => {
    dispatch(setYear({ listId: ANNUAL_EARNINGS_LIST_ID, year }))
  }, [])

  return (
    <Portal.Host>
      <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
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
      </View>
    </Portal.Host>
  )
}

export default AnnualEarningsView
