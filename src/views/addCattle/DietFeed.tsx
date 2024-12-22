import DietSnackbarContainer, { DietSnackbarId } from "@/components/layout/cattleDetails/Components/dietFeed/DietSnackbarContainer";
import DietFeedForm from "@/components/forms/DietFeedForm";
import useFeeds from "@/hooks/collections/useFeeds";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { CreateCattleStackParamList } from "@/navigation/types";
import { modifyFeedDiet, saveDietFeed } from "@/redux/slices/addCattleSlice";
import { show } from "@/redux/slices/uiVisibilitySlice";
import DietFeedSchema, { DietFeedFields } from "@/validationSchemas/DietFeedSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Appbar, Button, IconButton } from "react-native-paper";

export default function DietFeed({ navigation, route }: NativeStackScreenProps<CreateCattleStackParamList, 'DietFeed'>) {
  const { cattle, dietFeeds } = useAppSelector(state => state.addCattle);
  const dispatch = useAppDispatch();
  const { feeds } = useFeeds();

  const dietFeedId = route.params?.dietFeedId;
  const modify = route.params?.modify || false;

  const dietFeed = useMemo(() => dietFeedId ? dietFeeds.find(dietFeed => dietFeed.dietFeedId === dietFeedId) : undefined, [dietFeedId, dietFeeds]);
  const feedName = useMemo(() => dietFeed ? (dietFeed.feed.name) : undefined, [dietFeed])

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState
  } = useForm<DietFeedFields>({
    defaultValues: {
      feed: dietFeed?.feed.id || undefined,
      feedProportion: dietFeed?.feedProportion || 'Por porcentaje',
      quantity: dietFeed?.feedProportion === 'Fija' ? dietFeed.feedAmount : dietFeed?.percentage || undefined
    },
    resolver: zodResolver(DietFeedSchema),
    mode: 'onTouched'
  })
  const { isSubmitting, isValid, isDirty } = formState

  const onSubmit = useCallback(() => {
    const { feedProportion, feed, quantity } = getValues();
    const percentage = feedProportion === 'Por porcentaje' ? quantity : undefined;
    const feedAmount = feedProportion === 'Fija' ? quantity : cattle!.weight * (quantity / 100);
    const findedFeed = feed ? feeds.find(F => F.id === feed) : undefined;

    try {
      if (modify && dietFeedId) {
        dispatch(modifyFeedDiet({
          dietFeed: {
            dietFeedId,
            dietId: "0",
            feed: findedFeed ? findedFeed : dietFeed!.feed,
            feedProportion,
            feedAmount,
            percentage
          }
        }))
        dispatch(show(DietSnackbarId.UPDATED_DIETFEED))
      } else {
        dispatch(saveDietFeed({
          dietFeed: {
            dietFeedId: Math.random().toString(),
            dietId: "0",
            feed: findedFeed!,
            feedProportion,
            feedAmount,
            percentage
          }
        }))
        reset();
        dispatch(show(DietSnackbarId.STORED_DIETFEED))
      }
    } catch (error) {
      console.error(error);
      dispatch(show(DietSnackbarId.SAME_DIETFEED))
      return;
    }

    navigation.goBack()
  }, [dietFeedId, cattle, dietFeed, feeds])

  return (<>
    <Appbar.Header>
      <IconButton icon={'close'} onPress={navigation.goBack} />
      <Appbar.Content title={modify ? 'Ajustar alimento' : 'Agregar alimento'} />
      <Button onPress={handleSubmit(onSubmit)} disabled={!isValid || !isDirty || isSubmitting}>Guardar</Button>
    </Appbar.Header>
    <DietFeedForm
      control={control}
      formState={formState}
      feedName={feedName}
      cattleWeight={cattle.weight}
    />
    <DietSnackbarContainer />
  </>)
}