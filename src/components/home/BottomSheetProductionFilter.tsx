import { ProductionType } from '@/database/models/Cattle'
import { setEqProductionTypeBind } from '@/redux/slices/homeCattleListQuerySlice'
import { setProductionTypeFilter } from '@/redux/slices/homeStatusFilterSlice'
import { RootState } from '@/redux/store/store'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { memo, useCallback } from 'react'
import { View } from 'react-native'
import { Icon, List, RadioButton, Text, useTheme } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import MBottomSheet from '../MBottomSheet'

type ListItemFilterProps = {
  title: string
  iconName: string
  filter: ProductionType
}

const ListItemFilter = memo((props: ListItemFilterProps) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const productionFilter = useSelector((state: RootState) => state.homeFilters.productionTypeFilter)

  const right = useCallback(() => {
    return (
      <RadioButton
        disabled={true}
        theme={{ colors: { onSurfaceDisabled: theme.colors.primary } }}
        status={productionFilter === props.filter ? 'checked' : 'unchecked'}
        value={props.filter}
      />
    )
  }, [productionFilter, props.filter])

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
    dispatch(setProductionTypeFilter(props.filter))
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

const BottomSheetProductionFilter = () => {
  const dispatch = useDispatch()
  const index = useSelector((state: RootState) => state.bottomSheet['homeProductionFilter'] ?? -1)
  const productionFilter = useSelector((state: RootState) => state.homeFilters.productionTypeFilter)

  const onChange = useCallback(
    (i: number) => {
      if (i !== -1) return

      dispatch(setEqProductionTypeBind(productionFilter))
    },
    [productionFilter]
  )

  return (
    <MBottomSheet
      id='homeProductionFilter'
      index={index}
      onChange={onChange}
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
          />
          <ListItemFilter
            title='De carne'
            iconName='food-steak'
            filter='De carne'
          />
        </View>
      </BottomSheetScrollView>
    </MBottomSheet>
  )
}

export default BottomSheetProductionFilter
