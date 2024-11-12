import { FeedProportion } from '@/database/models/DietFeed'
import MedicationSchedule from '@/database/models/MedicationSchedule'
import { TableName } from '@/database/schema'
import useMedications from '@/hooks/collections/useMedications'
import { withObservables } from '@nozbe/watermelondb/react'
import { memo, useCallback, useState } from 'react'
import { IconButton, List, Menu, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type DietFeedItem = {
  dietFeedId: string;
  dietId: string;
  feedId: string;
  feedAmount: number;
  percentage?: number;
  feedProportion: FeedProportion;
}

const observeMedicationSchedule = withObservables([TableName.MEDICATION_SCHEDULES], ({ medication_schedules }: { medication_schedules: MedicationSchedule }) => ({
  medication_schedules
}))

const ListItemMenu = (
  { MedicationScheduleId, onEdit, onDelete }: {
    MedicationScheduleId: string,
    onEdit: (MedicationScheduleId: string) => void,
    onDelete: (MedicationScheduleId: string) => void
  }
) => {
  const theme = useTheme()
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
          onEdit(MedicationScheduleId)
          setMenuVisible(false);
        }}
      />
      <Menu.Item
        theme={{ colors: { onSurface: theme.colors.onSurface } }}
        title='Eliminar'
        leadingIcon='minus'
        onPress={() => {
          onDelete(MedicationScheduleId)
          setMenuVisible(false);
        }}
      />
    </Menu>
  )
}

type MedicationScheduleProps = {
  medication_schedules: MedicationSchedule,
  onEdit: (MedicationScheduleId: string) => void,
  onDelete: (MedicationScheduleId: string) => void
}

const MedicationScheduleItem = observeMedicationSchedule(({ medication_schedules, onEdit, onDelete }: MedicationScheduleProps) => {
  const { medications } = useMedications()
  const findMedicationName = useCallback((MedicationId: string) => medications.find(medication => medication.id === MedicationId)?.name || '', [medications])
  return (
    <List.Item
      style={{ paddingVertical: 2, paddingRight: 8 }}
      title={findMedicationName(medication_schedules.medication.id)}
      description={medication_schedules.nextDoseAt.toLocaleString()}
      right={() => (
        <ListItemMenu
          MedicationScheduleId={medication_schedules.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    />
  )
})

export default memo(MedicationScheduleItem)
