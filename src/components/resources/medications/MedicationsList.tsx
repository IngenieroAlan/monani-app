import Medication from '@/database/models/Medication'
import useMedications from '@/hooks/collections/useMedications'
import { useAppDispatch } from '@/hooks/useRedux'
import { setSelectedMedication } from '@/redux/slices/medicationsSlice'
import { show } from '@/redux/slices/uiVisibilitySlice'
import { withObservables } from '@nozbe/watermelondb/react'
import { FlashList } from '@shopify/flash-list'
import { memo, useEffect, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native'
import { Icon, IconButton, List, Menu, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { DELETE_MEDICATION_DIALOG_ID } from './DeleteMedicationDialog'
import { EDIT_MEDICATION_DIALOG_ID } from './EditMedicationDialog'
import { MedicationsSnackbarId } from './MedicationsSnackbarContainer'

const observeMedtication = withObservables(['medication'], ({ medication }: { medication: Medication }) => ({
  medication
}))

const ListItemMenu = ({ medication }: { medication: Medication }) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const insets = useSafeAreaInsets()
  const [canDelete, setCanDelete] = useState(true)
  const [menuVisible, setMenuVisible] = useState(false)

  useEffect(() => {
    const fetchDiets = async () => {
      const cattle = await medication.cattle
      setCanDelete(cattle.length === 0)
    }
    fetchDiets()
  }, [medication])

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
          dispatch(setSelectedMedication(medication))
          dispatch(show(EDIT_MEDICATION_DIALOG_ID))
          setMenuVisible(false)
        }}
      />
      <Menu.Item
        theme={{ colors: { onSurface: canDelete ? theme.colors.onSurface : theme.colors.onSurfaceDisabled } }}
        title='Eliminar'
        leadingIcon={() => (
          <Icon
            size={24}
            source='trash-can-outline'
            color={canDelete ? theme.colors.onSurface : theme.colors.onSurfaceDisabled}
          />
        )}
        onPress={() => {
          if (!canDelete) {
            dispatch(show(MedicationsSnackbarId.MEDICATION_IN_USE))
            return
          }

          dispatch(setSelectedMedication(medication))
          dispatch(show(DELETE_MEDICATION_DIALOG_ID))
          setMenuVisible(false)
        }}
      />
    </Menu>
  )
}

const ListItem = observeMedtication(({ medication }: { medication: Medication }) => {
  return (
    <List.Item
      style={{ paddingRight: 4 }}
      title={medication.name}
      description={medication.medicationType}
      right={() => <ListItemMenu medication={medication} />}
    />
  )
})

const MedicationsList = ({ onScroll }: { onScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void }) => {
  const { medications } = useMedications()

  return (
    <FlashList
      estimatedItemSize={81}
      onScroll={onScroll}
      data={medications}
      renderItem={({ item }) => <ListItem medication={item} />}
      keyExtractor={(item) => item.id}
      ListFooterComponent={() => <View style={{ height: 88 }} />}
    />
  )
}

export default memo(MedicationsList)
