import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { open } from '@/redux/slices/bottomSheetSlice'
import { setBetweenDates, setEqSalesType } from '@/redux/slices/collections/earningsQuerySlice'
import { RootState } from '@/redux/store/store'
import { format, set } from 'date-fns'
import { useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { DateType } from 'react-native-ui-datepicker'
import FilterChip from '../FilterChip'
import MDateTimePicker from '../MDateTimePicker'
import { SALES_FILTER_BOTTOM_SHEET_ID } from './SalesFilterBottomSheet'

const getDateFilterText = (startDate: Date, endDate: Date) => {
  const startDateText = format(startDate, 'dd/MM/yy')
  const endDateText = format(endDate, 'dd/MM/yy')

  return `${startDateText} - ${endDateText}`
}

const EarningsListFilters = () => {
  const dispatch = useAppDispatch()
  const salesTypeFilter = useAppSelector((state: RootState) => state.earningsQuery.eqSalesType)
  const [visibleDatePicker, setVisibleDatePicker] = useState(false)
  const [startDate, setStartDate] = useState<DateType>()
  const [endDate, setEndDate] = useState<DateType>()
  const dateFilterText = useRef<string | null>(null)

  return (
    <View style={styles.container}>
      <FilterChip
        mode='outlined'
        filters={dateFilterText.current ? [dateFilterText.current] : []}
        onPress={() => setVisibleDatePicker(true)}
        onClose={() => {
          dateFilterText.current = null

          setStartDate(null)
          setEndDate(null)
          dispatch(setBetweenDates(null))
        }}
      >
        Fecha
      </FilterChip>
      <FilterChip
        mode='outlined'
        filters={salesTypeFilter === null ? [] : [salesTypeFilter]}
        onPress={() => dispatch(open(SALES_FILTER_BOTTOM_SHEET_ID))}
        onClose={() => dispatch(setEqSalesType(null))}
      >
        Tipo de venta
      </FilterChip>
      <MDateTimePicker
        dismissable
        firstDayOfWeek={1}
        mode='range'
        visible={visibleDatePicker}
        startDate={startDate}
        endDate={endDate}
        maxDate={set(new Date(), { hours: 23, minutes: 59, seconds: 59 })}
        onConfirm={() => {
          if (!startDate || !endDate) return

          const _startDate = new Date(startDate.toString())
          const _endDate = new Date(endDate.toString())

          dateFilterText.current = getDateFilterText(_startDate, _endDate)

          const startDateTime = _startDate.getTime()
          const endDateTime = _endDate.getTime()

          dispatch(setBetweenDates([startDateTime, endDateTime]))
          setVisibleDatePicker(false)
        }}
        onChange={(params) => {
          setStartDate(params.startDate)
          setEndDate(params.endDate)
        }}
        onDismiss={() => setVisibleDatePicker(false)}
        onCancel={() => setVisibleDatePicker(false)}
      />
    </View>
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
