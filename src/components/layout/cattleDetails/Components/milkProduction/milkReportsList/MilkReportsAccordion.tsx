import MilkReport from '@/database/models/MilkReport'
import useAppTheme from '@/theme'
import { formatNumberWithSpaces } from '@/utils/helpers'
import { format } from 'date-fns'
import { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Divider, Icon, Text, TouchableRipple } from 'react-native-paper'
import MilkReportItem from './MilkReportItem'
import MilkReportsBar from './MilkReportsBar'

type MilkReportItemProps = {
  timestamp: string
  totalLiters: number
  dayReports: MilkReport[]
}

const MilkReportsAccordion = (props: MilkReportItemProps) => {
  const theme = useAppTheme()
  const [expanded, setExpanded] = useState(false)
  const { dayReports, totalLiters, timestamp } = props

  const colors = useMemo(() => [theme.colors.primary, theme.colors.secondaryContainer, theme.colors.tertiary], [])

  const progressBars = useMemo(() => {
    return dayReports.map((dayReport, index) => ({
      color: colors[index % colors.length],
      width: Math.round((dayReport.liters / totalLiters) * 100)
    }))
  }, [dayReports, totalLiters])

  const formattedDate = useMemo(() => format(timestamp, 'dd/MM/yy'), [timestamp])

  return (
    <>
      <TouchableRipple
        onPress={() => setExpanded(!expanded)}
        style={styles.touchableRipple}
      >
        <View style={styles.rippleContainer}>
          <View style={styles.litersContainer}>
            <Text variant='bodyLarge'>{formatNumberWithSpaces(totalLiters.toFixed(3))} L.</Text>
            <MilkReportsBar
              colors={colors}
              progressBars={progressBars}
              dayReports={dayReports}
              totalLiters={totalLiters}
            />
          </View>
          <View style={styles.dateContainer}>
            <Text variant='labelSmall'>{formattedDate}</Text>
            <Icon
              size={24}
              source={expanded ? 'chevron-up' : 'chevron-down'}
            />
          </View>
        </View>
      </TouchableRipple>
      {expanded ? (
        <View>
          <Divider horizontalInset />
          {dayReports.map((report, index) => (
            <MilkReportItem
              key={index}
              color={progressBars[index].color}
              totalLiters={totalLiters}
              milkReport={report}
            />
          ))}
          <Divider />
        </View>
      ) : null}
    </>
  )
}

export default MilkReportsAccordion

const styles = StyleSheet.create({
  touchableRipple: {
    paddingHorizontal: 16,
    paddingVertical: 20
  },
  rippleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 24
  },
  litersContainer: {
    flexDirection: 'column',
    gap: 8,
    flex: 1
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  }
})
