import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { setBetweenDates, setEqSalesType } from '@/redux/slices/collections/earningsQuerySlice'
import { RootState } from '@/redux/store/store'
import { useCallback, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { DateType } from 'react-native-ui-datepicker'
import FilterChip from '../../FilterChip'
import DatePickerModal from './DatePickerModal'
import SalesFilterBottomSheet from './SalesFilterBottomSheet'

const EarningsListFilters = () => {
  const dispatch = useAppDispatch()
  const eqSalesType = useAppSelector((state: RootState) => state.earningsQuery.eqSalesType)
  const year = useAppSelector((state: RootState) => state.earningsQuery.year)
  const [visibleDatePicker, setVisibleDatePicker] = useState(false)
  const [index, setIndex] = useState(-1)
  const [startDate, setStartDate] = useState<DateType>()
  const [endDate, setEndDate] = useState<DateType>()
  const dateFilterText = useRef<string | null>(null)

  const setDefaultDates = useCallback(() => {
    setStartDate(year !== null ? new Date(year, 0, 1).toString() : null)
    setEndDate(year !== null ? new Date(year, 0, 1).toString() : null)
  }, [year])

  return (
    <>
      <View style={styles.container}>
        <FilterChip
          mode='outlined'
          icon='calendar-range'
          filters={dateFilterText.current ? [dateFilterText.current] : []}
          onPress={() => setVisibleDatePicker(true)}
          onClose={() => {
            dateFilterText.current = null

            setDefaultDates()
            dispatch(setBetweenDates(null))
          }}
        >
          Fecha
        </FilterChip>
        <FilterChip
          mode='outlined'
          icon='filter-outline'
          filters={eqSalesType === null ? [] : [eqSalesType]}
          onPress={() => setIndex(0)}
          onClose={() => dispatch(setEqSalesType(null))}
        >
          Tipo de venta
        </FilterChip>
      </View>
      <DatePickerModal
        visibleDatePicker={visibleDatePicker}
        setVisibleDatePicker={setVisibleDatePicker}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        dateFilterText={dateFilterText}
        setDefaultDates={setDefaultDates}
      />
      <SalesFilterBottomSheet
        index={index}
        setIndex={setIndex}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16
  }
})

export default EarningsListFilters
