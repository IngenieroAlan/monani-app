import Cattle from "@/database/models/Cattle";
import useCattle from "@/hooks/collections/useCattle";
import { Q } from "@nozbe/watermelondb";
import { memo, useEffect, useMemo, useState } from "react";
import { Control, Controller, FormState, useController } from "react-hook-form";
import { FlatList, View } from "react-native";
import { Checkbox, Divider, HelperText, Icon, IconButton, Text, TextInput, useTheme } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { CustomTextInput } from "../CustomTextInput";
import MDropdown from "../MDropdown";
import MSearchBar from "../MSearchBar";
import { CattleInfoFields } from "@/redux/slices/addCattleSlice";
import MDatePickerInput from "../MDatePickerInput";

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
  const { field: quarantineDaysLeft } = useController({ name: 'quarantineDaysLeft', control });

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
              maxLength: 10
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
              maxLength: 4
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
              quarantineDaysLeft.onChange(inQuarantine ? 0 : undefined as any)
            }}
          />
          <CustomTextInput
            name="quarantineDaysLeft"
            control={control}
            label={'Días de cuarentena'}
            errors={errors.quarantineDaysLeft}
            helperText={errors.quarantineDaysLeft?.message ? errors.quarantineDaysLeft.message : ''}
            more={{
              keyboardType: "numeric",
              disabled: !inQuarantine
            }}
          />
        </View>
      )}
    >
    </FlatList>
  </>)
}

export default memo(CattleInfoForm);