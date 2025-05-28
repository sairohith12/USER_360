import dayjs, { Dayjs } from 'dayjs'

/**
 * Formats a Dayjs date object to "YYYY-MM-DD" string
 * @param date - Dayjs date object
 * @returns formatted date string in YYYY-MM-DD format
 */
export function formatDateToYYYYMMDD(date: string | Dayjs | null | undefined | number): string {
  const newDate = dayjs(date)
  const year = newDate.year()
  // month() returns 0-indexed month; add 1 and pad to 2 digits
  const month = String(newDate.month() + 1).padStart(2, '0')
  const day = String(newDate.date()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDateToDDMMYYYY(date: string | Dayjs | null | undefined | number): string {
  const newDate = dayjs(date)
  const year = newDate.year()
  // month() returns 0-indexed month; add 1 and pad to 2 digits
  const month = String(newDate.month() + 1).padStart(2, '0')
  const day = String(newDate.date()).padStart(2, '0')
  return `${day}-${month}-${year}`
}
