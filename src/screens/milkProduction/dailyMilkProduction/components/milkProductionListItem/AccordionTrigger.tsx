import { memo } from 'react'
import { StyleSheet } from 'react-native'
import { Icon, TouchableRipple } from 'react-native-paper'
import Animated, { SharedValue, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'

export const AccordionTrigger = memo(({ isExpanded }: { isExpanded: SharedValue<Boolean> }) => {
  const derivedRotate = useDerivedValue(() => withTiming(isExpanded.value ? 180 : 0, { duration: 300 }))
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${derivedRotate.value}deg` }]
  }))

  return (
    <TouchableRipple
      style={styles.expandButtonRipple}
      onPress={() => (isExpanded.value = !isExpanded.value)}
    >
      <Animated.View style={iconStyle}>
        <Icon
          size={24}
          source='chevron-down'
        />
      </Animated.View>
    </TouchableRipple>
  )
})

const styles = StyleSheet.create({
  expandButtonRipple: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center'
  }
})
