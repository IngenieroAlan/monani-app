import Medication from '@/database/models/Medication'
import { medicationsKeys } from '@/queries/medications/queryKeyFactory'
import { withObservables } from '@nozbe/watermelondb/react'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { List } from 'react-native-paper'
import { MedicationsListItemMenu } from './MedicationsListItemMenu'

const withObserver = withObservables(['medication'], ({ medication }: { medication: Medication }) => ({ medication }))

export const MedicationsListItem = withObserver(({ medication }: { medication: Medication }) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.setQueryData<Medication>(medicationsKeys.byId(medication.id), medication)
  }, [medication.id])

  return (
    <List.Item
      style={{ paddingRight: 4 }}
      title={medication.name}
      description={medication.medicationType}
      right={() => <MedicationsListItemMenu medication={medication} />}
    />
  )
})
