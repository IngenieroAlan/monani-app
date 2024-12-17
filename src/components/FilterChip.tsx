import { useEffect, useState } from 'react'
import { Chip, ChipProps, useTheme } from 'react-native-paper'

const FilterChip = <T,>(props: ChipProps & { filters: T[] }) => {
  const theme = useTheme()
  const [filters, setFilters] = useState(props.filters)

  useEffect(() => {
    setFilters(props.filters)
  }, [props.filters])

  const getFilterText = () => {
    const firstFilter = [...filters][0]
    const plus = filters.length - 1 === 0 ? '' : ` +${filters.length - 1}`

    return `${firstFilter}${plus}`
  }

  return (
    <Chip
      style={{ backgroundColor: filters.length > 0 ? theme.colors.primaryContainer : 'transparent' }}
      {...props}
      onClose={filters.length > 0 ? props.onClose : undefined}
    >
      {filters.length > 0 ? getFilterText() : props.children}
    </Chip>
  )
}

export default FilterChip
