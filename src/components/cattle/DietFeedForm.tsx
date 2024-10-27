import DietFeedSchema from "@/validationSchemas/DietFeedSchema";
import { memo, useState } from "react";
import { Control, FormState } from "react-hook-form";
import { View } from "react-native";
import { HelperText, Searchbar, useTheme } from "react-native-paper";
import { z } from "zod";
import { CustomTextInput } from "../CustomTextInput";
import MDropdown from "../MDropdown";
import SearchFeedList from "./SearchFeedList";

type DietFeedFields = z.infer<typeof DietFeedSchema>

const DietFeedForm = (
  { control, formState, feedName }:
    {
      control: Control<DietFeedFields>;
      formState: FormState<DietFeedFields>;
      feedName?: string;
    }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState(feedName || '');
  const [searchBarFocused, setSearchBarFocused] = useState(false);
  const [activeList, setActiveList] = useState(false)
  const { errors } = formState

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

  return (
    <View style={{ padding: 16, gap: 10, flex: 1 }}>
      <Searchbar
        placeholder="Alimento"
        mode="bar"
        theme={{ roundness: 1 }}
        onChangeText={setSearchQuery}
        value={searchQuery}
        onFocus={() => setSearchBarFocused(true)}
        onBlur={() => activeList ? setSearchBarFocused(false) : setSearchBarFocused(true)}
      />

      {
        errors.feedId && <HelperText type="error">
          {errors.feedId.message}
        </HelperText>
      }

      {searchBarFocused && (
        <View style={{
          position: "absolute",
          zIndex: 1,
          backgroundColor: theme.colors.surface,
          margin: 16,
          top: 64,
          width: "100%",
          borderRadius: 10,
          elevation: 5,
          paddingVertical: 8
        }}>
          <SearchFeedList
            searchPhrase={searchQuery}
            setSearchQuery={setSearchQuery}
            setSearchBarFocused={setSearchBarFocused}
            control={control}
            name='feedId'
            setClicked={() => {
              setSearchBarFocused(false)
              setActiveList(false)
            }}
          />
        </View>
      )}

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