import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Card, Divider, List, Text } from 'react-native-paper'
import mainStyles from '../../styles/main'
import { colors } from '../../utils/colors';

export const MilkProductionResumeView = () => {
    return (
        <View style={{ ...mainStyles.container, display: "flex", gap: 20 }}>
            <View style={{ padding: 15 }}>
                <Card>
                    <Card.Content style={{ display: "flex", gap: 10 }}>
                        <Text variant='labelMedium' >Litros totales producidos</Text>
                        <Text variant='displayMedium'>4 958.465 L.</Text>
                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <Text variant='labelSmall'>Litros anuales promedio</Text>
                            <Text variant='labelSmall'>826.11L</Text>
                        </View>
                    </Card.Content>
                </Card>
            </View>
            <View style={styles.accordionsContainer}>
                <List.Accordion id={1} style={styles.accordion}
                    title={
                        <View>
                            <View style={styles.accordionTitle}>
                                <Text variant='bodyLarge'>2024</Text>
                                <Text variant='bodyMedium'>874L</Text>
                            </View>
                            <View style={styles.accordionTitle}>
                                <Text variant='labelSmall'>Promedio por mes: 150 L.</Text>
                                <Text variant='labelSmall' style={{ color: colors.textGreen }}>+52.42 L.</Text>
                            </View>
                        </View>}>
                    <List.Item title="Primer item" />
                    <List.Item title="Montonal de items" />
                    <List.Item title="Super montonal de items" />
                </List.Accordion >
                <List.Accordion id={2} style={styles.accordion}
                    title={
                        <View>
                            <View style={styles.accordionTitle}>
                                <Text variant='bodyLarge'>2024</Text>
                                <Text variant='bodyMedium'>874L</Text>
                            </View>
                            <View style={styles.accordionTitle}>
                                <Text variant='labelSmall'>Promedio por mes: 150 L.</Text>
                                <Text variant='labelSmall' style={{ color: colors.textGreen }}>+52.42 L.</Text>
                            </View>
                        </View>}>
                    <List.Item title="Primer item" />
                    <List.Item title="Montonal de items" />
                    <List.Item title="Super montonal de items" />
                </List.Accordion >

            </View>

        </View >
    )
}

const styles = StyleSheet.create({
    accordionsContainer: {
        gap: 0,
        borderTopColor: colors.borderVariant,
        borderTopWidth: 1,
    },
    accordion: {
        borderBottomColor: colors.borderVariant,
        borderBottomWidth: 1,
    },
    accordionTitle: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    }
});
