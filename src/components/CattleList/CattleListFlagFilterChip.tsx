import FilterChip from '@/components/FilterChip'
import MBottomSheet from '@/components/MBottomSheet'
import { useCattleFilters } from '@/contexts/CattleFiltersContext'
import { CattleFlags } from '@/zustand/stores/cattleFiltersStore/types'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Keyboard, View } from 'react-native'
import { Checkbox, Icon, List, Text } from 'react-native-paper'

type ListItemFilterProps = {
  title: string
  iconName: string
  filter: keyof CattleFlags
  checked?: boolean
}

const ListItemFilter = memo((props: ListItemFilterProps) => {
  const setFlag = useCattleFilters('setFlag')
  const removeFlag = useCattleFilters('removeFlag')

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
    props.checked ? removeFlag(props.filter) : setFlag(props.filter)
  }, [props.checked, props.filter])

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

const CattleListFlagFilterChip = () => {
  const firstRender = useRef(true)
  const flags = useCattleFilters('flags')
  const clearFlags = useCattleFilters('clearFlags')
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1)

  useEffect(() => {
    firstRender.current = false
  }, [bottomSheetIndex])

  const filters = useMemo(() => {
    const filters: string[] = []

    for (const key of Object.keys(flags) as Array<keyof CattleFlags>) {
      switch (key) {
        case 'isActive':
          filters.push('Activo')
          break
        case 'isArchived':
          filters.push('Archivado')
          break
        case 'isSold':
          filters.push('Vendido')
          break
      }
    }
    return filters
  }, [flags])

  const onPress = useCallback(() => {
    Keyboard.dismiss()
    setBottomSheetIndex(0)
  }, [])

  const onClose = useCallback(() => clearFlags(), [])

  return (
    <>
      <FilterChip
        mode='outlined'
        icon='eye-outline'
        filters={filters}
        onPress={onPress}
        onClose={onClose}
      >
        Mostrar solo
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
              Mostrar solo
            </Text>
            <View style={{ paddingVertical: 16 }}>
              <ListItemFilter
                title='Activo'
                iconName='check'
                filter='isActive'
                checked={flags.isActive}
              />
              <ListItemFilter
                title='Archivado'
                iconName='archive-outline'
                filter='isArchived'
                checked={flags.isArchived}
              />
              <ListItemFilter
                title='Vendido'
                iconName='tag-outline'
                filter='isSold'
                checked={flags.isSold}
              />
            </View>
          </BottomSheetScrollView>
        </MBottomSheet>
      )}
    </>
  )
}

export default CattleListFlagFilterChip
