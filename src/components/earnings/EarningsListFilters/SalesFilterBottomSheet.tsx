import { SalesType } from '@/hooks/collections/useEarnings'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { setEqSalesType } from '@/redux/slices/collections/earningsQuerySlice'
import { RootState } from '@/redux/store/store'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { memo, useCallback } from 'react'
import { View } from 'react-native'
import { Icon, List, RadioButton, Text, useTheme } from 'react-native-paper'
import MBottomSheet from '../../MBottomSheet'

type BottomSheetProps = {
  index: number
  setIndex: (n: number) => void
  listId: string
}

type ListItemFilterProps = {
  title: string
  iconName: string
  filter: SalesType
  listId: string
}

const ListItemFilter = ({ title, iconName, filter, listId }: ListItemFilterProps) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const eqSalesType = useAppSelector((state: RootState) => state.earningsQuery[listId]?.eqSalesType)

  const onPress = useCallback(() => {
    dispatch(setEqSalesType({ listId: listId, eqSalesType: filter }))
  }, [filter])

  const right = useCallback(() => {
    return (
      <RadioButton
        disabled={true}
        theme={{ colors: { onSurfaceDisabled: theme.colors.primary } }}
        status={eqSalesType === filter ? 'checked' : 'unchecked'}
        value={filter}
      />
    )
  }, [eqSalesType, filter])

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
}

const SalesFilterBottomSheet = ({ index, setIndex, listId }: BottomSheetProps) => {
  return (
    <MBottomSheet
      index={index}
      onClose={() => setIndex(-1)}
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
            listId={listId}
          />
          <ListItemFilter
            title='Lechera'
            iconName='beer-outline'
            filter='Lechera'
            listId={listId}
          />
        </View>
      </BottomSheetScrollView>
    </MBottomSheet>
  )
}

export default memo(SalesFilterBottomSheet)
