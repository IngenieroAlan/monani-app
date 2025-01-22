import { FeedProportion } from '@/database/models/DietFeed'
import Medication from '@/database/models/Medication'
import MedicationSchedule from '@/database/models/MedicationSchedule'
import useMedications from '@/hooks/collections/useMedications'
import { withObservables } from '@nozbe/watermelondb/react'
import { memo, useCallback, useState } from 'react'
import { View } from 'react-native'
import { IconButton, List, Menu, Text, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type DietFeedItem = {
  dietFeedId: string
  dietId: string
  feedId: string
  feedAmount: number
  percentage?: number
  feedProportion: FeedProportion
}

const withMedicationScheduleObserver = withObservables(
  ['medicationSchedules'],
  ({ medicationSchedules }: { medicationSchedules: MedicationSchedule }) => ({
    medication_schedules: medicationSchedules
  })
)

const ListItemMenu = ({
  MedicationScheduleId,
  onEdit,
  onDelete
}: {
  MedicationScheduleId: string
  onEdit: (MedicationScheduleId: string) => void
  onDelete: (MedicationScheduleId: string) => void
}) => {
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
          setMenuVisible(false)
        }}
      />
      <Menu.Item
        theme={{ colors: { onSurface: theme.colors.onSurface } }}
        title='Eliminar'
        leadingIcon='minus'
        onPress={() => {
          onDelete(MedicationScheduleId)
          setMenuVisible(false)
        }}
      />
    </Menu>
  )
}

const ListItemTitle = ({ medication }: { medication: Medication }) => {
  return (
    <View>
      <Text variant='labelMedium'>{medication.medicationType}</Text>
      <Text variant='bodyLarge'>{medication.name}</Text>
    </View>
  )
}

type MedicationScheduleProps = {
  medication_schedules: MedicationSchedule
  onEdit: (MedicationScheduleId: string) => void
  onDelete: (MedicationScheduleId: string) => void
}

const MedicationScheduleItem = withMedicationScheduleObserver(
  ({ medication_schedules, onEdit, onDelete }: MedicationScheduleProps) => {
    const { medicationsRecords } = useMedications()
    const findMedication = useCallback(
      (MedicationId: string) => medicationsRecords.find((medication) => medication.id === MedicationId) || '',
      [medicationsRecords, medication_schedules]
    )
    return (
      <List.Item
        style={{ paddingVertical: 2, paddingRight: 8 }}
        title={<ListItemTitle medication={findMedication(medication_schedules.medication.id) as Medication} />}
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
  }
)

export default memo(MedicationScheduleItem)
