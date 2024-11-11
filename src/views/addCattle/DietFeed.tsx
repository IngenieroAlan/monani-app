import DietFeedForm from "@/components/forms/DietFeedForm";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { AddCattleStackParamsList } from "@/navigation/types";
import { modifyFeedDiet, saveDietFeed } from "@/redux/slices/addCattleSlice";
import { RootState } from "@/redux/store/store";
import DietFeedSchema, { DietFeedFields } from "@/validationSchemas/DietFeedSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Appbar, Button, IconButton } from "react-native-paper";

export default function DietFeed({ navigation, route }: NativeStackScreenProps<AddCattleStackParamsList, 'DietFeed'>) {
  const { cattle, dietFeeds } = useAppSelector(state => state.addCattle)
  const feeds = useAppSelector((state: RootState) => state.feeds.records)
  const dispatch = useAppDispatch()

  const dietFeedId = route.params?.dietFeedId || undefined;
  const modify = route.params?.modify || false;

  const dietFeed = dietFeedId ? dietFeeds.find(dietFeed => dietFeed.dietFeedId === dietFeedId) : undefined
  const feed = undefined

  const initialDietFeedValues: DietFeedFields | undefined = dietFeed ? {
    feed: feed,
    feedProportion: dietFeed.feedProportion,
    quantity: dietFeed.feedProportion === 'Fija' ? dietFeed.feedAmount : dietFeed.percentage || 0
  } : undefined
  const feedName = dietFeed ? useMemo(() => (dietFeed.feed.name), [dietFeed]) : undefined

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState
  } = useForm<DietFeedFields>({
    defaultValues: initialDietFeedValues || {
      feed: undefined,
      feedProportion: 'Por porcentaje',
      quantity: undefined
    },
    resolver: zodResolver(DietFeedSchema),
    mode: 'onTouched'
  })
  const { isSubmitting, isValid, errors, isDirty } = formState

  const onSubmit = useCallback(() => {
    const feedProportion = getValues('feedProportion')
    const feed = getValues('feed')
    const quantity = getValues('quantity')
    const percentage = feedProportion === 'Por porcentaje' ? quantity : undefined
    let feedAmount: number = 0;
    if (feedProportion === 'Fija') {
      feedAmount = quantity
    } else if (feedProportion === 'Por porcentaje') {
      feedAmount = cattle.weight * (quantity / 100)
    }

    if (modify && dietFeedId) {
      dispatch(modifyFeedDiet({
        dietFeed: {
          dietFeedId,
          dietId: "0",
          feed: feed !== undefined ? feed : dietFeed?.feed,
          feedProportion,
          feedAmount,
          percentage
        }
      }))
    } else {
      dispatch(saveDietFeed({
        dietFeed: {
          dietFeedId: Math.random().toString(),
          dietId: "0",
          feed,
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
      <Appbar.Content title={modify ? 'Ajustar alimento' : 'Agregar alimento'} />
      <Button onPress={handleSubmit(onSubmit)} disabled={!isValid || !isDirty || isSubmitting}>Guardar</Button>
    </Appbar.Header>
    <DietFeedForm
      control={control}
      formState={formState}
      feedName={feedName}
      cattleWeight={cattle.weight}
    />
  </>)
}