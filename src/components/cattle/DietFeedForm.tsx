import { AddCattleStackParams } from "@/navigation/stacks/AddCattleStack";
import DietFeedSchema from "@/validationSchemas/DietFeedSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { Appbar, Button, HelperText, IconButton, Searchbar, useTheme } from "react-native-paper";
import { z } from "zod";
import { CustomTextInput } from "../CustomTextInput";
import MDropdown from "../MDropdown";
import SearchFeedList from "./SearchFeedList";
import { CattleContext, CattleDispatchContext } from "@/context/CattleContext";
import { Types } from "@/context/CattleReducer";

export default function DietFeedForm({ navigation }: NativeStackScreenProps<AddCattleStackParams, 'DietFeedForm'>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchBarFocused, setSearchBarFocused] = useState(false);
    const [activeList, setActiveList] = useState(false)
    const theme = useTheme();
    const { diet, dietFeeds } = useContext(CattleContext)
    const dispatch = useContext(CattleDispatchContext)

    type DietFeedFields = z.infer<typeof DietFeedSchema>

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

    const {
        control,
        handleSubmit,
        reset,
        getValues,
        formState: { errors, isDirty, isSubmitting, isValid }
    } = useForm<DietFeedFields>({
        defaultValues: {
            feedId: undefined,
            feedProportion: 'Por porcentaje',
            quantity: undefined
        },
        resolver: zodResolver(DietFeedSchema),
        mode: 'onTouched'
    })

    const onSubmit = () => {
        // save the data
        const feedProportion = getValues('feedProportion')
        dispatch({
            type: Types.SAVE_DIET_FEED,
            payload: {
                dietFeedId: '0',
                dietId: diet.dietId,
                feedId: getValues('feedId'),
                feedProportion: feedProportion,
                feedAmount: feedProportion === 'Por porcentaje' ? 0 : getValues('quantity'),
                percentage: feedProportion === 'Por porcentaje' ? getValues('quantity') : 0
            }
        })

        reset

        navigation.goBack()
    }

    return (<>
        <Appbar.Header>
            <IconButton icon={'close'} onPress={() => handleSubmit(onSubmit)} />
            <Appbar.Content title='Dieta' />
            <Button onPress={onSubmit}>Guardar</Button>
        </Appbar.Header>
        <View style={{ padding: 16, gap: 10, flex: 1 }}>
            <Searchbar
                placeholder="Alimento"
                mode="bar"
                theme={{ roundness: 0 }}
                onChangeText={setSearchQuery}
                value={searchQuery}
                onFocus={() => setSearchBarFocused(true)}
                onBlur={() => activeList ? setSearchBarFocused(false) : setSearchBarFocused(true)}
                autoFocus={!isDirty}
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
    </>)
}