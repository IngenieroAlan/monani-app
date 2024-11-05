import { EarningsRecord } from '@/hooks/collections/useEarnings'
import { useAppSelector } from '@/hooks/useRedux'
import { RootState } from '@/redux/store/store'
import { format, isSameYear, isThisYear, isToday, isYesterday } from 'date-fns'
import { es } from 'date-fns/locale'
import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import CattleListItem from './CattleListItem'
import MilkListItem from './MilkListItem'

const EarningsListSection = ({ records, listId }: { records: EarningsRecord; listId: string }) => {
  const year = useAppSelector((state: RootState) => state.earningsQuery[listId]?.year)

  const title = useMemo(() => {
    if (isToday(records.date)) return 'Hoy'

    if (isYesterday(records.date)) return 'Ayer'

    if (year === null ? isThisYear(records.date) : isSameYear(records.date, new Date(year, 0, 1))) {
      return format(records.date, "dd 'de' MMMM", { locale: es })
    }

    return format(records.date, "dd 'de' MMMM 'de' yyyy", { locale: es })
  }, [records])

  const cattleSales = useMemo(() => {
    return records.cattleSales.map((cattleSale, index) => (
      <CattleListItem
        key={index}
        record={cattleSale}
      />
    ))
  }, [records])

  const milkSales = useMemo(() => {
    return records.milkSales.map((milkSale, index) => (
      <MilkListItem
        key={index}
        record={milkSale}
      />
    ))
  }, [records])

  return (
    <View>
      <Text
        variant='titleSmall'
        style={styles.title}
      >
        {title}
      </Text>
      {cattleSales}
      {milkSales}
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: 16,
    paddingTop: 16
  }
})

export default EarningsListSection
