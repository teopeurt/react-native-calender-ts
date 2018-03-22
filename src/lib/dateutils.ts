import { XDate } from 'xdate'

export { weekDayNames, sameMonth, sameDate, month, page, fromTo, isLTE, isGTE }

function sameMonth(a: XDate, b: XDate): any {
  return (
    a instanceof XDate &&
    b instanceof XDate &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth()
  )
}
function sameDate(a: XDate, b: XDate): any {
  return (
    a instanceof XDate &&
    b instanceof XDate &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}
function isGTE(a: XDate, b: XDate): any {
  return b.diffDays(a) > -1
}
function isLTE(a: XDate, b: XDate): any {
  return a.diffDays(b) > -1
}
function fromTo(a: XDate, b: XDate): any {
  const days: any = []
  let from: any = +a
  const to: any = +b

  for (; from <= to; from = new XDate(from, true).addDays(1).getTime()) {
    days.push(new XDate(from, true))
  }
  return days
}
function month(xd: XDate): any {
  const year = xd.getFullYear()
  const monthly = xd.getMonth()

  const days = new Date(year, monthly + 1, 0).getDate()
  const firstDay = new XDate(year, monthly, 1, 0, 0, 0, 0)
  const lastDay = new XDate(year, monthly, days, 0, 0, 0, 0)
  return fromTo(firstDay, lastDay)
}
// function weekDayNames(firstDayOfWeek: number = 0): any {
// let weekDaysNames = XDate.locales[XDate.defaultLocale].dayNamesShort
// const dayShift: number = firstDayOfWeek % 7
// if (dayShift) {
//   let weekDaysNames = weekDaysNames
//     .slice(dayShift)
//     .concat(weekDaysNames
//       .slice(0, dayShift))
//   return weekDaysNames
// }
// return
//let weekdays = moment.weekdaysShortRegex(true)
// return _.map(moment.weekdaysShort(true), (day))
function weekDayNames() {
  return ['M', 'T', 'W', 'T', 'F', 'S', 'S']
}
function page(xd: XDate, firstDayOfWeek: number | undefined): any {
  {
    const days = month(xd)
    let before: any[] = []
    let after: any[] = []
    const fdow = firstDayOfWeek && ((7 + firstDayOfWeek) % 7 || 7)
    const ldow = fdow && (fdow + 6) % 7
    // firstDayOfWeek = firstDayOfWeek || 0
    const from = days[0].clone()
    if (from.getDay() !== fdow) {
      from.addDays(fdow && -(from.getDay() + 7 - fdow) % 7)
    }
    const to = days[days.length - 1].clone()
    const day = to.getDay()
    if (day !== ldow) {
      to.addDays(ldow && (ldow + 7 - day) % 7)
    }
    if (isLTE(from, days[0])) {
      before = fromTo(from, days[0])
    }
    if (isGTE(to, days[days.length - 1])) {
      after = fromTo(days[days.length - 1], to)
    }
    return before.concat(days.slice(1, days.length - 1), after)
  }
}
