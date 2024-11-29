import MilkReport from '@/database/models/MilkReport'
import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

type MilkReportsBarProps = {
  dayReports: MilkReport[]
  totalLiters: number
  colors: string[]
  progressBars: {
    width: number
    color: string
  }[]
}

const MilkReportsBar = (props: MilkReportsBarProps) => {
  const { dayReports, totalLiters, colors } = props

  const progressBars = useMemo(() => {
    return dayReports.map((dayReport, index) => ({
      color: colors[index % colors.length],
      width: Math.round((dayReport.liters / totalLiters) * 100)
    }))
  }, [dayReports, totalLiters])

  return (
    <View style={styles.progressBarContainer}>
      {progressBars.map((progressBar, index) => {
        return (
          <View
            key={index}
            style={[
              styles.progressBar,
              {
                width: `${progressBar.width}%`,
                backgroundColor: `${progressBar.color}`
              }
            ]}
          />
        )
      })}
    </View>
  )
}

export default MilkReportsBar

const styles = StyleSheet.create({
  progressBarContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 8
  },
  progressBar: {
    height: 6,
    flexShrink: 1,
    borderRadius: 4
  }
})
