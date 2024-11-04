import { colors } from '@/utils/colors';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Divider, Text } from 'react-native-paper';

export const InfoRoute = () => {
    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={{ padding: 10, gap: 20 }}>
                <Card style={styles.card}>
                    <Card.Title title="Cuarentena" />
                    <Divider style={{ width: "85%", alignSelf: "center" }} />
                    <Card.Content style={{ marginTop: 10 }}>
                        <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Tiempo restante</Text>
                        <Text variant="titleSmall">27 días</Text>
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Title title="Datos generales" />
                    <Divider style={{ width: "85%", alignSelf: "center" }} />
                    <Card.Content style={{ marginTop: 10, gap: 8 }}>
                        <View>
                            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Nombre</Text>
                            <Text variant="titleSmall">Vaca loca</Text>
                        </View>
                        <View>
                            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>No. identificador</Text>
                            <Text variant="titleSmall">6603</Text>
                        </View>
                        <View>
                            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>No. de vaca</Text>
                            <Text variant="titleSmall">00306703</Text>
                        </View>
                        <View>
                            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Fecha de ingreso</Text>
                            <Text variant="titleSmall">Viernes 20 de septiembre de 2024</Text>
                        </View>
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Title title="Datos biológicos" />
                    <Divider style={{ width: "85%", alignSelf: "center" }} />
                    <Card.Content style={{ marginTop: 10, gap: 8 }}>
                        <View>
                            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Peso</Text>
                            <Text variant="titleSmall">537 kg</Text>
                        </View>
                        <View>
                            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Edad</Text>
                            <Text variant="titleSmall">3 años, 5 meses, 10 dias</Text>
                        </View>
                        <View>
                            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Fecha de nacimiento</Text>
                            <Text variant="titleSmall">Viernes 03 de septiembre de 2021</Text>
                        </View>
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Title title="Estado productivo" />
                    <Divider style={{ width: "85%", alignSelf: "center" }} />
                    <Card.Content style={{ marginTop: 10, gap: 8 }}>
                        <View>
                            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Producción</Text>
                            <Text variant="titleSmall">Lechera</Text>
                        </View>
                        <View>
                            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Estado</Text>
                            <Text variant="titleSmall">Gestante</Text>
                        </View>
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Title title="Gestación" />
                    <Divider style={{ width: "85%", alignSelf: "center" }} />
                    <Card.Content style={{ marginTop: 10, gap: 8 }}>
                        <View>
                            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Edad gestacional</Text>
                            <Text variant="titleSmall">7 meses, 3 días</Text>
                        </View>
                        <View>
                            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Inicio de gestación</Text>
                            <Text variant="titleSmall">Sabado 10 de marzo de 2024</Text>
                        </View>
                        <View>
                            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Día de parto</Text>
                            <Text variant="titleSmall">Martes 10 de diciembre de 2024</Text>
                        </View>
                    </Card.Content>
                </Card>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFF",
        paddingTop: 4
    }
});