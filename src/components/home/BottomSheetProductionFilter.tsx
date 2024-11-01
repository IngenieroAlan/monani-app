import { ProductionType } from '@/database/models/Cattle'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { setEqProductionType } from '@/redux/slices/collections/cattleQuerySlice'
import { RootState } from '@/redux/store/store'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { memo, useCallback } from 'react'
import { View } from 'react-native'
import { Icon, List, RadioButton, Text, useTheme } from 'react-native-paper'
import MBottomSheet from '../MBottomSheet'

type ListItemFilterProps = {
  title: string
  iconName: string
  filter: ProductionType
}

const ListItemFilter = memo((props: ListItemFilterProps) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const productionFilter = useAppSelector((state: RootState) => state.cattleQuery.eqProductionType)

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
    dispatch(setEqProductionType(props.filter))
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
  const index = useAppSelector((state: RootState) => state.bottomSheet['homeProductionFilter'] ?? -1)

  return (
    <MBottomSheet
      id='homeProductionFilter'
      index={index}
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
