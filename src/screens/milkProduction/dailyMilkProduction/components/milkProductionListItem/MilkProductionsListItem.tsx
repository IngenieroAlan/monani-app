import DailyMilkProduction from '@/database/models/DailyMilkProduction'
import useAppTheme from '@/theme'
import { withObservables } from '@nozbe/watermelondb/react'
import { memo, useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { Divider } from 'react-native-paper'
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import { AccordionItems } from './AccordionItems'
import { AccordionTrigger } from './AccordionTrigger'
import { DateDisplay } from './DateDisplay'
import { InfoDisplay } from './InfoDisplay'

const withObserver = withObservables(
  ['dailyMilkProduction'],
  ({ dailyMilkProduction }: { dailyMilkProduction: DailyMilkProduction }) => ({ dailyMilkProduction })
)

export const MilkProductionsListItem = memo(
  withObserver(({ dailyMilkProduction }: { dailyMilkProduction: DailyMilkProduction }) => {
    const id = useRef(dailyMilkProduction.id)
    const theme = useAppTheme()
    const height = useSharedValue(0)
    const isExpanded = useSharedValue(false)
    const derivedHeight = useDerivedValue(() =>
      withTiming(height.value * Number(isExpanded.value), {
        duration: 300,
        easing: Easing.inOut(Easing.cubic)
      })
    )
    const bodyStyle = useAnimatedStyle(() => ({ height: derivedHeight.value }))

    useEffect(() => {
      if (id.current === dailyMilkProduction.id) return

      id.current = dailyMilkProduction.id
      isExpanded.value = false
    }, [dailyMilkProduction.id])

    return (
      <View style={styles.root}>
        <DateDisplay date={dailyMilkProduction.producedAt} />
        <View style={[{ borderColor: theme.colors.outlineVariant }, styles.listItemContainer]}>
          <View style={styles.headerContainer}>
            <InfoDisplay
              liters={dailyMilkProduction.liters}
              producedAtTimestamp={dailyMilkProduction.producedAt.getTime()}
              totalProductions={dailyMilkProduction.totalProductions}
            />
            <View style={[{ borderColor: theme.colors.outlineVariant }, styles.divider]} />
            <AccordionTrigger isExpanded={isExpanded} />
          </View>
          <Animated.View style={bodyStyle}>
            <View
              onLayout={(e) => {
                height.value = e.nativeEvent.layout.height
              }}
              style={styles.accordionWrapper}
            >
              <Divider horizontalInset />
              <AccordionItems
                date={dailyMilkProduction.producedAt}
                parentHeight={derivedHeight}
              />
            </View>
          </Animated.View>
        </View>
      </View>
    )
  })
)

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 4
  },
  listItemContainer: {
    flexDirection: 'column',
    borderWidth: 1,
    borderRadius: 12,
    flex: 1,
    overflow: 'hidden'
  },
  divider: {
    flexShrink: 1,
    borderLeftWidth: 0.5,
    marginVertical: 16
  },
  accordionWrapper: {
    position: 'absolute',
    width: '100%'
  },
  headerContainer: {
    flexDirection: 'row',
    flex: 1
  }
})
