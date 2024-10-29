import Cattle from "@/database/models/Cattle";
import useCattle from "@/hooks/collections/useCattle";
import { CattleInfoFields } from "@/validationSchemas/cattleInfoSchema";
import { Q } from "@nozbe/watermelondb";
import { memo, useEffect, useMemo, useState } from "react";
import { Control, Controller, FormState, useController } from "react-hook-form";
import { FlatList, View } from "react-native";
import { Checkbox, Divider, HelperText, Text, useTheme } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { CustomTextInput } from "../CustomTextInput";
import MDropdown from "../MDropdown";
import MSearchBar from "../MSearchBar";
// import { FlatList } from "react-native-gesture-handler";

const CattleInfoForm = (
  { control, formState, motherId }:
    {
      control: Control<CattleInfoFields>;
      formState: FormState<CattleInfoFields>;
      motherId?: string;
    }
) => {
  const theme = useTheme();
  const { errors } = formState;
  const { field, fieldState } = useController({ name: 'cattleStatus', control });

  const cattleStatusOptions = [
    {
      label: 'Gestante',
      value: 'Gestante'
    },
    {
      label: 'Producción',
      value: 'Producción'
    },
    {
      label: 'De reemplazo',
      value: 'De reemplazo'
    },
    {
      label: 'De desecho',
      value: 'De desecho'
    }
  ]
  const productionTypeOptions = [
    {
      label: 'Lechera',
      value: 'Lechera'
    },
    {
      label: 'De carne',
      value: 'De carne'
    }
  ]
  const [inQuarantine, setQuarantine] = useState(false);

  const [cattles, setCattles] = useState<Cattle[]>([])
  const { getCattle } = useCattle()

  useEffect(() => {
    const fetchCattles = async () => {
      const queries = [Q.where('is_active', true)]
      setCattles(await getCattle(queries))
    }

    if (cattles.length === 0) fetchCattles()
  }, [cattles])

  const motherIds = useMemo(() =>
    cattles.map(cattle => ({
      id: cattle.id,
      title: cattle.name ? `${cattle.tagId}: ${cattle.name}` : `${cattle.tagId}`,
      value: cattle.id
    })),
    [cattles]
  )

  return (
    <FlatList
      style={{
        flexGrow: 1,
        backgroundColor: theme.colors.surface,
        zIndex: 0
      }}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: theme.colors.surface
      }}
      nestedScrollEnabled={true}
      data={[1]}
      renderItem={() => (
        <View style={{
          flex: 1,
          padding: 16,
          gap: 10,
          backgroundColor: theme.colors.surface
        }}>
          <Text variant="titleLarge">Datos Generales</Text>
          <CustomTextInput
            name="name"
            control={control}
            label={'Nombre*'}
            errors={errors.name}
            helperText={errors.name?.message ? errors.name.message : ''}
          />
          <CustomTextInput
            name="tagId"
            control={control}
            label={'Número identificador*'}
            errors={errors.tagId}
            helperText={errors.tagId?.message ? errors.tagId.message : ''}
            more={{
              keyboardType: "numeric"
            }}
          />
          <CustomTextInput
            name="tagCattleNumber"
            control={control}
            label={'Número de vaca*'}
            errors={errors.tagCattleNumber}
            helperText={errors.tagCattleNumber?.message ? errors.tagCattleNumber.message : ''}
            more={{
              keyboardType: "numeric"
            }}
          />
          <Controller
            name="admittedAt"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <DatePickerInput
                  locale="es"
                  label="Fecha de ingreso"
                  value={value}
                  onChange={(d) => onChange(d)}
                  inputMode="start"
                  mode="outlined"
                />
              )
            }}
          />

          <Divider style={{ marginVertical: 10 }} />

          <Text variant="titleLarge">Datos de biológicos</Text>
          <CustomTextInput
            name="weight"
            control={control}
            label={'Peso*'}
            errors={errors.weight}
            helperText={errors.weight?.message ? errors.weight.message : ''}
            more={{
              keyboardType: "numeric"
            }}
          />

          <Controller
            name="bornAt"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <DatePickerInput
                  locale="es"
                  label="Fecha de nacimiento"
                  value={value}
                  onChange={(d) => onChange(d)}
                  inputMode="start"
                  mode="outlined"
                />
              )
            }}
          />

          <Divider style={{ marginVertical: 10 }} />

          <Text variant="titleLarge">Estado productivo</Text>
          <MDropdown
            name='cattleStatus'
            control={control}
            label='Estado*'
            options={cattleStatusOptions}
            error={errors.cattleStatus !== undefined}
            errroMessage={errors.cattleStatus?.message}
            theme={{
              colors: { background: theme.colors.elevation.level3 }
            }}
          />

          {field.value === 'Gestante' && (
            <Controller
              name="pregnantAt"
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <DatePickerInput
                    locale="es"
                    label="Fecha de gestación"
                    value={value}
                    onChange={(d) => onChange(d)}
                    inputMode="start"
                    mode="outlined"
                  />
                )
              }}
            />
          )}

          {
            errors.pregnantAt && <HelperText type="error">
              {errors.pregnantAt.message}
            </HelperText>
          }

          <MDropdown
            name='productionType'
            control={control}
            label='Tipo de producción*'
            options={productionTypeOptions}
            error={errors.productionType !== undefined}
            errroMessage={errors.productionType?.message}
            theme={{
              colors: { background: theme.colors.elevation.level3 }
            }}
          />

          <Divider style={{ marginVertical: 10 }} />

          <Text variant="titleLarge">Genealogía</Text>
          <MSearchBar
            name="motherId"
            control={control}
            placeholder='No. identenficador de la madre'
            errroMessage={errors.motherId?.message ? errors.motherId?.message : ''}
            data={motherIds}
            initialQuery={motherId}
            theme={{ roundness: 1 }}
            mode="bar"
            maxHeight={144}
          />

          <Divider style={{ marginVertical: 10 }} />

          <Checkbox.Item
            label="En cuarentena"
            status={inQuarantine ? 'checked' : 'unchecked'}
            onPress={() => {
              setQuarantine(!inQuarantine);
            }}
          />
          <CustomTextInput
            name="quarantineDaysLeft"
            control={control}
            label={'Días de cuarentena'}
            errors={errors.quarantineDaysLeft}
            helperText={errors.quarantineDaysLeft?.message ? errors.quarantineDaysLeft.message : ''}
            more={{
              keyboardType: "numeric"
            }}
          />
        </View>
      )}
    >
    </FlatList>
  )
}

export default memo(CattleInfoForm);