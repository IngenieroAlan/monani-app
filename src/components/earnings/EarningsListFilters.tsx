import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { open } from '@/redux/slices/bottomSheetSlice'
import { setEqSalesType } from '@/redux/slices/collections/earningsQuerySlice'
import { RootState } from '@/redux/store/store'
import { StyleSheet, View } from 'react-native'
import FilterChip from '../FilterChip'
import { SALES_FILTER_BOTTOM_SHEET_ID } from './SalesFilterBottomSheet'

const EarningsListFilters = () => {
  const dispatch = useAppDispatch()
  const salesTypeFilter = useAppSelector((state: RootState) => state.earningsQuery.eqSalesType)

  return (
    <View style={styles.container}>
      <FilterChip
        mode='outlined'
        filters={[]}
        onPress={() => {}}
      >
        Fecha
      </FilterChip>
      <FilterChip
        mode='outlined'
        filters={salesTypeFilter === null ? [] : [salesTypeFilter]}
        onPress={() => dispatch(open(SALES_FILTER_BOTTOM_SHEET_ID))}
        onClose={() => dispatch(setEqSalesType(null))}
      >
        Tipo de venta
      </FilterChip>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16
  }
})

export default EarningsListFilters
