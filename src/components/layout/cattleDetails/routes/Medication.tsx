import MedicationScheduleItem from '@/components/layout/cattleDetails/Components/medicationSchedules/MedicationScheduleItem'
import MedicationSchedulesSnackbarContainer, {
  MedicationSchedulesSnackbarId
} from '@/components/layout/cattleDetails/Components/medicationSchedules/MedicationSchedulesSnackbarContainer'
import Cattle from '@/database/models/Cattle'
import { TableName } from '@/database/schema'
import useMedicationSchedules from '@/hooks/collections/useMedicationSchedule'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { show } from '@/redux/slices/uiVisibilitySlice'
import { cattleDetails } from '@/styles/main'
import { withObservables } from '@nozbe/watermelondb/react'
import { useNavigation } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useCallback, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Icon, Text } from 'react-native-paper'

export const MedicationRoute = () => {
  const { cattleInfo } = useAppSelector((state) => state.cattles)
  return (
    <>
      {cattleInfo && <CattleMedicationsDetails cattle={cattleInfo} />}
      <MedicationSchedulesSnackbarContainer />
    </>
  )
}

const witCattleObserver = withObservables([TableName.CATTLE], ({ cattle }: { cattle: Cattle }) => ({
  cattle
}))

const ListEmptyComponent = () => {
  return (
    <View style={styles.emtpyListContainer}>
      <Icon
        size={56}
        source='cow-off'
      />
      <Text
        style={{ textAlign: 'center' }}
        variant='titleMedium'
      >
        No se han encontrado coincidencias.
      </Text>
    </View>
  )
}

const CattleMedicationsDetails = witCattleObserver(({ cattle }: { cattle: Cattle }) => {
  const { medicationSchedules } = useMedicationSchedules(cattle)
  const [index, setIndex] = useState(0)
  const navigation = useNavigation()
  const dispatch = useAppDispatch()

  const onEdit = useCallback((medicationScheduleId: string) => {
    navigation.navigate('CattleStack', {
      screen: 'MedicationScheduleRoute',
      params: { medicationScheduleId, modify: true }
    })
    // navigation.navigate('MedicationScheduleRoute', { medicationScheduleId, modify: true });
  }, [])

  const onDelete = useCallback(
    (medicationScheduleId: string) => {
      const medicationSchedule = medicationSchedules?.find(
        (medicationSchedule) => medicationSchedule.id === medicationScheduleId
      )
      const deleteDietFeed = async () => {
        medicationSchedule && (await medicationSchedule.delete())
        dispatch(show(MedicationSchedulesSnackbarId.REMOVED_MEDICATION_SCHEDULE))
      }
      deleteDietFeed()
    },
    [medicationSchedules]
  )

  return (
    <ScrollView style={[cattleDetails.container, cattleDetails.cardsContainer]}>
      <FlashList
        estimatedItemSize={88}
        data={medicationSchedules}
        renderItem={({ item }) => (
          <MedicationScheduleItem
            medication_schedules={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        keyExtractor={(item) => item.id}
        ListFooterComponent={() => <View style={{ height: 88 }} />}
        ListEmptyComponent={() => <ListEmptyComponent />}
        onEndReachedThreshold={2}
        onEndReached={() => setIndex(index + 1)}
      />
    </ScrollView>
  )
})

const styles = StyleSheet.create({
  emtpyListContainer: {
    height: '100%',
    marginVertical: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 16
  }
})
