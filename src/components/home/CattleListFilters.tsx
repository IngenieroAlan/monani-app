import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { open } from '@/redux/slices/bottomSheetSlice'
import { clearOneOfCattleStatus, setEqProductionType } from '@/redux/slices/collections/cattleQuerySlice'
import { RootState } from '@/redux/store/store'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import FilterChip from '../FilterChip'

const CattleListFilters = () => {
  const dispatch = useAppDispatch()
  const { oneOfCattleStatus, eqProductionType } = useAppSelector((state: RootState) => state.cattleQuery)

  return (
    <View style={styles.chipsContainer}>
      <FilterChip
        mode='outlined'
        icon='filter-variant'
        filters={eqProductionType === null ? [] : [eqProductionType]}
        onPress={() => dispatch(open('homeProductionFilter'))}
        onClose={() => dispatch(setEqProductionType(null))}
      >
        Producción
      </FilterChip>
      <FilterChip
        mode='outlined'
        icon='filter-outline'
        filters={Array.from(oneOfCattleStatus)}
        onPress={() => dispatch(open('homeStatusFilter'))}
        onClose={() => dispatch(clearOneOfCattleStatus())}
      >
        Estado
      </FilterChip>
    </View>
  )
}

const styles = StyleSheet.create({
  chipsContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8
  }
})

export default memo(CattleListFilters)
