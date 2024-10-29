import { SalesType } from '@/hooks/collections/useEarnings'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { setEqSalesType } from '@/redux/slices/collections/earningsQuerySlice'
import { RootState } from '@/redux/store/store'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { memo, useCallback } from 'react'
import { View } from 'react-native'
import { Icon, List, RadioButton, Text, useTheme } from 'react-native-paper'
import MBottomSheet from '../MBottomSheet'

export const SALES_FILTER_BOTTOM_SHEET_ID = 'salesFilterBottomSheet'

type ListItemFilterProps = {
  title: string
  iconName: string
  filter: SalesType
}

const ListItemFilter = memo(({ title, iconName, filter }: ListItemFilterProps) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const salesTypeFilter = useAppSelector((state: RootState) => state.earningsQuery.eqSalesType)

  const onPress = useCallback(() => {
    dispatch(setEqSalesType(filter))
  }, [filter])

  const right = useCallback(() => {
    return (
      <RadioButton
        disabled={true}
        theme={{ colors: { onSurfaceDisabled: theme.colors.primary } }}
        status={salesTypeFilter === filter ? 'checked' : 'unchecked'}
        value={filter}
      />
    )
  }, [salesTypeFilter, filter])

  const left = useCallback(() => {
    return (
      <View style={{ justifyContent: 'center' }}>
        <Icon
          size={24}
          source={iconName}
        />
      </View>
    )
  }, [iconName])

  return (
    <List.Item
      title={title}
      left={left}
      right={right}
      onPress={onPress}
      style={{ paddingStart: 16 }}
    />
  )
})

const SalesFilterBottomSheet = () => {
  const index = useAppSelector((state: RootState) => state.bottomSheet[SALES_FILTER_BOTTOM_SHEET_ID] ?? -1)

  return (
    <MBottomSheet
      id={SALES_FILTER_BOTTOM_SHEET_ID}
      index={index}
    >
      <BottomSheetScrollView scrollEnabled={false}>
        <Text
          style={{ paddingHorizontal: 16 }}
          variant='titleMedium'
        >
          Tipo de venta
        </Text>
        <View style={{ paddingVertical: 16 }}>
          <ListItemFilter
            title='Ganado'
            iconName='cow'
            filter='Ganado'
          />
          <ListItemFilter
            title='Lechera'
            iconName='beer-outline'
            filter='Lechera'
          />
        </View>
      </BottomSheetScrollView>
    </MBottomSheet>
  )
}

export default SalesFilterBottomSheet
