import EmptyList from '@/components/EmptyList'
import { RecordsList } from '@/components/RecordsList'
import { SurfaceContainer } from '@/components/SurfaceContainer'
import { FlatList, View } from 'react-native'
import { Divider } from 'react-native-paper'
import { AnnualProductionSection } from './components/AnnualProductionSection'
import { TotalLitersCard } from './components/TotalLitersCard'
import { useMonthlyMilkProduction } from './hooks/useMonthlyMilkProduction'

const List = () => {
  const { monthlyMilkRecords, isPending } = useMonthlyMilkProduction()

  return (
    <RecordsList
      isPending={isPending}
      emptyListComponent={
        <EmptyList
          text='Nada por aquí.'
          icon='search-off'
        />
      }
      isListEmpty={monthlyMilkRecords.length === 0 && !isPending}
    >
      <FlatList
        data={monthlyMilkRecords}
        renderItem={({ item, index }) => (
          <AnnualProductionSection
            monthlyProductions={item}
            nextMonthlyProductions={monthlyMilkRecords[index + 1]}
          />
        )}
      />
    </RecordsList>
  )
}

export const MilkProductionSummaryView = () => {
  return (
    <SurfaceContainer>
      <View style={{ padding: 16 }}>
        <TotalLitersCard />
      </View>
      <Divider />
      <View style={{ flex: 1 }}>
        <List />
      </View>
    </SurfaceContainer>
  )
}
