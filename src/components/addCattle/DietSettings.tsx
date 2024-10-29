import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { AddCattleStackParams } from "@/navigation/stacks/AddCattleStack";
import { setDiet } from "@/redux/slices/addCattleSlice";
import ACDietSchema, { ACDietFields } from "@/validationSchemas/ACDietSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Appbar, Button, IconButton } from "react-native-paper";
import DietSettingsForm from "./DietSettingsForm";

export default function DietSettings({ navigation }: NativeStackScreenProps<AddCattleStackParams, 'DietSettings'>) {
  const { cattle, diet } = useAppSelector(state => state.addCattle)
  const dispatch = useAppDispatch();

  const initialDietFeedValues = diet ? {
    waterAmount: diet.waterAmount ?? 0,
    matterProportion: diet.matterProportion,
    matterAmount: diet.matterAmount ?? 0,
    isConcentrateExcluded: diet.isConcentrateExcluded ?? false
  } : undefined

  const {
    control,
    handleSubmit,
    getValues,
    formState
  } = useForm<ACDietFields>({
    defaultValues: initialDietFeedValues || {
      matterAmount: undefined,
      matterProportion: 'Sin definir',
      waterAmount: undefined,
      isConcentrateExcluded: false
    },
    resolver: zodResolver(ACDietSchema),
    mode: 'onTouched'
  })
  const { isSubmitting, isValid, errors, isDirty } = formState

  const onSubmit = useCallback(() => {
    const matterProportion = getValues('matterProportion')
    const waterAmount = getValues('waterAmount')
    const quantity = getValues('matterAmount')
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
    console.log(matterAmount);
    

    dispatch(setDiet({
      diet: {
        dietId: diet.dietId,
        matterAmount,
        matterProportion,
        waterAmount,
        isConcentrateExcluded,
        percentage
      }
    }))

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
    />
  </>)
}