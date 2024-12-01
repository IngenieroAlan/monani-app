import { MilkReportProvider } from '@/contexts'
import MilkReport from '@/database/models/MilkReport'
import useMilkReports from '@/hooks/collections/useMilkReports'
import { useAppSelector } from '@/hooks/useRedux'
import useAppTheme from '@/theme'
import { FlashList } from '@shopify/flash-list'
import { formatISO, set } from 'date-fns'
import { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, Text } from 'react-native-paper'
import DeleteMilkReportDialog from '../Components/milkProduction/DeleteMilkReportDialog'
import EditMilkReportDialog from '../Components/milkProduction/EditMilkReportDialog'
import MilkReportsAccordion from '../Components/milkProduction/milkReportsList/MilkReportsAccordion'
import MilkReportsSnackbarContainer from '../Components/milkProduction/MilkReportsSnackbarContainer'

const ITEMS_PER_PAGINATE = 35

type MilkReportsData = {
  [date: string]: {
    totalLiters: number
    dayReports: MilkReport[]
  }
}

const groupMilkReports = (milkReports: MilkReport[]) => {
  const milkReportsData: MilkReportsData = {}

  for (let i = 0; i < milkReports.length; i++) {
    const currentMilkReport = milkReports[i]
    const normalizedDate = set(currentMilkReport.reportedAt, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
    const isoDate = formatISO(normalizedDate)

    if (!milkReportsData[isoDate]) {
      milkReportsData[isoDate] = {
        totalLiters: 0,
        dayReports: []
      }
    }

    milkReportsData[isoDate].totalLiters += currentMilkReport.liters
    milkReportsData[isoDate].dayReports.push(currentMilkReport)
  }

  return Object.entries(milkReportsData)
}

const EmptyList = () => {
  const theme = useAppTheme()

  return (
    <View style={[styles.emptyList, { backgroundColor: theme.colors.surface }]}>
      <Icon
        size={48}
        source='cup-off-outline'
      />
      <Text variant='titleMedium'>No se han registrado producciones de leche.</Text>
    </View>
  )
}

const MilkProductionRoute = () => {
  const theme = useAppTheme()
  const cattle = useAppSelector((state) => state.cattles.cattleInfo)!
  const [index, setIndex] = useState(0)
  const { milkReports } = useMilkReports(cattle, {
    take: ITEMS_PER_PAGINATE + ITEMS_PER_PAGINATE * index
  })

  const groupedMilkReports = useMemo(() => groupMilkReports(milkReports), [milkReports])

  return (
    <>
      {milkReports.length > 0 ? (
        <MilkReportProvider>
          <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
            <FlashList
              estimatedItemSize={64}
              data={groupedMilkReports}
              keyExtractor={(item) => item[0]}
              renderItem={({ item }) => (
                <MilkReportsAccordion
                  timestamp={item[0]}
                  totalLiters={item[1].totalLiters}
                  dayReports={item[1].dayReports}
                />
              )}
              onEndReachedThreshold={2}
              onEndReached={() => setIndex(index + 1)}
            />
          </View>
          <EditMilkReportDialog />
          <DeleteMilkReportDialog />
        </MilkReportProvider>
      ) : (
        <EmptyList />
      )}
      <MilkReportsSnackbarContainer />
    </>
  )
}

export default MilkProductionRoute

const styles = StyleSheet.create({
  emptyList: {
    flex: 1,
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
