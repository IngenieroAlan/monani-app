import { useMedicationContext } from '@/contexts'
import Medication from '@/database/models/Medication'
import { useAppDispatch } from '@/hooks/useRedux'
import { show } from '@/redux/slices/uiVisibilitySlice'
import useAppTheme from '@/theme'
import { useEffect, useState } from 'react'
import { Icon, IconButton, Menu } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { DELETE_MEDICATION_DIALOG_ID } from '../DeleteMedicationDialog'
import { EDIT_MEDICATION_DIALOG_ID } from '../EditMedicationDialog'
import { MedicationsSnackbarId } from '../MedicationsSnackbarContainer'

export const MedicationsListItemMenu = ({ medication }: { medication: Medication }) => {
  const theme = useAppTheme()
  const dispatch = useAppDispatch()
  const insets = useSafeAreaInsets()
  const { setValue: setMedicationContext } = useMedicationContext()
  const [canDelete, setCanDelete] = useState(true)
  const [menuVisible, setMenuVisible] = useState(false)

  useEffect(() => {
    ;(async () => {
      const cattle = await medication.cattle
      setCanDelete(cattle.length === 0)
    })()
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
          setMedicationContext(medication)
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

          setMedicationContext(medication)
          dispatch(show(DELETE_MEDICATION_DIALOG_ID))
          setMenuVisible(false)
        }}
      />
    </Menu>
  )
}
