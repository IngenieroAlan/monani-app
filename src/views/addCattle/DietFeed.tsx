import DietFeedForm from "@/components/addCattle/DietFeedForm";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { AddCattleStackParams } from "@/navigation/stacks/AddCattleStack";
import { modifyFeedDiet, saveDietFeed } from "@/redux/slices/addCattleSlice";
import { RootState } from "@/redux/store/store";
import DietFeedSchema, { DietFeedFields } from "@/validationSchemas/DietFeedSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Appbar, Button, IconButton } from "react-native-paper";

export default function DietFeed({ navigation, route }: NativeStackScreenProps<AddCattleStackParams, 'DietFeed'>) {
  const { cattle, diet, dietFeeds } = useAppSelector(state => state.addCattle)
  const feeds = useAppSelector((state: RootState) => state.feeds.records)
  const dispatch = useAppDispatch();

  const dietFeedId = route.params?.medicationScheduleId || '';
  const modify = route.params?.modify || false;

  const dietFeed = useMemo(() => dietFeeds.find(dietFeed => dietFeed.dietFeedId === dietFeedId), [dietFeeds, dietFeedId])
  const initialDietFeedValues = dietFeed ? {
    feedId: dietFeed.feedId,
    feedProportion: dietFeed.feedProportion,
    quantity: dietFeed.feedProportion === 'Por porcentaje' ? dietFeed.percentage : dietFeed.feedAmount
  } : undefined
  const feedName = useMemo(() => (feeds.find(feed => feed.id === dietFeed?.feedId)?.name), [feeds, dietFeed])

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState
  } = useForm<DietFeedFields>({
    defaultValues: initialDietFeedValues || {
      feedId: undefined,
      feedProportion: 'Por porcentaje',
      quantity: undefined
    },
    resolver: zodResolver(DietFeedSchema),
    mode: 'onTouched'
  })
  const { isSubmitting, isValid, errors, isDirty } = formState

  const onSubmit = useCallback(() => {
    const feedProportion = getValues('feedProportion')
    const feedId = getValues('feedId')
    const quantity = getValues('quantity')
    const percentage = feedProportion === 'Por porcentaje' ? quantity : undefined
    let feedAmount: number = 0;
    if (feedProportion === 'Fija') {
      feedAmount = quantity
    } else if (feedProportion === 'Por porcentaje') {
      feedAmount = cattle.weight * (quantity / 100)
    }

    if (modify) {
      dispatch(modifyFeedDiet({
        dietFeed: {
          dietFeedId,
          dietId: diet.dietId,
          feedId,
          feedProportion,
          feedAmount,
          percentage
        }
      }))
    } else {
      dispatch(saveDietFeed({
        dietFeed: {
          dietFeedId: Math.random().toString(),
          dietId: diet.dietId,
          feedId,
          feedProportion,
          feedAmount,
          percentage
        }
      }))
      reset();
    }

    navigation.goBack()
  }, [])

  return (<>
    <Appbar.Header>
      <IconButton icon={'close'} onPress={navigation.goBack} />
      <Appbar.Content title='Dieta' />
      <Button onPress={handleSubmit(onSubmit)} disabled={!isValid || !isDirty || isSubmitting}>Guardar</Button>
    </Appbar.Header>
    <DietFeedForm
      control={control}
      formState={formState}
      feedName={feedName}
    />
  </>)
}