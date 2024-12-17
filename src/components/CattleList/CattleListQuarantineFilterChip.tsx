import { useCattleFilters } from '@/contexts/CattleFiltersContext'
import FilterChip from '../FilterChip'

const CattleListQuarantineFilterChip = () => {
  const isInQuarantine = useCattleFilters('isInQuarantine')
  const setIsInQuarantine = useCattleFilters('setIsInQuarantine')

  const getFilterText = () => {
    if (isInQuarantine === undefined) return []

    return isInQuarantine ? ['En cuarentena'] : ['Sin cuarentena']
  }

  return (
    <FilterChip
      mode='outlined'
      filters={getFilterText()}
      icon='minus-circle-outline'
      onPress={() => setIsInQuarantine(!isInQuarantine)}
      onClose={() => setIsInQuarantine(undefined)}
    >
      Cuarentena
    </FilterChip>
  )
}

export default CattleListQuarantineFilterChip
