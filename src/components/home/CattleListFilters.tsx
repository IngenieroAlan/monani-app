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
        filters={eqProductionType === null ? [] : [eqProductionType]}
        mode='outlined'
        onPress={() => dispatch(open('homeProductionFilter'))}
        onClose={() => dispatch(setEqProductionType(null))}
      >
        Producción
      </FilterChip>
      <FilterChip
        filters={Array.from(oneOfCattleStatus)}
        mode='outlined'
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
