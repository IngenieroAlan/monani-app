import { useAppDispatch, useAppSelector } from "@/hooks/useRedux"
import CattleInfoSchema, { CattleInfoFields } from "@/validationSchemas/cattleInfoSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useForm } from "react-hook-form"
import { View } from "react-native"
import { Appbar, Button, useTheme } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AddCattleStackParams } from "../../navigation/stacks/AddCattleStack"
import { reset as resetCattle } from "@/redux/slices/addCattleSlice"
import CattleInfoForm from "@/components/addCattle/CattleInfoForm"

type Props = NativeStackScreenProps<AddCattleStackParams, 'CattleInfo'>;
export const CattlInfo = ({ navigation }: Props) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { cattle, genealogy } = useAppSelector(state => state.addCattle)

  const goBack = () => {
    dispatch(resetCattle());
    navigation.goBack();
  }

  const handleNext = () => {
    // dispatch({ type: 'save_cattle_information', payload: { cattle: currentCattle as Cattle, genealogy: genealogy as Genealogy } })

    navigation.navigate('Diet')
  }

  const initialCattleValues: CattleInfoFields = {
    name: cattle.name,
    tagId: cattle.tagId,
    tagCattleNumber: cattle.tagCattleNumber,
    admittedAt: cattle.admittedAt,
    weight: cattle.weight,
    bornAt: cattle.bornAt,
    cattleStatus: cattle.cattleStatus,
    productionType: cattle.productionType,
    pregnantAt: cattle.pregnantAt,
    motherId: genealogy.motherId,
    quarantineDaysLeft: cattle.quarantineDaysLeft,
  }
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState
  } = useForm<CattleInfoFields>({
    defaultValues: initialCattleValues || {
      name: undefined,
      tagId: undefined,
      tagCattleNumber: undefined,
      weight: undefined,
      bornAt: undefined,
      cattleStatus: undefined,
      productionType: undefined,
      pregnantAt: undefined,
      motherId: undefined,
      quarantineDaysLeft: undefined,
    },
    resolver: zodResolver(CattleInfoSchema),
    mode: 'onTouched'
  })
  const { isSubmitting, isValid, errors, isDirty } = formState
  const { motherId } = useAppSelector((state) => state.addCattle.genealogy)

  return (<>
    <Appbar.Header>
      <Appbar.BackAction onPress={goBack} />
      <Appbar.Content title='Información' />
    </Appbar.Header>
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
        <CattleInfoForm
          control={control}
          formState={formState}
          motherId={motherId}
        />
        <Button
          icon="arrow-right"
          mode="elevated"
          style={{ alignSelf: 'flex-end', marginHorizontal: 16, marginVertical: 10 }}
          onPress={handleNext}>
          Siguiente
        </Button>
      </View>
    </SafeAreaProvider>
  </>)
}