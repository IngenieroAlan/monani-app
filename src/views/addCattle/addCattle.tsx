import { useState } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { Button, Checkbox, Divider, List, Searchbar, TextInput } from "react-native-paper"
import { DatePickerInput } from "react-native-paper-dates"
import { SafeAreaProvider } from "react-native-safe-area-context"
import Cattle, { CattleStatus, ProductionType } from "../../db/model/Cattle"
import Genealogy from "../../db/model/Genealogy"
import { colors } from "../../utils/colors"

export const AddCattleView = () => {
    const [expanded, setExpanded] = useState(false)
    const [cattle, setCattle] = useState<Partial<Cattle>>({
        name: '',
        weight: 0,
        bornAt: {} as Date,
        tagId: '',
        tagCattleNumber: '',
        admittedAt: {} as Date,
        cattleStatus: '' as CattleStatus,
        productionType: '' as ProductionType
    })

    const [genealogy, setGenealogy] = useState<Partial<Genealogy>>({
        motherId: '',
        offspringId: cattle.tagId
    })

    const handleChange = (key: string, value: any) => {
        setCattle({ ...cattle, [key]: value })
    }

    return (
        <SafeAreaProvider>
            <ScrollView style={styles.scrollContainer} >
                <View style={styles.container}>
                    <Checkbox.Item label="En cuarentena" status="unchecked" />

                    <Divider style={{ marginVertical: 10 }} />

                    <TextInput
                        placeholder='Nombre'
                        mode='outlined'
                        value={cattle.name}
                        onChange={text => handleChange('name', text)}
                    />
                    <TextInput
                        placeholder='Peso'
                        mode='outlined'
                        value={cattle.weight?.toString()}
                        onChange={text => handleChange('weight', parseFloat(text.type))}
                    />
                    <DatePickerInput
                        locale="es"
                        label="Fecha de nacimiento"
                        value={cattle.bornAt}
                        onChange={(d) => setCattle({ ...cattle, bornAt: d })}
                        inputMode="start"
                        mode="outlined"
                    />
                    <TextInput
                        placeholder='Numero identificador'
                        mode='outlined'
                        value={cattle.tagId}
                        onChange={text => handleChange('tagId', text)}
                    />
                    <TextInput
                        placeholder='Numero de vaca'
                        mode='outlined'
                        value={cattle.tagCattleNumber}
                        onChange={text => handleChange('tagCattleNumber', text)}
                    />
                    <DatePickerInput
                        locale="es"
                        label="Fecha de ingreso"
                        value={cattle.admittedAt}
                        onChange={(d) => setCattle({ ...cattle, admittedAt: d })}
                        inputMode="start"
                        mode="outlined"
                    />

                    <Divider style={{ marginVertical: 10 }} />

                    <List.Accordion
                        title="Estado"
                        description={cattle.cattleStatus}
                        expanded={expanded}
                        onPress={() => {
                            setExpanded(!expanded)
                        }}
                    >
                        <List.Item title="Gestante" />
                        <List.Item title="Producción" />
                        <List.Item title="De reemplazo" />
                        <List.Item title="De desecho" />
                    </List.Accordion>

                    <List.Accordion
                        title="Tipo de producción"
                        description={cattle.productionType}
                        expanded={expanded}
                        onPress={() => setExpanded(!expanded)}
                    >
                        <List.Item title="Producción lechera" />
                        <List.Item title="Producción de carne" />
                    </List.Accordion>

                    <Divider style={{ marginVertical: 10 }} />

                    <Searchbar
                        placeholder='No. identenficador de la madre'
                        value={genealogy.motherId ? genealogy.motherId : ''}
                        onChangeText={text => setGenealogy({ ...genealogy, motherId: text })}
                    />

                    <Button icon="arrow-right" mode="contained-tonal" onPress={() => null}>
                        Siguiente
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        minHeight: '100%',
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        padding: 16,
        gap: 10,
    }
});
