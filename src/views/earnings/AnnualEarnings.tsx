import AnnualEarningsCard from '@/components/earnings/annualEarnings/AnnualEarningsCard'
import ExpandableEarningsList from '@/components/earnings/annualEarnings/ExpandableEarningsList'
import useEarnings from '@/hooks/collections/useEarnings'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { RootStackParamList } from '@/navigation/types'
import { reset, setYear } from '@/redux/slices/collections/earningsQuerySlice'
import { RootState } from '@/redux/store/store'
import useAppTheme from '@/theme'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Appbar, Divider, Portal } from 'react-native-paper'

type ScreenProps = NativeStackScreenProps<RootStackParamList, 'AnnualEarningsView'>

const ITEMS_PER_PAGINATE = 25

const AnnualEarningsView = ({ route, navigation }: ScreenProps) => {
  const theme = useAppTheme()
  const dispatch = useAppDispatch()
  const { year, totalEarnings, totalCattleEarnings, totalMilkEarnings, difference } = route.params

  const [index, setIndex] = useState(0)
  const { eqSalesType, betweenDates, year: queryYear } = useAppSelector((state: RootState) => state.earningsQuery)
  const { earningsRecords } = useEarnings({
    take: ITEMS_PER_PAGINATE + ITEMS_PER_PAGINATE * index,
    salesType: eqSalesType,
    betweenDates,
    year: queryYear
  })

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => dispatch(reset()))

    return unsubscribe
  }, [navigation])

  useEffect(() => {
    dispatch(setYear(year))
  }, [])

  return (
    <Portal.Host>
      <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
        <StatusBar />
        <Appbar.Header>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title={`Ganancias en ${year}`} />
        </Appbar.Header>
        <View style={{ padding: 16 }}>
          <AnnualEarningsCard
            earningsRecords={earningsRecords}
            totalEarnings={totalEarnings}
            totalCattleEarnings={totalCattleEarnings}
            totalMilkEarnings={totalMilkEarnings}
            difference={difference}
          />
        </View>
        <Divider />
        <ExpandableEarningsList
          earningsRecords={earningsRecords}
          index={index}
          setIndex={setIndex}
        />
      </View>
    </Portal.Host>
  )
}

export default AnnualEarningsView
