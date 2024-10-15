import { CattleStatus } from '@/database/models/Cattle'
import { setOneOfCattleStatusBind } from '@/redux/slices/homeCattleListQuerySlice'
import { removeCattleStatusFilter, setCattleStatusFilter } from '@/redux/slices/homeStatusFilterSlice'
import { RootState } from '@/redux/store/store'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { memo, useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import { Checkbox, Icon, List, Text } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import MBottomSheet from '../MBottomSheet'

type ListItemFilterProps = {
  title: string
  iconName: string
  filter: CattleStatus
  checked?: boolean
}

const ListItemFilter = memo((props: ListItemFilterProps) => {
  const dispatch = useDispatch()
  const [isChecked, setIsChecked] = useState(props.checked ?? false)

  useEffect(() => {
    setIsChecked(props.checked ?? false)
  }, [props.checked])

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
    return <Checkbox status={isChecked ? 'checked' : 'unchecked'} />
  }, [isChecked])

  const onPress = () => {
    setIsChecked((prevCheck) => {
      const newCheck = !prevCheck
      newCheck ? dispatch(setCattleStatusFilter(props.filter)) : dispatch(removeCattleStatusFilter(props.filter))

      return newCheck
    })
  }

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

const BottomSheetStatusFilter = () => {
  const dispatch = useDispatch()
  const index = useSelector((state: RootState) => state.bottomSheet['homeStatusFilter'] ?? -1)
  const statusFilter = useSelector((state: RootState) => state.homeFilters.cattleStatusFilter)
  const oneOfCattleStatusBind = useSelector(
    (state: RootState) => state.homeCattleListQuery.whereBinds.oneOfCattleStatus
  )

  // OnChange triggers slightly faster than onClose.
  const onChange = useCallback((i: number) => {
    if (i !== -1) return

    const filters = [...statusFilter]
    const bindClone = oneOfCattleStatusBind.slice()

    // If filters selected and already fetched are equals, don't fetch again.
    if (filters.sort().join(' ') !== bindClone.sort().join(' ')) {
      dispatch(setOneOfCattleStatusBind(filters))
    }

  }, [statusFilter, oneOfCattleStatusBind])

  return (
    <MBottomSheet
      id='homeStatusFilter'
      index={index}
      onChange={onChange}
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
            checked={statusFilter.has('En producción')}
          />
          <ListItemFilter
            title='Gestante'
            iconName='baby-bottle-outline'
            filter='Gestante'
            checked={statusFilter.has('Gestante')}
          />
          <ListItemFilter
            title='De reemplazo'
            iconName='autorenew'
            filter='De reemplazo'
            checked={statusFilter.has('De reemplazo')}
          />
          <ListItemFilter
            title='De deshecho'
            iconName='delete-clock-outline'
            filter='De deshecho'
            checked={statusFilter.has('De deshecho')}
          />
        </View>
      </BottomSheetScrollView>
    </MBottomSheet>
  )
}

export default memo(BottomSheetStatusFilter)
