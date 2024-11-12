import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { AddCattleStackParamsList } from "@/navigation/types";
import { setDiet } from "@/redux/slices/addCattleSlice";
import ACDietSchema, { ACDietFields } from "@/validationSchemas/ACDietSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Appbar, Button, IconButton } from "react-native-paper";
import DietSnackBarContainer, { DietSnackbarId } from "../dietFeedRoute/DietSnackBarContainer";
import DietSettingsForm from "../forms/DietSettingsForm";
import { show } from "@/redux/slices/uiVisibilitySlice";

export default function DietSettings({ navigation }: NativeStackScreenProps<AddCattleStackParamsList, 'DietSettings'>) {
  const { cattle, diet } = useAppSelector(state => state.addCattle)
  const dispatch = useAppDispatch();

  const initialDietFeedValues = diet ? {
    waterAmount: diet.waterAmount ?? 0,
    matterProportion: diet.matterProportion,
    quantity: diet.matterProportion === 'Fija' ? diet.matterAmount : diet.percentage,
    isConcentrateExcluded: diet.isConcentrateExcluded ?? false
  } : undefined

  const {
    control,
    handleSubmit,
    getValues,
    formState
  } = useForm<ACDietFields>({
    defaultValues: initialDietFeedValues || {
      waterAmount: undefined,
      matterProportion: 'Sin definir',
      quantity: undefined,
      isConcentrateExcluded: false
    },
    resolver: zodResolver(ACDietSchema),
    mode: 'onTouched'
  })
  const { isSubmitting, isValid, errors, isDirty } = formState

  const onSubmit = useCallback(() => {
    const matterProportion = getValues('matterProportion')
    const waterAmount = getValues('waterAmount')
    const quantity = getValues('quantity')
    const isConcentrateExcluded = getValues('isConcentrateExcluded')
    const percentage = matterProportion === 'Porcentaje de peso' ? quantity : undefined

    let matterAmount;
    if (quantity !== undefined) {
      if (matterProportion === 'Fija') {
        matterAmount = quantity
      } else if (matterProportion === 'Porcentaje de peso') {
        matterAmount = cattle.weight * (quantity / 100)
      }
    }

    dispatch(setDiet({
      diet: {
        dietId: diet.dietId,
        matterAmount: matterAmount,
        matterProportion,
        waterAmount,
        isConcentrateExcluded,
        percentage
      }
    }))
    dispatch(show(DietSnackbarId.UPDATED_DIET))

    navigation.goBack()
  }, [])

  return (<>
    <Appbar.Header>
      <IconButton icon={'close'} onPress={navigation.goBack} />
      <Appbar.Content title='Ajuste de proporciones' />
      <Button onPress={handleSubmit(onSubmit)} disabled={!isValid || !isDirty || isSubmitting}>Guardar</Button>
    </Appbar.Header>
    <DietSettingsForm
      control={control}
      formState={formState}
      cattleWeight={cattle.weight}
    />
    <DietSnackBarContainer />
  </>)
}