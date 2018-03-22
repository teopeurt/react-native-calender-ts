import React, { Component } from 'react'
import { TouchableOpacity, Text, View } from 'react-native'
import styleConstructor from './style'
export interface DayProps {
  state?: 'disabled' | 'today' | '',
  theme?: object,
  marking?: any,
  onPress?: (...args: any[]) => any,
  date?: object,
  style?: any,
}
class Day extends Component<DayProps, {}> {
  constructor(props: DayProps) {
    super(props)
    props.style = styleConstructor(props.theme)
    this.onDayPress = this.onDayPress.bind(this)
  }
  public onDayPress() {
    this.props.onPress && this.props.onPress(this.props.date)
  }

  public shouldComponentUpdate(nextProps: any): boolean {
      const changed = ['state', 'children', 'marking', 'onPress'].reduce(
        function(this: any, prev: any, next: any) {
          if (prev) {
            return prev
          } else if (nextProps[next] !== this.props[next]) {
            return next
          }
          return prev
        },
        false,
      )
      if (changed === 'marking') {
        let markingChanged = false
        if (this.props.marking && nextProps.marking) {
          markingChanged = !(
            this.props.marking.marked === nextProps.marking.marked &&
            this.props.marking.selected === nextProps.marking.selected &&
            this.props.marking.dotColor === nextProps.marking.dotColor &&
            this.props.marking.disabled === nextProps.marking.disabled
          )
        } else {
          markingChanged = true
        }
        // console.log('marking changed', markingChanged);
        return markingChanged
      } else {
        // console.log('changed', changed);
        return !!changed
      }
  }
  public render() {
    const containerStyle = [this.props.style.base]
    const textStyle = [this.props.style.text]
    const dotStyle = [this.props.style.dot]
    let marking = this.props.marking || {}
    if (marking && marking.constructor === Array && marking.length) {
      marking = {
        marking: true,
      }
    }
    const isDisabled =
      typeof marking.disabled !== 'undefined'
        ? marking.disabled
        : this.props.state === 'disabled'
    let dot
    if (marking.marked) {
      dotStyle.push(this.props.style.visibleDot)
      if (marking.dotColor) {
        dotStyle.push({ backgroundColor: marking.dotColor })
      }
      dot = <View style={dotStyle} />
    }
    if (marking.selected) {
      containerStyle.push(this.props.style.selected)
      if (marking.selectedColor) {
        containerStyle.push({ backgroundColor: marking.selectedColor })
      }
      dotStyle.push(this.props.style.selectedDot)
      textStyle.push(this.props.style.selectedText)
    } else if (isDisabled) {
      textStyle.push(this.props.style.disabledText)
    } else if (this.props.state === 'today') {
      textStyle.push(this.props.style.todayText)
    }
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={this.onDayPress}
        activeOpacity={marking.activeOpacity}
        disabled={marking.disableTouchEvent}
      >
        <Text allowFontScaling={false} style={textStyle}>
          {String(this.props.children)}
        </Text>
        {dot}
      </TouchableOpacity>
    )
  }
}
export default Day
