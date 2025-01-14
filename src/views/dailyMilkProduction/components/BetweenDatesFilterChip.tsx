import FilterChip from '@/components/FilterChip'
import MDateTimePicker from '@/components/MDateTimePicker'
import { useMilkProductionsFilters } from '@/contexts/MilkProductionsFiltersContext'
import { format, set } from 'date-fns'
import { memo, MutableRefObject, useRef, useState } from 'react'
import { DateType } from 'react-native-ui-datepicker'

type DatePickerModalProps = {
  visibleDatePicker: boolean
  setVisibleDatePicker: (bool: boolean) => void
  startDate: DateType
  setStartDate: (date: DateType) => void
  endDate: DateType
  setEndDate: (date: DateType) => void
  dateFilterText: MutableRefObject<string | null>
}

const getDateFilterText = (startDate: Date, endDate: Date) => {
  const startDateText = format(startDate, 'dd/MM/yy')
  const endDateText = format(endDate, 'dd/MM/yy')

  return `${startDateText} - ${endDateText}`
}

const DatePickerModal = memo((props: DatePickerModalProps) => {
  const setBetweenDates = useMilkProductionsFilters('setBetweenDates')

  return (
    <MDateTimePicker
      dismissable
      firstDayOfWeek={1}
      mode='range'
      visible={props.visibleDatePicker}
      startDate={props.startDate}
      endDate={props.endDate}
      maxDate={set(new Date(), { hours: 23, minutes: 59, seconds: 59 })}
      onConfirm={() => {
        if (!props.startDate || !props.endDate) return

        const _startDate = new Date(props.startDate.toString())
        const _endDate = new Date(props.endDate.toString())

        props.dateFilterText.current = getDateFilterText(_startDate, _endDate)

        setBetweenDates([_startDate.getTime(), _endDate.getTime()])
        props.setVisibleDatePicker(false)
      }}
      onChange={(params) => {
        props.setStartDate(params.startDate)
        props.setEndDate(params.endDate)
      }}
      onDismiss={() => props.setVisibleDatePicker(false)}
      onCancel={() => props.setVisibleDatePicker(false)}
    />
  )
})

export const BetweenDatesFilterChip = () => {
  const setBetweenDates = useMilkProductionsFilters('setBetweenDates')
  const [visibleDatePicker, setVisibleDatePicker] = useState(false)
  const [startDate, setStartDate] = useState<DateType>()
  const [endDate, setEndDate] = useState<DateType>()
  const dateFilterText = useRef<string | null>(null)

  return (
    <>
      <FilterChip
        mode='outlined'
        icon='calendar-range'
        filters={dateFilterText.current ? [dateFilterText.current] : []}
        onPress={() => setVisibleDatePicker(true)}
        onClose={() => {
          dateFilterText.current = null
          setStartDate(null)
          setEndDate(null)
          setBetweenDates(null)
        }}
      >
        Fecha
      </FilterChip>
      <DatePickerModal
        visibleDatePicker={visibleDatePicker}
        setVisibleDatePicker={setVisibleDatePicker}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        dateFilterText={dateFilterText}
      />
    </>
  )
}
