import { DateArg, format, intervalToDuration, isSameYear, isThisYear, isToday, isYesterday, set } from 'date-fns'
import { es } from 'date-fns/locale'

export const getIntervalDuration = (start: Date, end: Date) => {
  const normalizeDate = (date: Date) => set(date, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })

  const { years, months, days } = intervalToDuration({
    start: normalizeDate(start),
    end: normalizeDate(end)
  })

  const formatWithTimeUnit = (value: number, singular: string, plural: string) =>
    `${value} ${Math.abs(value) === 1 ? singular : plural}`

  let durationParts: string[] = []
  if (years) durationParts.push(formatWithTimeUnit(years, 'año', 'años'))
  if (months) durationParts.push(formatWithTimeUnit(months, 'mes', 'meses'))
  if (days) durationParts.push(formatWithTimeUnit(days, 'día', 'días'))

  return durationParts.length > 0 ? durationParts.join(', ') : '0 días'
}

/**
 * Formats a number with a space every thousands.
 */
export const formatNumberWithSpaces = (n: number | string) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

/**
 * Formats a date with the form "08 de noviembre de 2002". If the year of date is the same
 * as the current year it will be omited, resulting in something like "08 de noviembre".
 * @param year Relative year to omit in the format.
 */
export const formatDateRelativeToYear = (date: DateArg<Date>, year: number = new Date().getFullYear()) => {
  if (isToday(date)) return 'Hoy'
  if (isYesterday(date)) return 'Ayer'

  if (year ? isSameYear(date, new Date(year, 0, 1)) : isThisYear(date)) {
    return format(date, "dd 'de' MMMM", { locale: es })
  }

  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es })
}
