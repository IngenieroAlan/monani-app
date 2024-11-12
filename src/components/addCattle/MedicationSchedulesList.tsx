import { useAppDispatch } from '@/hooks/useRedux'
import { ACMedicationSchedule, } from '@/interfaces/cattleInterfaces'
import { deleteMedicationSchedule } from '@/redux/slices/addCattleSlice'
import { MedicationSchedulesNavigationProps } from '@/views/addCattle/Medications'
import { memo, useState } from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { IconButton, List, Menu, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type navigationProps = MedicationSchedulesNavigationProps['navigation']

const ListItemMenu = (
  { medicationScheduleId, navigation }: { medicationScheduleId: string, navigation: navigationProps }
) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const insets = useSafeAreaInsets()
  const [menuVisible, setMenuVisible] = useState(false)

  return (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchorPosition='bottom'
      statusBarHeight={insets.top}
      anchor={
        <IconButton
          icon='dots-vertical'
          onPress={() => setMenuVisible(true)}
        />
      }
    >
      <Menu.Item
        title='Editar'
        leadingIcon='pencil-outline'
        onPress={() => {
          setMenuVisible(false);
          navigation.navigate('Medication', {
            medicationScheduleId: medicationScheduleId,
            modify: true
          });
        }}
      />
      <Menu.Item
        theme={{ colors: { onSurface: theme.colors.onSurface } }}
        title='Eliminar'
        leadingIcon='minus'
        onPress={() => {
          setMenuVisible(false);
          dispatch(deleteMedicationSchedule({ medicationScheduleId: medicationScheduleId }))
        }}
      />
    </Menu>
  )
}

const ListItem = (
  { medicationSchedule: medicationSchedule, navigation }: { medicationSchedule: ACMedicationSchedule, navigation: navigationProps }
) => {
  return (
    <List.Item
      style={{ paddingVertical: 2, paddingRight: 8 }}
      title={medicationSchedule.medication.name}
      description={medicationSchedule.medication.medicationType}
      right={() => (
        <ListItemMenu
          medicationScheduleId={medicationSchedule.medicationScheduleId}
          navigation={navigation}
        />
      )}
    />
  )
}

const MedicationSchedulesList = (
  { medicationSchedules, navigation }: { medicationSchedules: ACMedicationSchedule[], navigation: navigationProps }
) => {
  return (
    <FlatList
      data={medicationSchedules}
      renderItem={({ item }) => (
        <ListItem
          medicationSchedule={item}
          navigation={navigation}
        />
      )}
      keyExtractor={(item) => item.medicationScheduleId}
      ListFooterComponent={() => <View style={{ height: 88 }} />}
    />
  )
}

export default memo(MedicationSchedulesList)
