import React, { useCallback, useMemo, useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Icon, RadioButton, Text, useTheme } from 'react-native-paper'
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { MilkProductionItem } from '../../components/milkProduction/MilkProductionItem';
import { colors } from '../../utils/colors';
import { useAppDispatch } from '@/hooks/useRedux';
import MDateTimePicker from '@/components/MDateTimePicker';
import useMilkProduction from '@/hooks/collections/useMilkProduction';
import MilkProduction from '@/database/models/MilkProduction';
import { FlashList } from '@shopify/flash-list';
import { EmptyItem } from '@/components/milkProduction/EmptyItem';
import { DateType } from 'react-native-ui-datepicker';
import MBottomSheet from '@/components/MBottomSheet';
import FilterChip from '@/components/FilterChip';
import { format } from 'date-fns';

const SORT_ORDERS = { ASC: "ASC", DESC: "DESC" };

const ITEMS_PAGE_LIMIT = 15;

export const MilkProductionView = () => {
  const theme = useTheme()
  const [index, setIndex] = useState(0)
  const [startDate, setStartDate] = useState<DateType>()
  const [endDate, setEndDate] = useState<DateType>()
  const [datesRange, setDatesRange] = useState<number[] | null>();
  const dateFilterText = useRef<string | null>(null)
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const { milkProductionRecords } = useMilkProduction({ take: (ITEMS_PAGE_LIMIT + ITEMS_PAGE_LIMIT * index), betweenDates: datesRange, order: sortOrder });
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [bottomFilterSheet, setBottomFilterSheet] = useState(-1)
  const snapPoints = useMemo(() => ["30%"], []);


  const onConfirm = useCallback(
    (params: any) => {
      setOpenDatePicker(false);
      setStartDate(params.startDate)
      setEndDate(params.endDate)
    },
    [setOpenDatePicker]
  );
  const renderItem = useCallback(({ item }: { item: MilkProduction }) => {
    return (
      <MilkProductionItem
        totalMilk={item.liters}
        productionCount={item.productionNumber}
        date={item.producedAt}
      />
    )
  }, [])
  const getDateFilterText = (startDate: Date, endDate: Date) => {
    const startDateText = format(startDate, 'dd/MM/yy')
    const endDateText = format(endDate, 'dd/MM/yy')

    return `${startDateText} - ${endDateText}`
  }
  const resetDates = () => {
    setDatesRange(null);
    setStartDate(null);
    setEndDate(null);
  };
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface, padding: 10, gap: 15 }}>
      <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 6 }}>
        <FilterChip
          mode='outlined'
          icon='calendar-range'
          filters={dateFilterText.current ? [dateFilterText.current] : []}
          onPress={() => setOpenDatePicker(true)}
          onClose={() => {
            dateFilterText.current = null
            resetDates()
          }}
        >
          Fecha
        </FilterChip>
        <FilterChip
          mode='outlined'
          icon='filter-outline'
          filters={!!sortOrder ? [(sortOrder === SORT_ORDERS.DESC) ? "Descendente" : "Ascendente"] : []}
          onPress={() => setBottomFilterSheet(0)}
          onClose={() => setSortOrder(null)}
        >
          Ordenar por
        </FilterChip>
      </View>
      <FlashList
        estimatedItemSize={80}
        data={milkProductionRecords}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyItem />}
        onEndReachedThreshold={2}
      />
      <MDateTimePicker
        locale="es"
        mode="range"
        visible={openDatePicker}
        startDate={startDate}
        endDate={endDate}
        minDate={null}
        maxDate={new Date()}
        onConfirm={() => {
          if (!startDate || !endDate) return

          const _startDate = new Date(startDate.toString())
          const _endDate = new Date(endDate.toString())
          dateFilterText.current = getDateFilterText(_startDate, _endDate)
          const startDateTime = _startDate.getTime()
          const endDateTime = _endDate.getTime()

          setDatesRange([startDateTime, endDateTime])

          setOpenDatePicker(false)
        }}
        onChange={(params) => {
          setStartDate(params.startDate)
          setEndDate(params.endDate)
        }}
        onDismiss={() => setOpenDatePicker(false)}
        onCancel={() => setOpenDatePicker(false)}
        dismissable
        firstDayOfWeek={1}
      />
      <MBottomSheet
        index={bottomFilterSheet}
        snapPoints={snapPoints}
        onClose={() => { setBottomFilterSheet(-1); }}
      >
        <BottomSheetView>
          <Text variant='titleMedium' style={{ marginBottom: 5 }}>Ordenar por</Text>
          <RadioButton.Group onValueChange={(newValue) => setSortOrder(newValue)} value={!sortOrder?"":sortOrder}>
            <TouchableOpacity style={styles.radioButtonItem} onPress={() => setSortOrder(SORT_ORDERS.ASC)}>
              <Icon source="arrow-up" size={24} />
              <Text variant='bodyLarge'>Producción ascendente</Text>
              <RadioButton value={SORT_ORDERS.ASC} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.radioButtonItem} onPress={() => setSortOrder(SORT_ORDERS.DESC)}>
              <Icon source="arrow-down" size={24} />
              <Text variant='bodyLarge'>Producción descendente</Text>
              <RadioButton value={SORT_ORDERS.DESC} />
            </TouchableOpacity>
          </RadioButton.Group>
        </BottomSheetView>
      </MBottomSheet>
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