import FilterChip from '@/components/FilterChip'
import MBottomSheet from '@/components/MBottomSheet'
import { useCattleFilters } from '@/contexts/CattleFiltersContext'
import { CattleStatus } from '@/database/models/Cattle'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Keyboard, View } from 'react-native'
import { Checkbox, Icon, List, Text } from 'react-native-paper'

type ListItemFilterProps = {
  title: string
  iconName: string
  filter: CattleStatus
  checked?: boolean
}

const ListItemFilter = memo((props: ListItemFilterProps) => {
  const addCattleStatus = useCattleFilters('addCattleStatus')
  const removeCattleStatus = useCattleFilters('removeCattleStatus')

  const left = useCallback(() => {
    return (
      <View style={{ justifyContent: 'center' }}>
        <Icon
          size={24}
          source={props.iconName}
        />
      </View>
    )
  }, [props.iconName])

  const right = useCallback(() => {
    return <Checkbox status={props.checked ? 'checked' : 'unchecked'} />
  }, [props.checked])

  const onPress = useCallback(() => {
    props.checked ? removeCattleStatus(props.filter) : addCattleStatus(props.filter)
  }, [props.checked])

  return (
    <List.Item
      style={{ paddingStart: 16 }}
      title={props.title}
      left={left}
      right={right}
      onPress={onPress}
    />
  )
})

const CattleListStatusFilterChip = () => {
  const firstRender = useRef(true)
  const cattleStatus = useCattleFilters('cattleStatus')
  const clearCattleStatus = useCattleFilters('clearCattleStatus')
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1)

  useEffect(() => {
    firstRender.current = false
  }, [bottomSheetIndex])

  const onPress = useCallback(() => {
    Keyboard.dismiss()
    setBottomSheetIndex(0)
  }, [])

  const onClose = useCallback(() => clearCattleStatus(), [])

  return (
    <>
      <FilterChip
        mode='outlined'
        icon='filter-outline'
        filters={Array.from(cattleStatus)}
        onPress={onPress}
        onClose={onClose}
      >
        Estado
      </FilterChip>
      {!firstRender.current && (
        <MBottomSheet
          index={bottomSheetIndex}
          onClose={() => setBottomSheetIndex(-1)}
        >
          <BottomSheetScrollView scrollEnabled={false}>
            <Text
              style={{ paddingHorizontal: 16 }}
              variant='titleMedium'
            >
              Estado
            </Text>
            <View style={{ paddingVertical: 16 }}>
              <ListItemFilter
                title='En producción'
                iconName='clock-fast'
                filter='En producción'
                checked={cattleStatus.has('En producción')}
              />
              <ListItemFilter
                title='Gestante'
                iconName='baby-bottle-outline'
                filter='Gestante'
                checked={cattleStatus.has('Gestante')}
              />
              <ListItemFilter
                title='De reemplazo'
                iconName='autorenew'
                filter='De reemplazo'
                checked={cattleStatus.has('De reemplazo')}
              />
              <ListItemFilter
                title='De deshecho'
                iconName='delete-clock-outline'
                filter='De deshecho'
                checked={cattleStatus.has('De deshecho')}
              />
            </View>
          </BottomSheetScrollView>
        </MBottomSheet>
      )}
    </>
  )
}

export default CattleListStatusFilterChip
