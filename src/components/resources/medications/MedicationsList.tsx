import Medication from '@/database/models/Medication'
import useMedications from '@/hooks/collections/useMedications'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { setMedications } from '@/redux/slices/medicationsSlice'
import { RootState } from '@/redux/store/store'
import { withObservables } from '@nozbe/watermelondb/react'
import { forwardRef, memo, Ref, useEffect, useState } from 'react'
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native'
import { Icon, IconButton, List, Menu, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
          // dispatch(setSelectedFeed(feed))
          // dispatch(show(EDIT_FEED_DIALOG_ID))
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
            // dispatch(show(ResourcesSnackbarId.FEED_IN_USE))
            return
          }

          // dispatch(setSelectedFeed(feed))
          // dispatch(show(DELETE_FEED_DIALOG_ID))
          setMenuVisible(false)
        }}
      />
    </Menu>
  )
}

const ListItem = memo(
  observeMedtication(({ medication }: { medication: Medication }) => {
    return (
      <List.Item
        style={{ paddingVertical: 2, paddingRight: 8 }}
        title={medication.name}
        description={medication.medicationType}
        right={() => <ListItemMenu medication={medication} />}
      />
    )
  })
)

const MedicationsList = (
  { onScroll }: { onScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void },
  ref?: Ref<FlatList>
) => {
  const dispatch = useAppDispatch()
  const { getMedications } = useMedications()
  const medications = useAppSelector((state: RootState) => state.medications.records)

  useEffect(() => {
    const fetchMedications = async () => {
      dispatch(setMedications(await getMedications()))
    }

    if (medications.length === 0) fetchMedications()
  }, [medications])

  return (
    <FlatList
      ref={ref}
      onScroll={onScroll}
      data={medications}
      renderItem={({ item }) => <ListItem medication={item} />}
      keyExtractor={(item) => item.id}
      ListFooterComponent={() => <View style={{ height: 88 }} />}
    />
  )
}

export default memo(forwardRef(MedicationsList))
