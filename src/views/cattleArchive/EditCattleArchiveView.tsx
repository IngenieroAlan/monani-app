import DismissDialog from '@/components/DismissDialog'
import CattleArchiveForm, { CattleArchiveFields } from '@/components/forms/CattleArchiveForm'
import useCattleArchive from '@/hooks/collections/useCattleArchive'
import { useAppSelector } from '@/hooks/useRedux'
import useAppTheme from '@/theme'
import CattleArchiveSchema from '@/validationSchemas/CattleArchiveSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigation, usePreventRemove } from '@react-navigation/native'
import { set } from 'date-fns'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Appbar, Button, IconButton, Portal } from 'react-native-paper'

const CloseButton = ({ isDirty, isSubmitSuccessful }: { isDirty: boolean; isSubmitSuccessful: boolean }) => {
  const navigation = useNavigation()
  const [showDialog, setShowDialog] = useState(false)
  const confirmGoBack = useRef(false)

  usePreventRemove(isDirty && !isSubmitSuccessful, ({ data }) => {
    if (!confirmGoBack.current) {
      setShowDialog(true)
      return
    }

    setShowDialog(false)
    navigation.dispatch(data.action)
  })

  const onDismissConfirm = useCallback(() => {
    confirmGoBack.current = true
    navigation.goBack()
  }, [])

  return (
    <>
      <IconButton
        icon='close'
        onPress={navigation.goBack}
      />
      <Portal>
        <DismissDialog
          visible={showDialog}
          onConfirm={onDismissConfirm}
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

  const { isDirty, isValid, isSubmitting, isSubmitSuccessful } = formState

  useEffect(() => {
    if (isSubmitSuccessful) navigation.goBack()
  }, [isSubmitSuccessful])

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
    },
    [cattleArchive]
  )

  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <Appbar.Header>
        <CloseButton
          isDirty={isDirty}
          isSubmitSuccessful={isSubmitSuccessful}
        />
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
