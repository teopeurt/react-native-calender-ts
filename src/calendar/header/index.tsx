import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native'
import { View, Text, TouchableOpacity, Image } from 'react-native'
// import XDate from 'xdate'
import styleConstructor from './style'
import { weekDayNames } from '../dateutils'

interface CalendarHeaderProps {
  theme?: object,
  hideArrows?: boolean,
  month?: any,
  addMonth?: (...args: any[]) => any,
  showIndicator?: boolean,
  firstDay?: number,
  renderArrow?: (...args: any[]) => any,
  hideDayNames?: boolean,
  weekNumbers?: boolean,
  onPressArrowLeft?: (...args: any[]) => any,
  onPressArrowRight?: (...args: any[]) => any,
  monthFormat?: any,
  style?: any,
}

class CalendarHeader extends Component<CalendarHeaderProps, {}> {
  constructor(props: CalendarHeaderProps) {
    super(props)
    props.style = styleConstructor(props.theme)
    this.addMonth = this.addMonth.bind(this)
    this.substractMonth = this.substractMonth.bind(this)
    this.onPressLeft = this.onPressLeft.bind(this)
    this.onPressRight = this.onPressRight.bind(this)
  }
  public addMonth() {
    this.props.addMonth && this.props.addMonth(1)
  }
  public substractMonth() {
    this.props.addMonth && this.props.addMonth(-1)
  }
  public shouldComponentUpdate(nextProps: any) {
    if (
      nextProps.month.toString('yyyy MM') !==
      this.props.month.toString('yyyy MM')
    ) {
      return true
    }
    if (nextProps.showIndicator !== this.props.showIndicator) {
      return true
    }
    if (nextProps.hideDayNames !== this.props.hideDayNames) {
      return true
    }
    return false
  }
  public onPressLeft() {
    const { onPressArrowLeft } = this.props
    if (typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(this.substractMonth)
    }
    return this.substractMonth()
  }
  public onPressRight() {
    const { onPressArrowRight } = this.props
    if (typeof onPressArrowRight === 'function') {
      return onPressArrowRight(this.substractMonth)
    }
    return this.addMonth()
  }
  public render() {
    let leftArrow = <View />
    let rightArrow = <View />
    const weekDaysNames = weekDayNames(this.props.firstDay)
    if (!this.props.hideArrows) {
      leftArrow = (
        <TouchableOpacity onPress={this.onPressLeft} style={this.props.style.arrow}>
          {this.props.renderArrow ? (
            this.props.renderArrow('left')
          ) : (
            <Image
              source={require('../img/previous.png')}
              style={this.props.style.arrowImage}
            />
          )}
        </TouchableOpacity>
      )
      rightArrow = (
        <TouchableOpacity onPress={this.onPressRight} style={this.props.style.arrow}>
          {this.props.renderArrow ? (
            this.props.renderArrow('right')
          ) : (
            <Image
              source={require('../img/next.png')}
              style={this.props.style.arrowImage}
            />
          )}
        </TouchableOpacity>
      )
    }
    let indicator
    if (this.props.showIndicator) {
      indicator = <ActivityIndicator />
    }
    return (
      <View>
        <View style={this.props.style.header}>
          {leftArrow}
          <View style={{ flexDirection: 'row' }}>
            <Text allowFontScaling={false} style={this.props.style.monthText}>
              {this.props.month.toString(
                this.props.monthFormat ? this.props.monthFormat : 'MMMM yyyy',
              )}
            </Text>
            {indicator}
          </View>
          {rightArrow}
        </View>
        {!this.props.hideDayNames && (
          <View style={this.props.style.week}>
            {this.props.weekNumbers && (
              <Text allowFontScaling={false} style={this.props.style.dayHeader} />
            )}
            {weekDaysNames.map((day, idx) => (
              <Text
                allowFontScaling={false}
                key={idx}
                style={this.props.style.dayHeader}
                numberOfLines={1}
              >
                {day}
              </Text>
            ))}
          </View>
        )}
      </View>
    )
  }
}
export default CalendarHeader
