import useCattle from "@/hooks/collections/useCattle";
import { CattleInfoFields } from "@/redux/slices/addCattleSlice";
import { memo, useCallback, useMemo, useState } from "react";
import { Control, FormState, useController } from "react-hook-form";
import { FlatList, View } from "react-native";
import { Checkbox, Divider, HelperText, Text, useTheme } from "react-native-paper";
import { CustomTextInput } from "../CustomTextInput";
import MDatePickerInput from "../MDatePickerInput";
import MDropdown from "../MDropdown";
import MSearchBar from "../MSearchBar";

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
  const { field: cattleStatusField } = useController({ name: 'cattleStatus', control });
  const { field: tagCattleNumber } = useController({ name: 'tagCattleNumber', control });
  const { field: weight } = useController({ name: 'weight', control });
  const { field: quarantineDays } = useController({ name: 'quarantineDays', control });

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
  const [inQuarantine, setQuarantine] = useState(false);

  const { cattleRecords } = useCattle();

  const motherIds = useMemo(() =>
    cattleRecords.map(cattle => ({
      id: cattle.id,
      title: cattle.name ? `${cattle.tagId}: ${cattle.name}` : `${cattle.tagId}`,
      value: cattle.id
    })),
    [cattleRecords]
  )

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
  },[]);

  return (<>
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
            label={'Nombre'}
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
              keyboardType: "numeric",
              maxLength: 4
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
              }
            }}
          />

          <MDatePickerInput
            label="Fecha de ingreso*"
            inputMode="start"
            control={control}
            name="admittedAt"
            errors={errors.bornAt}
            maxDate={new Date()}
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
              value: weight.value ? String(weight.value) : '',
              onChangeText: (value: string) => weight.onChange(parseFloat(value)),
            }}
          />

          <MDatePickerInput
            label="Fecha de nacimiento*"
            inputMode="start"
            control={control}
            name="bornAt"
            errors={errors.bornAt}
            maxDate={new Date()}
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

          {cattleStatusField.value === 'Gestante' && (
            <MDatePickerInput
              label="Fecha de gestación"
              inputMode="start"
              control={control}
              name="pregnantAt"
              errors={errors.bornAt}
              maxDate={new Date()}
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
            erroMessage={errors.motherId?.message ? errors.motherId?.message : ''}
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
            }}
          />
        </View>
      )}
    >
    </FlatList>
  </>)
}

export default memo(CattleInfoForm);