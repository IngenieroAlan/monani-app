import React, { useCallback, useMemo, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Icon, RadioButton, Text } from 'react-native-paper'
import { DatePickerModal } from 'react-native-paper-dates'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { MilkProductionItem } from '../../components/MilkProductionItem'
import mainStyles from '../../styles/main'
import { colors } from '../../utils/colors';

export const MilkProductionView = () => {
  const [date, setDate] = React.useState(undefined);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [bottomFilterSheet, setBottomFilterSheet] = useState(-1)
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%"], []);
  const [value, setValue] = React.useState('asc');

  const onDismissSingle = useCallback(() => {
    setOpenDatePicker(false);
  }, [setOpenDatePicker]);

  const onConfirmSingle = useCallback(
    (params: any) => {
      setOpenDatePicker(false);
      setDate(params.date);
    },
    [setOpenDatePicker, setDate]
  );
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  return (
    <View style={{ ...mainStyles.container, padding: 10, gap: 15 }}>
      <View style={{ display: "flex", flexDirection: "row", gap: 15 }}>
        <Button onPress={() => setOpenDatePicker(true)} uppercase={false} mode="outlined" style={styles.buttons}>
          <Icon source={"calendar"} size={20} color={colors.textStrong} />
          <Text variant='labelLarge' style={{ color: colors.textStrong }}>
            Fecha
          </Text>
        </Button>
        <Button onPress={() => setBottomFilterSheet(0)} uppercase={false} mode="outlined" style={styles.buttons}>
          <Icon source={"filter-outline"} size={20} color={colors.textStrong} />
          <Text variant='labelLarge' style={{ color: colors.textStrong }}>
            Ordenar por
          </Text>
        </Button>
      </View>
      <MilkProductionItem milkAverage={9} totalMilk={100} updateMilk={-30} date='21/09/24' />
      <MilkProductionItem milkAverage={11.7} totalMilk={130} updateMilk={20} date='20/09/24' />
      <MilkProductionItem milkAverage={9.5} totalMilk={110} updateMilk={10} date='19/09/24' />
      <MilkProductionItem milkAverage={9} totalMilk={100} updateMilk={-30} date='18/09/24' />
      <MilkProductionItem milkAverage={9} totalMilk={130} date='17/09/24' />
      <DatePickerModal
        locale="es"
        mode="single"
        visible={openDatePicker}
        onDismiss={onDismissSingle}
        date={date}
        onConfirm={onConfirmSingle}
      />
      <BottomSheet
        ref={bottomSheetRef}
        index={bottomFilterSheet}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={() => setBottomFilterSheet(-1)}
        onChange={handleSheetChanges}
      >
        <BottomSheetView>
          <Text variant='titleMedium' style={{ marginBottom: 5 }}>Ordenar por</Text>
          <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
            <View style={styles.radioButtonItem}>
              <Icon source="arrow-up" size={24} />
              <Text variant='bodyLarge'>Producción ascendente</Text>
              <RadioButton value="asc" />
            </View>
            <View style={styles.radioButtonItem}>
              <Icon source="arrow-down" size={24} />
              <Text variant='bodyLarge'>Producción descendente</Text>
              <RadioButton value="desc" />
            </View>
          </RadioButton.Group>
        </BottomSheetView>
      </BottomSheet>
    </View >
  )
}
const styles = StyleSheet.create({
  buttons: {
    borderRadius: 8,
    borderColor: colors.borderVariant
  },
  radioButtonItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    gap: 15
  }
});