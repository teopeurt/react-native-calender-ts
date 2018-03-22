import { parseDate } from '../interface'

export default function shouldComponentUpdate(this: any, nextProps: any, nextState: any) {
  let shouldUpdate = (nextProps.selected || []).reduce(
    function(this: any, prev: any, next: any, i: any) {
      const currentSelected = (this.props.selected || [])[i]
      if (
        !currentSelected || !next || parseDate(currentSelected).getTime() !== parseDate(next).getTime()
      ) {
        return {
          update: true,
          field: 'selected',
        }
      }
      return prev
    },
    { update: false },
  )
  shouldUpdate = ['markedDates', 'hideExtraDays'].reduce(
    function(this: any, prev: any, next: any) {
    if (!prev.update && nextProps[next] !== this.props[next]) {
      return {
        update: true,
        field: next,
      }
    }
    return prev
  }, shouldUpdate)
  shouldUpdate = ['minDate', 'maxDate', 'current'].reduce(
    function(this: any, prev: any, next: any) {
    const prevDate = parseDate(this.props[next])
    const nextDate = parseDate(nextProps[next])
    if (prev.update) {
      return prev
    } else if (prevDate !== nextDate) {
      if (prevDate && nextDate && prevDate.getTime() === nextDate.getTime()) {
        return prev
      } else {
        return {
          update: true,
          field: next,
        }
      }
    }
    return prev
  }, shouldUpdate)
  if (nextState.currentMonth !== this.state.currentMonth) {
    shouldUpdate = {
      update: true,
      field: 'current',
    }
  }
  //console.log(shouldUpdate.field, shouldUpdate.update);
  return shouldUpdate.update
}
