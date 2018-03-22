import { XDate } from 'xdate'

export { xdateToData, parseDate }

export interface CalendarDateType {
  year: number
  month: number
  day: number
  timestamp: number
  dateString: string
}
function padNumber(n: number): number | string {
  if (n < 10) {
    return '0' + n
  }
  return n
}

function xdateToData(xdate: XDate): CalendarDateType {
  const dateString = xdate.toString('yyyy-MM-dd')
  return {
    year: xdate.getFullYear(),
    month: xdate.getMonth() + 1,
    day: xdate.getDate(),
    timestamp: new XDate(dateString, true).getTime(),
    dateString,
  }
}
function parseDate(d: any): any {
  if (!d) {
    return
  } else if (d.timestamp) {
    return new XDate(d.timestamp, true)
  } else if (d.year) {
    const dateString =
      d.year + '-' + padNumber(d.month) + '-' + padNumber(d.day)
    return new XDate(dateString, true)
  }
  if (d instanceof XDate) {
    return parseXDate(d)
  } else if (d) {
    return new XDate(d, true)
  }
}

function parseXDate(d: any): any {
  if (d instanceof XDate) {
    return new XDate(d.toString('yyyy-MM-dd'), true)
  }
  if (d.getTime()) {
    const dateString =
      d.getFullYear() +
      '-' +
      padNumber(d.getMonth() + 1) +
      '-' +
      padNumber(d.getDate())
    return new XDate(dateString, true)
  }
}
