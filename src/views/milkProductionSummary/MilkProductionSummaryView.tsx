import { SurfaceContainer } from '@/components/SurfaceContainer'
import { View } from 'react-native'
import { TotalLitersCard } from './components/TotalLitersCard'
import { useMonthlyMilkProduction } from './hooks/useMonthlyMilkProduction'

export const MilkProductionSummaryView = () => {
  const { monthlyMilkRecords } = useMonthlyMilkProduction()

  return (
    <SurfaceContainer>
      <View style={{ padding: 16 }}>
        <TotalLitersCard
          liters={monthlyMilkRecords.reduce((acc, record) => acc + record.liters, 0)}
          years={new Set(monthlyMilkRecords.map((record) => record.year)).size}
        />
      </View>
    </SurfaceContainer>
  )
}
