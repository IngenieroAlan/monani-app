import useDiet from "@/hooks/collections/useDiet";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { MainStackParamList } from "@/navigation/types";
import { show } from "@/redux/slices/uiVisibilitySlice";
import ACDietSchema, { ACDietFields } from "@/validationSchemas/ACDietSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Appbar, Button, IconButton } from "react-native-paper";
import DietSettingsForm from "../../../../forms/DietSettingsForm";
import DietSnackbarContainer, { DietSnackbarId } from "./DietSnackbarContainer";

export default function DietSettingsRoute({ navigation }: NativeStackScreenProps<MainStackParamList, 'DietSettingsRoute'>) {
  const { cattleInfo } = useAppSelector(state => state.cattles)
  const { diet } = useDiet(cattleInfo!)
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    getValues,
    formState,
    reset
  } = useForm<ACDietFields>({
    defaultValues: {
      waterAmount: undefined,
      matterProportion: 'Sin definir',
      quantity: undefined,
      isConcentrateExcluded: false
    },
    resolver: zodResolver(ACDietSchema),
    mode: 'onTouched'
  })
  const { isSubmitting, isValid, errors, isDirty } = formState

  useEffect(() => {
    if (diet)
      reset({
        waterAmount: diet.waterAmount !== undefined ? diet.waterAmount : undefined,
        matterProportion: diet.matterProportion,
        quantity: diet.matterProportion === 'Fija' ? diet.matterAmount : diet.percentage,
        isConcentrateExcluded: diet.isConcentrateExcluded ?? false
      })
  }, [diet, reset]);

  const onSubmit = useCallback(() => {
    const { matterProportion, waterAmount, quantity, isConcentrateExcluded } = getValues()
    const percentage = matterProportion === 'Porcentaje de peso' ? quantity : undefined

    let matterAmount;
    if (quantity !== undefined) {
      if (matterProportion === 'Fija') {
        matterAmount = quantity
      } else if (matterProportion === 'Porcentaje de peso') {
        matterAmount = cattleInfo!.weight * (quantity / 100)
      }
    }

    diet?.updateDiet({
      matterAmount: matterAmount,
      matterProportion,
      waterAmount,
      isConcentrateExcluded,
      percentage
    })
    dispatch(show(DietSnackbarId.UPDATED_DIET))

    navigation.goBack()
  }, [diet, dispatch, getValues, cattleInfo, navigation])

  return (<>
    <Appbar.Header>
      <IconButton icon={'close'} onPress={navigation.goBack} />
      <Appbar.Content title='Ajuste de proporciones' />
      <Button onPress={handleSubmit(onSubmit)} disabled={!isValid || !isDirty || isSubmitting}>Guardar</Button>
    </Appbar.Header>
    {cattleInfo &&
      <DietSettingsForm
        control={control}
        formState={formState}
        cattleWeight={cattleInfo.weight}
      />
    }
    <DietSnackbarContainer />
  </>)
}