import { format } from "date-fns";
import { es } from "date-fns/locale";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, Text, TouchableRipple } from "react-native-paper";

interface Props {
  totalMilk: number;
  date: Date;
  productionCount?: number;
}

export const MilkProductionItem = ({
  productionCount,
  totalMilk,
  date,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={() => console.log("clico")}
      style={styles.container}
      activeOpacity={0.5}
    >
      <View style={styles.infoContainer}>
        <Text variant="bodyLarge" style={{ color: "#1D1B20" }}>
          {totalMilk} L.
        </Text>
        {productionCount && productionCount != 0 && (
          <Text
            variant="bodySmall"
          >
            {productionCount} {productionCount > 1 ? "producciones" : "producción"}
          </Text>
        )}
      </View>
      <View style={[styles.infoContainer, { alignItems: 'flex-end' }]}>
        <View style={{ flexDirection: 'row' }}>
          <Text variant="labelSmall" style={{ color: "#49454F" }}>
            {format(date, "dd/MM/yy", { locale: es })}
          </Text>
          <Icon source="menu-right" color={'#49454F'} size={24} />
        </View>
      </View>
    </TouchableOpacity >
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 5,
    flexDirection: 'row',
    marginBottom:8,
  },
  infoContainer: {
    flex: 1,
  }
});
