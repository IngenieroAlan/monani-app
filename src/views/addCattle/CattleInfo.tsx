import DismissDialog from '@/components/DismissDialog'
import CattleInfoForm from '@/components/forms/CattleInfoForm'
import { SurfaceContainer } from '@/components/SurfaceContainer'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { CreateCattleStackParamList } from '@/navigation/types'
import { CattleInfoFields, reset as resetCattle, saveCattleInfo } from '@/redux/slices/addCattleSlice'
import { show } from '@/redux/slices/uiVisibilitySlice'
import CattleInfoSchema from '@/validationSchemas/cattleInfoSchema'
import { HomeSnackbarId } from '@/views/home/components/HomeSnackbarContainer'
import { zodResolver } from '@hookform/resolvers/zod'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Appbar, Button } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const DISMISS_DIALOG_ID = 'createCattleDismissDialog'

type ScreenProps = NativeStackScreenProps<CreateCattleStackParamList, 'CattleInfo'>

export const CattlInfo = ({ navigation }: ScreenProps) => {
  const dispatch = useAppDispatch()
  const { cattle } = useAppSelector((state) => state.addCattle)

  const initialCattleValues: CattleInfoFields = useMemo(() => {
    return cattle
  }, [cattle])
  const { control, handleSubmit, getValues, formState } = useForm<CattleInfoFields>({
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
      quarantineDays: undefined
    },
    resolver: zodResolver(CattleInfoSchema),
    mode: 'onTouched'
  })
  const { isSubmitting, isValid, isDirty } = formState
  const { motherId } = useAppSelector((state) => state.addCattle.cattle)

  const goBack = useCallback(() => {
    dispatch(resetCattle())
    navigation.goBack()
  }, [dispatch, navigation])

  const handleNext = useCallback(() => {
    const values = getValues()
    dispatch(saveCattleInfo({ cattle: values }))

    navigation.navigate('Diet')
  }, [dispatch, getValues, navigation])

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => (isDirty ? dispatch(show(DISMISS_DIALOG_ID)) : goBack())} />
        <Appbar.Content title='Información' />
      </Appbar.Header>
      <SafeAreaProvider>
        <SurfaceContainer>
          <CattleInfoForm
            control={control}
            formState={formState}
            motherId={motherId}
          />
          <Button
            icon='arrow-right'
            mode='elevated'
            style={{ alignSelf: 'flex-end', marginHorizontal: 16, marginVertical: 10 }}
            onPress={handleSubmit(handleNext)}
            disabled={!isValid || isSubmitting}
          >
            Siguiente
          </Button>
        </SurfaceContainer>
        <DismissDialog
          id={DISMISS_DIALOG_ID}
          dismissSnackbarId={HomeSnackbarId.CREATE_CATTLE_DISMISS}
          onConfirm={goBack}
        />
      </SafeAreaProvider>
    </>
  )
}
