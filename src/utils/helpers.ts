import { DateArg, format, intervalToDuration, isSameYear, isThisYear, isToday, isYesterday, set } from 'date-fns'
import { es } from 'date-fns/locale'

/**
 * Calculates the duration between two dates in years, months, and days, and returns
 * the result as a formatted string. The time components of the dates are normalized
 * to 00:00:00 to ensure only the date parts are considered in the calculation.
 *
 * @param start - The start date of the interval.
 * @param end - The end date of the interval.
 * @returns A formatted string representing the duration in years, months, and days.
 *          For example: "1 año, 2 meses, 15 días" or "0 días" if the interval is less than one day.
 *
 * @example
 * const start = new Date('2021-01-01');
 * const end = new Date('2023-03-16');
 * const duration = getIntervalDuration(start, end);
 * console.log(duration); // Output: "2 años, 2 meses, 15 días"
 */
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
 * Formats a number or numeric string by adding spaces as thousand separators.
 *
 * @param n - The number or numeric string to format.
 * @returns A string representing the formatted number with spaces as thousand separators.
 *
 * @example
 * formatNumberWithSpaces(1234567); // Output: "1 234 567"
 */
export const formatNumberWithSpaces = (n: number | string) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

/**
 * Formats a date as a relative string or a full date string, depending on its relationship
 * to the provided year or the current year.
 *
 * @param date - The date to format.
 * @param year - The reference year. Defaults to the current year if not provided.
 * @returns A formatted string:
 * - "Hoy" if the date is today.
 * - "Ayer" if the date is yesterday.
 * - A short format (e.g., "02 de marzo") if the date is within the provided year.
 * - A full format (e.g., "02 de marzo de 2022") if the date is outside the provided year.
 *
 * @example
 * // Example 1: Relative date
 * formatDateRelativeToYear(new Date()); // Output: "Hoy"
 *
 * @example
 * // Example 2: Within the same year
 * const date = new Date('2023-03-02');
 * formatDateRelativeToYear(date, 2023); // Output: "02 de marzo"
 *
 * @example
 * // Example 3: Outside the reference year
 * const date = new Date('2021-05-15');
 * formatDateRelativeToYear(date, 2023); // Output: "15 de mayo de 2021"
 */
export const formatDateRelativeToYear = (date: DateArg<Date>, year: number = new Date().getFullYear()) => {
  if (isToday(date)) return 'Hoy'
  if (isYesterday(date)) return 'Ayer'

  if (year ? isSameYear(date, new Date(year, 0, 1)) : isThisYear(date)) {
    return format(date, "dd 'de' MMMM", { locale: es })
  }

  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es })
}
