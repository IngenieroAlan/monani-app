import { UpdateCattleData } from "@/database/models/Cattle";
import { memo, useCallback, useState } from "react";
import { Control, FormState, useController } from "react-hook-form";
import { ScrollView, View } from "react-native";
import { Checkbox, Divider, HelperText, Text, useTheme } from "react-native-paper";
import { CustomTextInput } from "../CustomTextInput";
import MDatePickerInput from "../MDatePickerInput";
import MDropdown from "../MDropdown";
import WeightReport from "@/database/models/WeightReport";

const EditCattleInfoForm = (
  { control, formState, lastReport }:
    {
      control: Control<UpdateCattleData>;
      formState: FormState<UpdateCattleData>;
      lastReport?: WeightReport;
    }
) => {
  const theme = useTheme();
  const { errors } = formState;
  const { field: cattleStatusField } = useController({ name: 'cattleStatus', control });
  const { field: tagCattleNumber } = useController({ name: 'tagCattleNumber', control });
  const { field: weight } = useController({ name: 'weight', control });
  const { field: quarantineDays } = useController({ name: 'quarantineDays', control });
  const [inQuarantine, setQuarantine] = useState(false);

  const cattleStatusOptions = [
    {
      label: 'Gestante',
      value: 'Gestante'
    },
    {
      label: 'En producción',
      value: 'En producción'
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
  const formatTagCattleNumber = useCallback((value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
    } else if (cleaned.length <= 8) {
      return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4)}`;
    }
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 8)}`;
  }, []);

  return (<>
    <ScrollView
      style={{
        flexGrow: 1,
        backgroundColor: theme.colors.surface,
        zIndex: 0
      }}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: theme.colors.surface
      }}
    >
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
          label={'Nombre'}
          errors={errors.name}
          helperText={errors.name?.message ? errors.name.message : ''}
          more={{
            theme: { colors: { background: theme.colors.elevation.level1 } }
          }}
        />
        <CustomTextInput
          name="tagId"
          control={control}
          label={'Número identificador*'}
          errors={errors.tagId}
          helperText={errors.tagId?.message ? errors.tagId.message : ''}
          more={{
            keyboardType: "numeric",
            maxLength: 4,
            theme: { colors: { background: theme.colors.elevation.level1 } }
          }}
        />
        <CustomTextInput
          name="tagCattleNumber"
          control={control}
          label={'Número de vaca*'}
          errors={errors.tagCattleNumber}
          helperText={errors.tagCattleNumber?.message ? errors.tagCattleNumber.message : ''}
          more={{
            keyboardType: "numeric",
            maxLength: 10,
            value: tagCattleNumber.value ? tagCattleNumber.value : '',
            onChangeText: (value: string) => {
              const formattedValue = formatTagCattleNumber(value);
              tagCattleNumber.onChange(formattedValue);
            },
            theme: { colors: { background: theme.colors.elevation.level1 } },
          }}
        />

        <MDatePickerInput
          label="Fecha de ingreso*"
          inputMode="start"
          control={control}
          name="admittedAt"
          errors={errors.bornAt}
          maxDate={new Date()}
          more={{
            theme: { colors: { background: theme.colors.elevation.level1 } }
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
            keyboardType: "numeric",
            maxLength: 4,
            disabled: lastReport !== undefined,
            value: weight.value ? String(weight.value) : '',
            onChangeText: (value: string) => weight.onChange(parseFloat(value)),
            theme: { colors: { background: theme.colors.elevation.level1 } }
          }}
        />

        <MDatePickerInput
          label="Fecha de nacimiento*"
          inputMode="start"
          control={control}
          name="bornAt"
          errors={errors.bornAt}
          maxDate={new Date()}
          more={{
            theme: { colors: { background: theme.colors.elevation.level1 } }
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
            colors: { background: theme.colors.elevation.level1 }
          }}
        />

        {cattleStatusField.value === 'Gestante' && (
          <MDatePickerInput
            label="Fecha de gestación"
            inputMode="start"
            control={control}
            name="pregnantAt"
            errors={errors.bornAt}
            maxDate={new Date()}
            more={{
              theme: { colors: { background: theme.colors.elevation.level1 } }
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
            colors: { background: theme.colors.elevation.level1 }
          }}
        />

        <Divider style={{ marginVertical: 10 }} />

        <Checkbox.Item
          label="En cuarentena"
          status={inQuarantine ? 'checked' : 'unchecked'}
          onPress={() => {
            setQuarantine(!inQuarantine);
            quarantineDays.onChange(inQuarantine ? 0 : undefined as any)
          }}
        />
        <CustomTextInput
          name="quarantineDays"
          control={control}
          label={'Días de cuarentena'}
          errors={errors.quarantineDays}
          helperText={errors.quarantineDays?.message ? errors.quarantineDays.message : ''}
          more={{
            keyboardType: "numeric",
            disabled: !inQuarantine,
            onChangeText: (value: string) => quarantineDays.onChange(parseFloat(value)),
            theme: { colors: { background: theme.colors.elevation.level1 } }
          }}
        />
      </View>
    </ScrollView>
  </>)
}

export default memo(EditCattleInfoForm);