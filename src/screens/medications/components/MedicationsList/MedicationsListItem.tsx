import Medication from '@/database/models/Medication'
import { withObservables } from '@nozbe/watermelondb/react'
import { List } from 'react-native-paper'
import { MedicationsListItemMenu } from './MedicationsListItemMenu'

const withObserver = withObservables(['medication'], ({ medication }: { medication: Medication }) => ({ medication }))

export const MedicationsListItem = withObserver(({ medication }: { medication: Medication }) => {
  return (
    <List.Item
      style={{ paddingRight: 4 }}
      title={medication.name}
      description={medication.medicationType}
      right={() => <MedicationsListItemMenu medication={medication} />}
    />
  )
})
