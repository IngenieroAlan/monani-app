import { format, isThisYear } from 'date-fns'
import { es } from 'date-fns/locale'
import 'dayjs/locale/es'
import { useCallback, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Dialog, Divider, Icon, Portal, Text, useTheme } from 'react-native-paper'
import DateTimePicker from 'react-native-ui-datepicker'
import {
  DatePickerRangeProps,
  DatePickerSingleProps
} from 'react-native-ui-datepicker/lib/typescript/src/DateTimePicker'

type DatePickerProps = {
  visible?: boolean
  dismissable?: boolean
  onCancel?: () => void
  onConfirm?: () => void
  onDismiss?: () => void
}

const formatDate = (date: Date, mode: 'single' | 'range') => {
  if (mode === 'single') {
    if (isThisYear(date)) {
      return format(date, "dd 'de' MMM.", { locale: es })
    }
    return format(date, "dd 'de' MMM. 'de' yyyy", { locale: es })
  }

  return format(date, 'dd/MM/yy', { locale: es })
}

const HeaderButton = ({ icon }: { icon: string }) => {
  return (
    <View style={styles.headerButtonContainer}>
      <Icon
        size={24}
        source={icon}
      />
    </View>
  )
}

// Does not support multiple and time modes.
export const DatePicker = ({
  visible = false,
  dismissable = false,
  ...props
}: DatePickerProps & (DatePickerSingleProps | DatePickerRangeProps)) => {
  const theme = useTheme()

  const headline = useMemo(() => {
    if (props.mode === 'single') {
      if (!props.date) return 'Fecha'

      return formatDate(new Date(props.date.toLocaleString()), props.mode)
    }

    let startDateText = props.startDate ? formatDate(new Date(props.startDate.toLocaleString()), props.mode) : 'Inicio'
    let endDateText = props.endDate ? formatDate(new Date(props.endDate.toLocaleString()), props.mode) : 'Fin'

    return `${startDateText} - ${endDateText}`
  }, [props.date, props.startDate, props.endDate, props.mode])

  const disableConfirm = useCallback(() => {
    if (props.mode === 'single') {
      return !props.date
    }

    return !props.startDate || !props.endDate
  }, [props.date, props.startDate, props.endDate])

  return (
    <Portal>
      <Dialog
        visible={visible}
        dismissable={dismissable}
        onDismiss={props.onDismiss}
      >
        <View style={{}}>
          <View style={styles.headlineContainer}>
            <Text
              style={{ color: theme.colors.onSurfaceVariant }}
              variant='labelLarge'
            >
              {props.mode === 'single' ? 'Seleccionar fecha' : 'Seleccionar rango'}
            </Text>
            <View>
              {props.mode === 'range' && (
                <Text
                  style={{ color: theme.colors.onSurfaceVariant, opacity: props.startDate && props.endDate ? 1 : 0 }}
                  variant='labelLarge'
                >
                  Inicio - fin
                </Text>
              )}
              <Text
                style={{ color: theme.colors.onSurfaceVariant }}
                variant='headlineLarge'
              >
                {headline}
              </Text>
            </View>
          </View>
          <Divider />
          <View style={styles.dateContainer}>
            <DateTimePicker
              locale='es'
              height={340}
              headerButtonsPosition='right'
              buttonPrevIcon={<HeaderButton icon='chevron-left' />}
              buttonNextIcon={<HeaderButton icon='chevron-right' />}
              calendarTextStyle={{ color: theme.colors.onSurface, ...styles.calendarText }}
              selectedTextStyle={{ color: theme.colors.onPrimary }}
              selectedItemColor={theme.colors.primary}
              headerTextStyle={{ color: theme.colors.onSurfaceVariant, ...styles.headerText }}
              headerTextContainerStyle={styles.headerTextContainer}
              monthContainerStyle={{ backgroundColor: theme.colors.elevation.level3, ...styles.monthContainer }}
              yearContainerStyle={{
                backgroundColor: theme.colors.elevation.level3,
                borderColor: theme.colors.elevation.level3,
                ...styles.yearContainer
              }}
              weekDaysContainerStyle={{ borderBottomWidth: 0 }}
              weekDaysTextStyle={{ color: theme.colors.onSurface, fontSize: 16 }}
              selectedRangeBackgroundColor={theme.colors.secondaryContainer}
              {...props}
            />
          </View>
        </View>
        <Dialog.Actions>
          <Button onPress={props.onCancel}>Cancelar</Button>
          <Button
            disabled={disableConfirm()}
            onPress={props.onConfirm}
          >
            Aceptar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

const styles = StyleSheet.create({
  surface: {
    borderRadius: 28,
    elevation: 3
  },
  headlineContainer: {
    paddingBottom: 8,
    paddingHorizontal: 24,
    gap: 36
  },
  dateContainer: {
    paddingHorizontal: 12,
    paddingBottom: 16
  },
  calendarText: {
    fontSize: 16,
    fontWeight: 400
  },
  headerText: {
    fontSize: 14,
    fontWeight: 500
  },
  headerTextContainer: {
    justifyContent: 'center',
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 8
  },
  monthContainer: {
    borderRadius: 50,
    borderWidth: 0
  },
  yearContainer: {
    borderRadius: 50,
    borderWidth: 1
  },
  headerButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48
  }
})
