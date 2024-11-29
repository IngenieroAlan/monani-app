import MilkReport from '@/database/models/MilkReport'
import { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, IconButton, List, Menu, Text } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type MilkReportItemProps = {
  milkReport: MilkReport
  totalLiters: number
  color: string
}

const MenuItem = ({ isSold }: { isSold: boolean }) => {
  const insets = useSafeAreaInsets()
  const [visible, setVisible] = useState(false)

  const onPress = useCallback(() => {
    if (!isSold) setVisible(true)
  }, [])

  if (isSold) {
    return (
      <Icon
        source='bookmark-check-outline'
        size={24}
      />
    )
  }

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
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
        onPress={() => {}}
      />
      <Menu.Item
        title='Eliminar'
        leadingIcon='trash-can-outline'
        onPress={() => {}}
      />
    </Menu>
  )
}

const ItemRight = ({ productionNumber, isSold }: { productionNumber: number; isSold: boolean }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: isSold ? 16 : 4, gap: isSold ? 16 : 0 }}>
      <Text variant='labelSmall'>Producción {productionNumber}</Text>
      <MenuItem isSold={isSold} />
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
      right={() => (
        <ItemRight
          isSold={milkReport.isSold}
          productionNumber={milkReport.productionNumber}
        />
      )}
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
