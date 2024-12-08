import { YearlyMilkProduction } from '@/hooks/collections/useMilkProductionResume';
import { colors } from '@/utils/colors';
import React from 'react'
import { StyleSheet, View } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';

interface Props {
    yearData: YearlyMilkProduction;
}
const formattedLiters = (data: string) => new Intl.NumberFormat().format(parseFloat(data)).replace(/,/g, ' ');
export const AnnualMilkProducedAccordion = ({ yearData }: Props) => {
    const theme = useTheme();
    return (
        <List.Accordion
            key={yearData.year}
            id={yearData.year.toString()}
            style={styles.accordion}
            title={
                <View>
                    <View style={styles.accordionTitle}>
                        <Text variant="bodyLarge">{yearData.year}</Text>
                        <Text variant="bodyMedium">{formattedLiters(yearData.totalLiters.toFixed(2))} L</Text>
                    </View>
                    <View style={styles.accordionTitle}>
                        <Text variant="labelSmall">Promedio por mes: {formattedLiters(yearData.monthlyAverage.toFixed(2))} L.</Text>
                        {(yearData.differenceFromPreviousYear && yearData.differenceFromPreviousYear !== 0) && (
                            <Text
                                variant="labelSmall"
                                style={{ color: yearData.differenceFromPreviousYear > 0 ? theme.colors.inversePrimary : theme.colors.error }}
                            >
                                {yearData.differenceFromPreviousYear > 0
                                    ? `+${formattedLiters(yearData.differenceFromPreviousYear+"")} L`
                                    : `-${formattedLiters(yearData.differenceFromPreviousYear+"")} L`}
                            </Text>
                        )}
                        {(!yearData.differenceFromPreviousYear || yearData.differenceFromPreviousYear === 0) && (
                            <Text variant="labelSmall">Actual</Text>
                        )}
                    </View>
                </View>
            }
        >
            {yearData.monthlyBreakdown.map((monthData) => (
                <List.Item
                    key={monthData.month}
                    style={{ backgroundColor: theme.colors.surface }}
                    title={() => <Text variant="labelLarge">{monthData.month}</Text>}
                    right={() => <Text>{formattedLiters(monthData.liters.toFixed(2))} L</Text>}
                />
            ))}
        </List.Accordion>
    );
};

const styles = StyleSheet.create({
    accordion: {
        borderBottomColor: colors.borderVariant,
        borderBottomWidth: 1,
        overflow: "scroll",
    },
    accordionTitle: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    }
});