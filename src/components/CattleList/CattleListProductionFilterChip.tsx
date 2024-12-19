import FilterChip from '@/components/FilterChip'
import MBottomSheet from '@/components/MBottomSheet'
import { useCattleFilters } from '@/contexts/CattleFiltersContext'
import { ProductionType } from '@/database/models/Cattle'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Keyboard, View } from 'react-native'
import { Icon, List, RadioButton, Text, useTheme } from 'react-native-paper'

type ListItemFilterProps = {
  title: string
  iconName: string
  filter: ProductionType
  checked: boolean
}

const ListItemFilter = memo((props: ListItemFilterProps) => {
  const theme = useTheme()
  const setProductionType = useCattleFilters('setProductionType')

  const right = useCallback(() => {
    return (
      <RadioButton
        disabled={true}
        theme={{ colors: { onSurfaceDisabled: theme.colors.primary } }}
        status={props.checked ? 'checked' : 'unchecked'}
        value={props.filter}
      />
    )
  }, [props.checked, props.filter])

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

  const onPress = useCallback(() => {
    setProductionType(props.filter)
  }, [props.filter])

  return (
    <List.Item
      style={{ paddingStart: 16 }}
      title={props.title}
      right={right}
      left={left}
      onPress={onPress}
    />
  )
})

const CattleListProductionFilterChip = () => {
  const firstRender = useRef(true)
  const productionType = useCattleFilters('productionType')
  const setProductionType = useCattleFilters('setProductionType')
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1)

  useEffect(() => {
    firstRender.current = false
  }, [bottomSheetIndex])

  const onPress = useCallback(() => {
    Keyboard.dismiss()
    setBottomSheetIndex(0)
  }, [])

  return (
    <>
      <FilterChip
        mode='outlined'
        icon='filter-variant'
        filters={productionType ? [productionType] : []}
        onPress={onPress}
        onClose={() => setProductionType(undefined)}
      >
        Producción
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
              Producción
            </Text>
            <View style={{ paddingVertical: 16 }}>
              <ListItemFilter
                title='Lechera'
                iconName='beer-outline'
                filter='Lechera'
                checked={productionType === 'Lechera'}
              />
              <ListItemFilter
                title='De carne'
                iconName='food-steak'
                filter='De carne'
                checked={productionType === 'De carne'}
              />
            </View>
          </BottomSheetScrollView>
        </MBottomSheet>
      )}
    </>
  )
}

export default CattleListProductionFilterChip
