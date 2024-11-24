import DismissDialog from '@/components/DismissDialog'
import CattleSaleForm, { CattleSaleFields } from '@/components/forms/CattleSaleForm'
import { useAppSelector } from '@/hooks/useRedux'
import useAppTheme from '@/theme'
import CattleSaleSchema from '@/validationSchemas/CattleSaleSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigation, usePreventRemove } from '@react-navigation/native'
import { set } from 'date-fns'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm, UseFormSetValue } from 'react-hook-form'
import { Keyboard, View } from 'react-native'
import { Appbar, Button, HelperText, Icon, IconButton, Portal, Text } from 'react-native-paper'

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

  const onClosePress = useCallback(() => {
    Keyboard.dismiss()
    navigation.goBack()
  }, [])

  const onDismissConfirm = useCallback(() => {
    confirmGoBack.current = true
    navigation.goBack()
  }, [])

  return (
    <>
      <IconButton
        icon='close'
        onPress={onClosePress}
      />
      <Portal>
        <DismissDialog
          // Add dismiss snackbar ID
          visible={showDialog}
          onConfirm={onDismissConfirm}
          onCancel={() => setShowDialog(false)}
        />
      </Portal>
    </>
  )
}

const CreateCattleSaleView = () => {
  const theme = useAppTheme()
  const navigation = useNavigation()
  const cattle = useAppSelector((selector) => selector.cattles.cattleInfo)!
  const { control, formState, getValues, setValue, handleSubmit } = useForm<CattleSaleFields>({
    defaultValues: {
      soldBy: 0,
      pricePerKg: 0,
      soldAt: set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
    },
    resolver: zodResolver(CattleSaleSchema),
    mode: 'onChange'
  })

  const { isValid, isSubmitting, isSubmitSuccessful, dirtyFields } = formState
  const { pricePerKg, soldBy, soldAt } = getValues()

  useEffect(() => {
    if (!isSubmitSuccessful) return

    // TODO: Add show snackbar.
    navigation.goBack()
  }, [isSubmitSuccessful])

  /* Since some fields depends from other fields for updating, isDirty formState wasn't working correctly (my guess).
   * Even when all form values where the same as the default ones, it still was showing isDirty states as true.
   */
  const isDirty = useMemo(() => {
    return dirtyFields.soldAt === true || +pricePerKg !== 0 || +soldBy !== 0
  }, [pricePerKg, soldBy, soldAt])

  const onSubmit = useCallback(
    async (data: CattleSaleFields) => {
      await cattle.sell(data)
    },
    [cattle]
  )

  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <Appbar.Header>
        <CloseButton
          isDirty={dirtyFields.soldAt === true || +pricePerKg !== 0 || +soldBy !== 0}
          isSubmitSuccessful={isSubmitSuccessful}
        />
        <Appbar.Content title='Vender ganado' />
        <Button
          loading={isSubmitting}
          disabled={isSubmitting || !isValid || !isDirty}
          onPress={handleSubmit(onSubmit)}
        >
          Vender
        </Button>
      </Appbar.Header>
      <View style={{ paddingHorizontal: 16, gap: 16 }}>
        <CattleSaleForm
          control={control}
          formState={formState}
          getValues={getValues}
          setValue={
            setValue as UseFormSetValue<{
              soldBy: string | number
              pricePerKg: string | number
              soldAt: Date
            }>
          }
        />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ paddingVertical: 8 }}>
            <Icon
              size={20}
              source='information-outline'
            />
          </View>
          <HelperText type='info'>
            Al confirmar la venta, cualquier acción relacionada a este ganado como editar, eliminar, archivar, etc.
            dejará de estar disponible de manera permanente.
            <Text style={{ fontWeight: 'bold' }}> Esta acción es irreversible.</Text>
          </HelperText>
        </View>
      </View>
    </View>
  )
}

export default CreateCattleSaleView
