import DietFeedForm from "@/components/forms/DietFeedForm";
import useDiet from "@/hooks/collections/useDiet";
import useDietFeeds from "@/hooks/collections/useDietFeeds";
import useFeeds from '@/hooks/collections/useFeeds';
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { CattleStackParamList } from "@/navigation/types";
import { show } from "@/redux/slices/uiVisibilitySlice";
import { RootState } from "@/redux/store/store";
import DietFeedSchema, { DietFeedFields } from "@/validationSchemas/DietFeedSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Appbar, Button, IconButton } from "react-native-paper";
import DietSnackbarContainer, { DietSnackbarId } from "./DietSnackbarContainer";

export default function DietFeedRoute({ navigation, route }: NativeStackScreenProps<CattleStackParamList, 'CreateDietFeedView'>) {
  const { cattleInfo } = useAppSelector((state: RootState) => state.cattles);
  const { feedsRecords } = useFeeds()
  const { dietFeeds } = useDietFeeds(cattleInfo!);
  const { diet } = useDiet(cattleInfo!);
  const dispatch = useAppDispatch();

  const dietFeedId = route.params?.dietFeedId;
  const modify = route.params?.modify || false;

  const dietFeed = useMemo(() => dietFeedId ? dietFeeds.find(dietFeed => dietFeed.id === dietFeedId) : undefined, [dietFeedId, dietFeeds]);
  const findFeed = useCallback((feedId: string) => feedsRecords.find(feed => feed.id === feedId), [feedsRecords]);
  const currentFeed = useMemo(() => dietFeed ? findFeed(dietFeed.feed.id) : undefined, [dietFeed, findFeed]);
  const feedName = useMemo(() => currentFeed ? currentFeed.name : undefined, [currentFeed]);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState
  } = useForm<DietFeedFields>({
    defaultValues: {
      feed: undefined,
      feedProportion: 'Por porcentaje',
      quantity: undefined
    },
    resolver: zodResolver(DietFeedSchema),
    mode: 'onTouched'
  });
  const { isValid, isDirty, isSubmitting } = formState;

  useEffect(() => {
    if (dietFeed)
      reset({
        feed: dietFeed.feed.id,
        feedProportion: dietFeed.feedProportion,
        quantity: dietFeed.feedProportion === 'Fija' ? dietFeed.feedAmount : dietFeed.percentage || 0
      })
  }, [dietFeed]);

  const onSubmit = useCallback(() => {
    const { feedProportion, feed, quantity } = getValues();
    const percentage = feedProportion === 'Por porcentaje' ? quantity : undefined;
    const feedAmount = feedProportion === 'Fija' ? quantity : cattleInfo!.weight * (quantity / 100);
    const findedFeed = feed ? feedsRecords.find(F => F.id === feed) : undefined;

    const Action = async () => {
      try {
        if (modify && dietFeed) {
          await dietFeed.updateDietFeed({
            feed: findedFeed ? findedFeed : currentFeed!,
            feedAmount,
            percentage,
            feedProportion
          });
          dispatch(show(DietSnackbarId.UPDATED_DIETFEED));
        } else {
          await diet?.createDietFeed({
            feed: findedFeed!,
            feedProportion,
            feedAmount,
            percentage
          });
          reset();
          dispatch(show(DietSnackbarId.STORED_DIETFEED));
        }
      } catch (error) {
        console.error(error);
        dispatch(show(DietSnackbarId.SAME_DIETFEED))
        return;
      }
    };

    Action();
    navigation.goBack();
  }, [cattleInfo, diet, dietFeed, currentFeed, feedsRecords]);

  return (
    <>
      <Appbar.Header>
        <IconButton icon={'close'} onPress={navigation.goBack} />
        <Appbar.Content title={modify ? 'Ajustar alimento' : 'Agregar alimento'} />
        <Button onPress={handleSubmit(onSubmit)} disabled={!isValid || !isDirty || isSubmitting}>Guardar</Button>
      </Appbar.Header>
      {cattleInfo && (
        <DietFeedForm
          control={control}
          formState={formState}
          feedName={feedName}
          cattleWeight={cattleInfo.weight}
        />
      )}
      <DietSnackbarContainer />
    </>
  );
}