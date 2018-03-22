import React, { Component } from 'react'
import { TouchableOpacity, Text, View } from 'react-native'
import styleConstructor from './style'
import { DayProps } from '../basic'
// type DayProps = {
//   state?: "disabled" | "today" | "",
//   theme?: object,
//   marking?: any,
//   onPress?: (...args: any[]) => any,
//   date?: object
// };
class Day extends Component<DayProps, {}> {
  constructor(props: any) {
    super(props)
    props.style = styleConstructor(props.theme)
    this.onDayPress = this.onDayPress.bind(this)
  }
  public onDayPress() {
      this.props.onPress && this.props.onPress(this.props.date)
  }
  public shouldComponentUpdate(nextProps: any) {
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
          this.props.marking.marking === nextProps.marking.marking &&
          this.props.marking.selected === nextProps.marking.selected &&
          this.props.marking.disabled === nextProps.marking.disabled &&
          this.props.marking.dots === nextProps.marking.dots
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
  public renderDots(marking: any) {
    const baseDotStyle = [this.props.style.dot, this.props.style.visibleDot]
    if (
      marking.dots &&
      Array.isArray(marking.dots) &&
      marking.dots.length > 0
    ) {
      // Filter out dots so that we we process only those items which have key and color property
      const validDots = marking.dots.filter((d: any) => d && d.color)
      return validDots.map((dot: any, index: any) => {
        return (
          <View
            key={dot.key ? dot.key : index}
            style={[
              baseDotStyle,
              {
                backgroundColor:
                  marking.selected && dot.selectedDotColor
                    ? dot.selectedDotColor
                    : dot.color,
              },
            ]}
          />
        )
      })
    }
    return
  }
  public render() {
    const containerStyle = [this.props.style.base]
    const textStyle = [this.props.style.text]
    const marking = this.props.marking || {}
    const dot = this.renderDots(marking)
    if (marking.selected) {
      containerStyle.push(this.props.style.selected)
      textStyle.push(this.props.style.selectedText)
    } else if (
      typeof marking.disabled !== 'undefined'
        ? marking.disabled
        : this.props.state === 'disabled'
    ) {
      textStyle.push(this.props.style.disabledText)
    } else if (this.props.state === 'today') {
      textStyle.push(this.props.style.todayText)
    }
    return (
      <TouchableOpacity style={containerStyle} onPress={this.onDayPress}>
        <Text allowFontScaling={false} style={textStyle}>
          {String(this.props.children)}
        </Text>
        <View style={{ flexDirection: 'row' }}>{dot}</View>
      </TouchableOpacity>
    )
  }
}
export default Day
