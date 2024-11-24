import { useAppSelector } from '@/hooks/useRedux'
import CattleSaleSchema from '@/validationSchemas/CattleSaleSchema'
import { useEffect, useRef } from 'react'
import { Control, FormState, UseFormGetValues, UseFormSetValue, useWatch } from 'react-hook-form'
import { TextInput as NativeTextInput, View } from 'react-native'
import { TextInput } from 'react-native-paper'
import { z } from 'zod'
import { CustomTextInput } from '../CustomTextInput'
import MDatePickerInput from '../MDatePickerInput'

export type CattleSaleFields = z.infer<typeof CattleSaleSchema>

const CattleSaleForm = ({
  control,
  formState,
  getValues,
  setValue
}: {
  control: Control<CattleSaleFields>
  formState: FormState<CattleSaleFields>
  getValues: UseFormGetValues<CattleSaleFields>
  setValue: UseFormSetValue<{
    soldBy: number | string
    pricePerKg: number | string
    soldAt: Date
  }>
}) => {
  const soldByWatcher = useWatch({
    control,
    name: 'soldBy'
  })
  const pricePerKgWatcher = useWatch({
    control,
    name: 'pricePerKg'
  })
  const soldByTextInputRef = useRef<NativeTextInput>(null)
  const pricePerKgTextInputRef = useRef<NativeTextInput>(null)
  const { errors } = formState
  const { soldBy, pricePerKg } = getValues()
  const cattle = useAppSelector((state) => state.cattles.cattleInfo)!

  useEffect(() => {
    if (!soldByTextInputRef.current?.isFocused()) return

    const pricePerKgValue = +(soldBy / cattle.weight)
    setValue('pricePerKg', isNaN(pricePerKgValue) ? 0 : pricePerKgValue.toFixed(2), {
      shouldValidate: true,
      shouldDirty: true
    })
  }, [soldByWatcher])

  useEffect(() => {
    if (!pricePerKgTextInputRef.current?.isFocused()) return

    const soldByValue = +(cattle.weight * pricePerKg)
    setValue('soldBy', isNaN(soldByValue) ? 0 : soldByValue.toFixed(2), {
      shouldValidate: true,
      shouldDirty: true
    })
  }, [pricePerKgWatcher])

  return (
    <View style={{ gap: 16 }}>
      <CustomTextInput
        control={control}
        name='soldBy'
        label='Monto'
        errors={errors.soldBy}
        helperText={errors.soldBy?.message || ''}
        more={{
          ref: soldByTextInputRef,
          left: <TextInput.Affix text='$' />,
          autoFocus: true,
          keyboardType: 'numeric'
        }}
      />
      <CustomTextInput
        control={control}
        name='pricePerKg'
        label='Precio por kg.'
        errors={errors.pricePerKg}
        helperText={errors.pricePerKg?.message || ''}
        more={{
          ref: pricePerKgTextInputRef,
          left: <TextInput.Affix text='$' />,
          right: <TextInput.Affix text={`× ${cattle.weight.toFixed(3)} kg.`} />,
          keyboardType: 'numeric'
        }}
      />
      <MDatePickerInput
        control={control}
        name='soldAt'
        label='Fecha de venta*'
        errors={errors.soldAt}
        inputMode='start'
      />
    </View>
  )
}

export default CattleSaleForm
