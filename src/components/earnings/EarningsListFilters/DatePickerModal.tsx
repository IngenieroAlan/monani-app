import MDateTimePicker from '@/components/MDateTimePicker'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { setBetweenDates } from '@/redux/slices/collections/earningsQuerySlice'
import { RootState } from '@/redux/store/store'
import { format, getYear, set } from 'date-fns'
import { memo, MutableRefObject, useEffect } from 'react'
import { DateType } from 'react-native-ui-datepicker'

type Props = {
  visibleDatePicker: boolean
  setVisibleDatePicker: (bool: boolean) => void
  startDate: DateType
  setStartDate: (date: DateType) => void
  endDate: DateType
  setEndDate: (date: DateType) => void
  dateFilterText: MutableRefObject<string | null>
  setDefaultDates: () => void
  listId: string
}

const getDateFilterText = (startDate: Date, endDate: Date) => {
  const startDateText = format(startDate, 'dd/MM/yy')
  const endDateText = format(endDate, 'dd/MM/yy')

  return `${startDateText} - ${endDateText}`
}

const DatePickerModal = (props: Props) => {
  const year = useAppSelector((state: RootState) => state.earningsQuery[props.listId]?.year)
  const dispatch = useAppDispatch()

  useEffect(() => {
    props.setDefaultDates()
  }, [])

  return (
    <MDateTimePicker
      dismissable
      firstDayOfWeek={1}
      mode='range'
      visible={props.visibleDatePicker}
      startDate={props.startDate}
      endDate={props.endDate}
      minDate={year ? new Date(year, 0, 1) : null}
      maxDate={set(year && year !== getYear(new Date()) ? new Date(year, 11, 31) : new Date(), {
        hours: 23,
        minutes: 59,
        seconds: 59
      })}
      onConfirm={() => {
        if (!props.startDate || !props.endDate) return

        const _startDate = new Date(props.startDate.toString())
        const _endDate = new Date(props.endDate.toString())

        props.dateFilterText.current = getDateFilterText(_startDate, _endDate)

        const startDateTime = _startDate.getTime()
        const endDateTime = _endDate.getTime()

        dispatch(setBetweenDates({ listId: props.listId, betweenDates: [startDateTime, endDateTime] }))
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
}

export default memo(DatePickerModal)
