import CattleArchiveForm, { CattleArchiveFields } from '@/components/forms/CattleArchiveForm'
import { useAppSelector } from '@/hooks/useRedux'
import useAppTheme from '@/theme'
import CattleArchiveSchema from '@/validationSchemas/CattleArchiveSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigation } from '@react-navigation/native'
import { set } from 'date-fns'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Appbar, Button, IconButton } from 'react-native-paper'

const CreateCattleArchiveView = () => {
  const theme = useAppTheme()
  const navigation = useNavigation()
  const cattle = useAppSelector((state) => state.cattles.cattleInfo)
  const { control, handleSubmit, reset, formState } = useForm<CattleArchiveFields>({
    defaultValues: {
      reason: undefined,
      archivedAt: set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }),
      notes: undefined
    },
    resolver: zodResolver(CattleArchiveSchema),
    mode: 'onChange'
  })

  const { isDirty, isValid, isSubmitting } = formState

  useEffect(() => reset(), [])

  const onSubmit = useCallback(async (data: CattleArchiveFields) => {
    if (!cattle) return

    await cattle.markAsArchived(data)
    navigation.goBack()
  }, [cattle])

  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <Appbar.Header>
        <IconButton
          icon='close'
          onPress={navigation.goBack}
        />
        <Appbar.Content title='Archivar ganado' />
        <Button
          loading={isSubmitting}
          disabled={isSubmitting || !isValid || !isDirty}
          onPress={handleSubmit(onSubmit)}
        >
          Archivar
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

export default CreateCattleArchiveView
