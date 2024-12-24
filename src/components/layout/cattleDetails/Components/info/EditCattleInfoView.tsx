import DismissDialog from "@/components/DismissDialog"
import EditCattleInfoForm from "@/components/forms/EditCattleInfoForm"
import { UpdateCattleData } from "@/database/models/Cattle"
import useWeightReports from "@/hooks/collections/useWeightReports"
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux"
import { reset as resetCattle } from "@/redux/slices/addCattleSlice"
import { show } from "@/redux/slices/uiVisibilitySlice"
import EditCattleInfoSchema from "@/validationSchemas/EditCattleInfoSchema"
import { HomeSnackbarId } from '@/views/home/components/HomeSnackbarContainer'
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigation } from '@react-navigation/native'
import { useCallback, useMemo } from "react"
import { useForm } from "react-hook-form"
import { View } from "react-native"
import { Appbar, Button, useTheme } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"

const DISMISS_DIALOG_ID = 'editCattleDismissDialog'

const EditCattleInfoView = () => {
  const theme = useTheme()
  const navigation = useNavigation()
  const dispatch = useAppDispatch()
  const { cattleInfo } = useAppSelector(state => state.cattles)
  const { weightReports } = useWeightReports(cattleInfo!)

  const lastReport = useMemo(() => { return weightReports.at(-1); }, [weightReports])
  const weight = useMemo(() => {
    return lastReport ? lastReport.weight : cattleInfo?.weight;
  }, [weightReports, cattleInfo])
  
  // days left for quarantine
  const quarantineDays = useMemo(() => {
    if (!cattleInfo?.quarantineEndsAt) return undefined
    const days = Math.floor((new Date().getTime() - cattleInfo.quarantineEndsAt.getTime()) / (1000 * 60 * 60 * 24))
    return days > 0 ? 14 - days : 14
  }, [cattleInfo])

  const initialCattleValues: UpdateCattleData = useMemo(() => cattleInfo! && {
    name: cattleInfo.name,
    tagId: cattleInfo.tagId,
    tagCattleNumber: cattleInfo.tagCattleNumber,
    weight: weight,
    bornAt: cattleInfo.bornAt,
    cattleStatus: cattleInfo.cattleStatus,
    productionType: cattleInfo.productionType,
    pregnantAt: cattleInfo.pregnantAt ? cattleInfo.pregnantAt : undefined,
    admittedAt: cattleInfo.admittedAt,
    quarantineDays: quarantineDays,
  }, [cattleInfo, quarantineDays])

  const form = useForm<UpdateCattleData>({
    defaultValues: initialCattleValues,
    resolver: zodResolver(EditCattleInfoSchema),
    mode: 'onBlur'
  })
  const {
    control,
    handleSubmit,
    getValues,
    formState
  } = form
  const { isSubmitting, isValid, isDirty } = formState

  const goBack = useCallback(() => {
    dispatch(resetCattle());
    navigation.goBack();
  }, [dispatch, navigation])

  const handleSave = useCallback(async () => {
    const values = getValues()
    try {
      await cattleInfo?.updateCattle(lastReport ? {
        name: values.name,
        tagId: values.tagId,
        tagCattleNumber: values.tagCattleNumber,
        bornAt: values.bornAt,
        cattleStatus: values.cattleStatus,
        productionType: values.productionType,
        pregnantAt: values.pregnantAt,
        admittedAt: values.admittedAt,
        quarantineDays: values.quarantineDays,
      } : values)
      navigation.goBack()
    } catch (error) {
      console.error(error)
    }
  }, [dispatch, getValues, navigation])

  return (<>
    <Appbar.Header>
      <Appbar.BackAction onPress={() => isDirty ? dispatch(show(DISMISS_DIALOG_ID)) : goBack()} />
      <Appbar.Content title='Información' />
      <Button
        onPress={handleSubmit(handleSave)}
        disabled={!isValid || !isDirty || isSubmitting}
        style={{ marginRight: 16 }}
      >
        Guardar
      </Button>
    </Appbar.Header>
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
        <EditCattleInfoForm
          control={control}
          formState={formState}
          lastReport={lastReport}
        />
      </View>
      <DismissDialog
        id={DISMISS_DIALOG_ID}
        dismissSnackbarId={HomeSnackbarId.CREATE_CATTLE_DISMISS}
        onConfirm={goBack}
      />
    </SafeAreaProvider>
  </>)
}

export default EditCattleInfoView