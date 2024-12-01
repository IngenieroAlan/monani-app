import { useMilkReportContext } from '@/contexts'
import MilkReport from '@/database/models/MilkReport'
import { useAppDispatch } from '@/hooks/useRedux'
import { show } from '@/redux/slices/uiVisibilitySlice'
import { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, IconButton, List, Menu, Text } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { EDIT_MILK_REPORT_DIALOG_ID } from '../EditMilkReportDialog'

type MilkReportItemProps = {
  milkReport: MilkReport
  totalLiters: number
  color: string
}

const MenuItem = ({ milkReport }: { milkReport: MilkReport }) => {
  const insets = useSafeAreaInsets()
  const dispatch = useAppDispatch()
  const { setValue: setMilkReport } = useMilkReportContext()
  const [showMenu, setShowMenu] = useState(false)

  const onPress = useCallback(() => {
    if (!milkReport.isSold) setShowMenu(true)
  }, [])

  if (milkReport.isSold) {
    return (
      <Icon
        source='bookmark-check-outline'
        size={24}
      />
    )
  }

  return (
    <Menu
      visible={showMenu}
      onDismiss={() => setShowMenu(false)}
      anchorPosition='bottom'
      statusBarHeight={insets.top}
      anchor={
        <IconButton
          icon='dots-vertical'
          onPress={onPress}
        />
      }
    >
      <Menu.Item
        title='Editar'
        leadingIcon='pencil-outline'
        onPress={() => {
          setShowMenu(false)
          dispatch(show(EDIT_MILK_REPORT_DIALOG_ID))
          setMilkReport(milkReport)
        }}
      />
      <Menu.Item
        title='Eliminar'
        leadingIcon='trash-can-outline'
        onPress={() => {}}
      />
    </Menu>
  )
}

const ItemRight = ({ milkReport }: { milkReport: MilkReport }) => {
  const { isSold, productionNumber } = milkReport

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: isSold ? 16 : 4, gap: isSold ? 16 : 0 }}>
      <Text variant='labelSmall'>Producción {productionNumber}</Text>
      <MenuItem milkReport={milkReport} />
    </View>
  )
}

// It might be necessary an observer here later, but for now it is not needed.
const MilkReportItem = (props: MilkReportItemProps) => {
  const { milkReport, totalLiters, color } = props

  return (
    <List.Item
      title={`${milkReport.liters} L.`}
      description={`${((milkReport.liters / totalLiters) * 100).toFixed(1)}%`}
      left={() => <View style={[styles.dot, { backgroundColor: color }]} />}
      right={() => <ItemRight milkReport={props.milkReport} />}
      style={styles.listItem}
    />
  )
}

export default MilkReportItem

const styles = StyleSheet.create({
  dot: {
    borderRadius: 12,
    width: 12,
    height: 12,
    marginVertical: 'auto'
  },
  listItem: {
    paddingLeft: 32,
    paddingRight: 0
  }
})
