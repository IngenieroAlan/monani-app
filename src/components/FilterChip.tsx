import { useEffect, useState } from 'react'
import { Chip, ChipProps, useTheme } from 'react-native-paper'

const FilterChip = <T,>(props: ChipProps & { filters: Set<T> }) => {
  const theme = useTheme()
  const [filters, setFilters] = useState(props.filters)

  useEffect(() => {
    setFilters(props.filters)
  }, [props.filters])

  const getFilterText = () => {
    const firstFilter = [...filters][0]
    const plus = filters.size - 1 === 0 ? '' : ` +${filters.size - 1}`

    return `${firstFilter}${plus}`
  }

  return (
    <Chip
      style={{ backgroundColor: filters.size > 0 ? theme.colors.primaryContainer : theme.colors.surface }}
      {...props}
      onClose={filters.size > 0 ? props.onClose : undefined}
    >
      {filters.size > 0 ? getFilterText() : props.children}
    </Chip>
  )
}

export default FilterChip
