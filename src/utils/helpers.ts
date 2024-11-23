import { intervalToDuration, set } from 'date-fns'

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

export const formatNumberWithSpaces = (n: number | string) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
