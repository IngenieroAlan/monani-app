import { SurfaceContainer } from '@/components/SurfaceContainer'
import { MilkProductionsList } from './components/MilkProductionsList'
import { MilkProductionsFiltersProvider } from './contexts/MilkProductionsFiltersContext'

export const DailyMilkProductionView = () => {
  return (
    <MilkProductionsFiltersProvider>
      <SurfaceContainer>
        <MilkProductionsList />
      </SurfaceContainer>
    </MilkProductionsFiltersProvider>
  )
}
