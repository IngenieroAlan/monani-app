import { Feed } from "@/interfaces/cattleInterfaces";
import { AddCattleStackParams } from "@/navigation/stacks/AddCattleStack";
import DietFeedSchema from "@/validationSchemas/DietFeedSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { Appbar, Button, IconButton, Searchbar, useTheme } from "react-native-paper";
import { z } from "zod";
import { CustomTextInput } from "../CustomTextInput";
import MDropdown from "../MDropdown";
import SearchFeedList from "./SearchFeedList";

export default function DietFeedForm({ navigation }: NativeStackScreenProps<AddCattleStackParams, 'DietFeedForm'>, {feeds}: {feeds: Feed[]}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchBarFocused, setSearchBarFocused] = useState(false);
    const theme = useTheme();
    
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
        formState: { errors, isDirty, isSubmitting, isValid }
    } = useForm<DietFeedFields>({
        defaultValues: {
            feedId: undefined,
            feedProportion: 'Por porcentaje',
            feedAmount: undefined
        },
        resolver: zodResolver(DietFeedSchema),
        mode: 'onTouched'
    })

    const onSubmit = () => {
        // save the data
        navigation.goBack()
    }
    return (<>
        <Appbar.Header>
            <IconButton icon={'close'} onPress={navigation.goBack} />
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
                // onBlur={() => setSearchBarFocused(false)}
            />

            {searchBarFocused && (
                <View
                    style={{
                        position: "absolute",
                        zIndex: 1,
                        backgroundColor: theme.colors.surface,
                        margin: 16,
                        top: 68,
                        width: "100%",
                    }}>
                    <SearchFeedList
                        searchPhrase={searchQuery}
                        data={feeds}
                        control={control}
                        name='feedId'
                        errors={errors.feedId}
                        label='Alimento*'
                        helperText={errors.feedId?.message ? errors.feedId?.message : ''}
                        setClicked={() => {
                            // and close the search bar
                            setSearchBarFocused(false)
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
                name='feedAmount'
                control={control}
                label='Nombre*'
                errors={errors.feedAmount}
                helperText={errors.feedAmount?.message ? errors.feedAmount?.message : ''}
                more={{
                    autoFocus: !isDirty,
                    theme: { colors: { background: theme.colors.elevation.level3 } }
                }}
            />

        </View>
    </>)
}