import DietFeedSchema from "@/validationSchemas/DietFeedSchema";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Control, FormState } from "react-hook-form";
import { FlatList, View } from "react-native";
import { HelperText, Searchbar, useTheme } from "react-native-paper";
import { z } from "zod";
import { CustomTextInput } from "../CustomTextInput";
import MDropdown from "../MDropdown";
import SearchFeedList from "./SearchFeedList";
import MSearchBar, { SearchBarDataItem } from "../MSearchBar";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import useFeeds from "@/hooks/collections/useFeeds";
import { setFeeds } from "@/redux/slices/feedsSlice";
import { RootState } from "@/redux/store/store";

type DietFeedFields = z.infer<typeof DietFeedSchema>

const DietFeedForm = (
  { control, formState, feedName }:
    {
      control: Control<DietFeedFields>;
      formState: FormState<DietFeedFields>;
      feedName?: string;
    }
) => {
  const theme = useTheme();
  const { errors } = formState;

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
      label: 'Por cantidad',
      value: 'Por cantidad'
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
  const flatListRef = useRef<FlatList>(null)

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

    </View>
  )
}

export default memo(DietFeedForm);