import DismissDialog from '@/components/DismissDialog'
import CattleArchiveForm, { CattleArchiveFields } from '@/components/forms/CattleArchiveForm'
import MSnackbar from '@/components/MSnackbar'
import useCattleArchive from '@/hooks/collections/useCattleArchive'
import { useAppSelector } from '@/hooks/useRedux'
import useAppTheme from '@/theme'
import CattleArchiveSchema from '@/validationSchemas/CattleArchiveSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigation } from '@react-navigation/native'
import { set } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Appbar, Button, IconButton, Portal } from 'react-native-paper'

const CloseButton = ({ isDirty }: { isDirty: Boolean }) => {
  const navigation = useNavigation()
  const [showDialog, setShowDialog] = useState(false)

  const onClose = useCallback(() => {
    if (isDirty) {
      setShowDialog(true)
      return
    }

    navigation.goBack()
  }, [isDirty])

  const onDismissCancel = useCallback(() => {
    setShowDialog(false)
    navigation.goBack()
  }, [])

  return (
    <>
      <IconButton
        icon='close'
        onPress={onClose}
      />
      <Portal>
        <DismissDialog
          visible={showDialog}
          onConfirm={onDismissCancel}
          onCancel={() => setShowDialog(false)}
        />
      </Portal>
    </>
  )
}

const EditCattleArchiveView = () => {
  const theme = useAppTheme()
  const navigation = useNavigation()
  const cattle = useAppSelector((state) => state.cattles.cattleInfo)
  const { cattleArchive } = useCattleArchive(cattle!)
  const { control, handleSubmit, reset, formState } = useForm<CattleArchiveFields>({
    resolver: zodResolver(CattleArchiveSchema),
    mode: 'onTouched'
  })

  const { isDirty, isValid, isSubmitting } = formState

  useEffect(() => {
    if (!cattleArchive) return

    reset({
      reason: cattleArchive.reason,
      archivedAt: set(cattleArchive.archivedAt, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }),
      notes: cattleArchive.notes || ''
    })
  }, [cattleArchive])

  const onSubmit = useCallback(
    async (data: CattleArchiveFields) => {
      if (!cattleArchive) return

      await cattleArchive.updateArchive(data)
      navigation.goBack()
    },
    [cattleArchive]
  )

  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <Appbar.Header>
        <CloseButton isDirty={isDirty} />
        <Appbar.Content title='Editar archivo' />
        <Button
          loading={isSubmitting}
          disabled={isSubmitting || !isValid || !isDirty}
          onPress={handleSubmit(onSubmit)}
        >
          Guardar
        </Button>
      </Appbar.Header>
      <View style={{ padding: 16, paddingTop: 0 }}>
        <CattleArchiveForm
          control={control}
          formState={formState}
        />
      </View>
    </View>
  )
}

export default EditCattleArchiveView
