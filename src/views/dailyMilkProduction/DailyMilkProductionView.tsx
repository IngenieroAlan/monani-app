import { SurfaceContainer } from '@/components/SurfaceContainer'
import { MilkProductionsFiltersProvider } from '@/contexts/MilkProductionsFiltersContext'
import { MilkProductionsList } from './components/MilkProductionsList'

export const DailyMilkProductionView = () => {
  return (
    <MilkProductionsFiltersProvider>
      <SurfaceContainer>
        <MilkProductionsList />
      </SurfaceContainer>
    </MilkProductionsFiltersProvider>
  )
}
