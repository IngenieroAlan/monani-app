import useFeeds from "@/hooks/collections/useFeeds";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setFeeds } from "@/redux/slices/feedsSlice";
import { RootState } from "@/redux/store/store";
import DietFeedSchema, { DietFeedFields } from "@/validationSchemas/DietFeedSchema";
import { memo, useEffect, useMemo } from "react";
import { Control, FormState, useController } from "react-hook-form";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { z } from "zod";
import { CustomTextInput } from "../CustomTextInput";
import MDropdown from "../MDropdown";
import MSearchBar, { SearchBarDataItem } from "../MSearchBar";

const DietFeedForm = (
  { control, formState, feedName, cattleWeight }:
    {
      control: Control<DietFeedFields>;
      formState: FormState<DietFeedFields>;
      feedName?: string;
      cattleWeight: number;
    }
) => {
  const theme = useTheme();
  const { errors } = formState;
  const { field: feedProportion } = useController({ name: 'feedProportion', control });
  const { field: quantity } = useController({ name: 'quantity', control });

  const feeds = useAppSelector((state: RootState) => state.feeds.records)
  const { getFeeds } = useFeeds()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchFeeds = async () => {
      dispatch(setFeeds(await getFeeds()))
    }

    if (feeds.length === 0) fetchFeeds()
  }, [feeds])

  const dropdownOptions = [
    {
      label: 'Por porcentaje',
      value: 'Por porcentaje'
    },
    {
      label: 'Fija',
      value: 'Fija'
    }
  ]

  const feedData: SearchBarDataItem[] =
    useMemo(() =>
      feeds.map(feed => ({
        id: feed.id,
        title: feed.name,
        description: feed.feedType,
        value: feed.id
      }))
      , [feeds])

  return (
    <View style={{ padding: 16, gap: 10, flex: 1 }}>
      <MSearchBar
        name='feedId'
        control={control}
        placeholder="Alimento"
        initialQuery={feedName}
        mode="bar"
        theme={{ roundness: 1 }}
        data={feedData}
        errroMessage={errors.feedId?.message ? errors.feedId?.message : ''}
        maxHeight={500}
      />
      <MDropdown
        name='feedProportion'
        control={control}
        label='Tipo de alimento*'
        options={dropdownOptions}
        error={errors.feedProportion !== undefined}
        errroMessage={errors.feedProportion?.message}
        theme={{
          colors: { background: theme.colors.elevation.level3 }
        }}
      />

      <CustomTextInput
        name='quantity'
        control={control}
        label='Cantidad*'
        errors={errors.quantity}
        helperText={errors.quantity?.message ? errors.quantity?.message : ''}
        more={{
          theme: { colors: { background: theme.colors.elevation.level3 } },
          keyboardType: 'numeric'
        }}
      />
      <Text variant='labelSmall'>
        {feedProportion.value === 'Por porcentaje' ?
          `Equivalente a ${(cattleWeight * (quantity.value / 100))} kg.` : ''}
      </Text>

    </View>
  )
}

export default memo(DietFeedForm);