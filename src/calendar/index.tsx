import React, { Component } from 'react'
import { View } from 'react-native'
// import XDate from 'xdate'
import * as dateutils from '../lib/dateutils'
import { xdateToData, parseDate } from '../lib/interface'
import styleConstructor from './style'
import Day from './day/basic'
import UnitDay from './day/period'
import MultiDotDay from './day/multi-dot'
import CalendarHeader from './header'
import shouldComponentUpdate from './updater'
import { XDate } from 'xdate'
//Fallback when RN version is < 0.44
// const viewPropTypes = ViewPropTypes || View.propTypes
const EmptyArray: any = []
export interface CalendarProps {
  theme?: object,
  markedDates?: any,
  style?: any,
  current?: any,
  minDate?: any,
  maxDate?: any,
  firstDay?: any,
  markingType?: string,
  hideArrows?: boolean,
  displayLoadingIndicator?: boolean,
  hideExtraDays?: boolean,
  onDayPress?: (...args: any[]) => any,
  onMonthChange?: (...args: any[]) => any,
  onVisibleMonthsChange?: (...args: any[]) => any,
  renderArrow?: (...args: any[]) => any,
  dayComponent?: any,
  monthFormat?: string,
  disableMonthChange?: boolean,
  hideDayNames?: boolean,
  disabledByDefault?: boolean,
  showWeekNumbers?: boolean,
  onPressArrowLeft?: (...args: any[]) => any,
  onPressArrowRight?: (...args: any[]) => any
}
export interface CalendarState {
  currentMonth: any
}
export class Calendar extends Component<CalendarProps, CalendarState> {
  constructor(props: CalendarProps) {
    super(props)
    props.style = styleConstructor(props.theme)
    let currentMonth
    if (props.current) {
      currentMonth = parseDate(props.current)
    } else {
      currentMonth = new XDate()
    }
    this.state = {
      currentMonth,
    }
    this.updateMonth = this.updateMonth.bind(this)
    this.addMonth = this.addMonth.bind(this)
    this.pressDay = this.pressDay.bind(this)
    this.shouldComponentUpdate = shouldComponentUpdate
  }
  public componentWillReceiveProps(nextProps: CalendarProps) {
    const current = parseDate(nextProps.current)
    if (
      current &&
      current.toString('yyyy MM') !==
        this.state.currentMonth.toString('yyyy MM')
    ) {
      this.setState({
        currentMonth: current.clone(),
      })
    }
  }
  public updateMonth(day: any, doNotTriggerListeners: any) {
    if (
      day.toString('yyyy MM') === this.state.currentMonth.toString('yyyy MM')
    ) {
      return
    }
    this.setState(
      {
        currentMonth: day.clone(),
      },
      () => {
        if (!doNotTriggerListeners) {
          const currMont = this.state.currentMonth.clone()
          if (this.props.onMonthChange) {
            this.props.onMonthChange(xdateToData(currMont))
          }
          if (this.props.onVisibleMonthsChange) {
            this.props.onVisibleMonthsChange([xdateToData(currMont)])
          }
        }
      },
    )
  }
  public pressDay(date: any) {
    const day = parseDate(date)
    const minDate = parseDate(this.props.minDate)
    const maxDate = parseDate(this.props.maxDate)
    if (
      !(minDate && !dateutils.isGTE(day, minDate)) &&
      !(maxDate && !dateutils.isLTE(day, maxDate))
    ) {
      const shouldUpdateMonth =
        this.props.disableMonthChange === undefined ||
        !this.props.disableMonthChange
      if (shouldUpdateMonth) {
        this.updateMonth(day, null)
      }
      if (this.props.onDayPress) {
        this.props.onDayPress(xdateToData(day))
      }
    }
  }
  public addMonth(count: any) {
    this.updateMonth(this.state.currentMonth.clone().addMonths(count, true), null)
  }
  public renderDay(day: any, id: any) {
    const minDate = parseDate(this.props.minDate)
    const maxDate = parseDate(this.props.maxDate)
    let state = ''
    if (this.props.disabledByDefault) {
      state = 'disabled'
    } else if (
      (minDate && !dateutils.isGTE(day, minDate)) ||
      (maxDate && !dateutils.isLTE(day, maxDate))
    ) {
      state = 'disabled'
    } else if (!dateutils.sameMonth(day, this.state.currentMonth)) {
      state = 'disabled'
    } else if (dateutils.sameDate(day, new XDate())) {
      state = 'today'
    }
    let dayComp
    if (
      !dateutils.sameMonth(day, this.state.currentMonth) &&
      this.props.hideExtraDays
    ) {
      if (this.props.markingType === 'period') {
        dayComp = <View key={id} style={{ flex: 1 }} />
      } else {
        dayComp = <View key={id} style={{ width: 32 }} />
      }
    } else {
      const DayComp = this.getDayComponent()
      const date = day.getDate()
      dayComp = (
        <DayComp
          key={id}
          state={state}
          theme={this.props.theme}
          onPress={this.pressDay}
          date={xdateToData(day)}
          marking={this.getDateMarking(day)}
        >
          {date}
        </DayComp>
      )
    }
    return dayComp
  }
  public getDayComponent() {
    if (this.props.dayComponent) {
      return this.props.dayComponent
    }
    switch (this.props.markingType) {
      case 'period':
        return UnitDay
      case 'multi-dot':
        return MultiDotDay
      default:
        return Day
    }
  }
  public getDateMarking(day: any) {
    if (!this.props.markedDates) {
      return false
    }
    const dates =
      this.props.markedDates[day.toString('yyyy-MM-dd')] || EmptyArray
    if (dates.length || dates) {
      return dates
    } else {
      return false
    }
  }
  public renderWeekNumber(weekNumber: any) {
    return (
      <Day
        key={`week-${weekNumber}`}
        theme={this.props.theme}
        state="disabled"
      >
        {weekNumber}
      </Day>
    )
  }
  public renderWeek(days: any, id: any) {
    const week: any = []
    days.forEach(
      function(this: any, day: any, id2: any) {
      week.push(this.renderDay(day, id2))
    }, this)
    if (this.props.showWeekNumbers) {
      week.unshift(this.renderWeekNumber(days[days.length - 1].getWeek()))
    }
    return (
      <View style={this.props.style.week} key={id}>
        {week}
      </View>
    )
  }
  public render() {
    const days = dateutils.page(this.state.currentMonth, this.props.firstDay)
    const weeks = []
    while (days.length) {
      weeks.push(this.renderWeek(days.splice(0, 7), weeks.length))
    }
    let indicator
    const current = parseDate(this.props.current)
    if (current) {
      const lastMonthOfDay = current
        .clone()
        .addMonths(1, true)
        .setDate(1)
        .addDays(-1)
        .toString('yyyy-MM-dd')
      if (
        this.props.displayLoadingIndicator &&
        !(this.props.markedDates && this.props.markedDates[lastMonthOfDay])
      ) {
        indicator = true
      }
    }
    return (
      <View style={[this.props.style.container, this.props.style]}>
        <CalendarHeader
          theme={this.props.theme}
          hideArrows={this.props.hideArrows}
          month={this.state.currentMonth}
          addMonth={this.addMonth}
          showIndicator={indicator}
          firstDay={this.props.firstDay}
          renderArrow={this.props.renderArrow}
          monthFormat={this.props.monthFormat}
          hideDayNames={this.props.hideDayNames}
          weekNumbers={this.props.showWeekNumbers}
          onPressArrowLeft={this.props.onPressArrowLeft}
          onPressArrowRight={this.props.onPressArrowRight}
        />
        {weeks}
      </View>
    )
  }
}
//export default Calendar
