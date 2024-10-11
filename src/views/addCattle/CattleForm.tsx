import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useState } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { Button, Checkbox, Divider, List, Searchbar, Text, TextInput } from "react-native-paper"
import { DatePickerInput } from "react-native-paper-dates"
import { SafeAreaProvider } from "react-native-safe-area-context"
import Cattle, { CattleStatus, ProductionType } from "../../database/models/Cattle"
import Genealogy from "../../database/models/Genealogy"
import { AddCattleStackParams } from "../../navigation/stacks/AddCattleStack"

type Props = NativeStackScreenProps<AddCattleStackParams, 'CattleForm'>;
export const CattleForm = ({ navigation, route }: Props) => {
    const [cattle, setCattle] = useState<Partial<Cattle>>({
        name: '',
        weight: undefined,
        bornAt: undefined,
        tagId: '',
        tagCattleNumber: '',
        admittedAt: undefined,
        cattleStatus: '' as CattleStatus,
        productionType: '' as ProductionType,
        quarantineDaysLeft: undefined
    })

    const [genealogy, setGenealogy] = useState<Partial<Genealogy>>({
        motherId: '',
        offspringId: cattle.tagId
    })

    const [isCattleSExpanded, setCattleSExpanded] = useState(false)
    const [isProdTypeExpanded, setProdTypeExpanded] = useState(false)
    const [inQuarantine, setQuarantine] = useState<boolean>(false)


    const handleChange = (key: string, value: any) => {
        if (key === 'weight' || key === 'quarantineDaysLeft') {
            if (isNaN(value)) return
        }

        key === 'cattleStatus' ? setCattleSExpanded(!isCattleSExpanded) : setProdTypeExpanded(!isProdTypeExpanded)
        setCattle({ ...cattle, [key]: value })
    }

    return (
        <SafeAreaProvider>
            <ScrollView style={styles.scrollContainer} >
                <View style={styles.container}>
                    <Text variant="titleLarge">Datos Generales</Text>
                    <TextInput
                        label={cattle.name ? cattle.name : 'Nombre'}
                        placeholder='Nombre'
                        mode='outlined'
                        value={cattle.name}
                        onChange={text => handleChange('name', text)}
                    />
                    <TextInput
                        label={cattle.tagId ? cattle.tagId : 'Numero identificador'}
                        placeholder='Numero identificador'
                        mode='outlined'
                        keyboardType="numeric"
                        value={cattle.tagId}
                        onChange={text => handleChange('tagId', text)}
                    />
                    <TextInput
                        label={cattle.tagCattleNumber ? cattle.tagCattleNumber : 'Numero de vaca'}
                        placeholder='Numero de vaca'
                        mode='outlined'
                        keyboardType="numeric"
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

                    <Text variant="titleLarge">Datos de biológicos</Text>
                    <TextInput
                        label={cattle.weight ? cattle.weight.toString() : 'Peso'}
                        placeholder='Peso'
                        mode='outlined'
                        keyboardType="numeric"
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

                    <Divider style={{ marginVertical: 10 }} />

                    <Text variant="titleLarge">Estado productivo</Text>
                    <List.Accordion
                        title="Estado"
                        description={cattle.cattleStatus}
                        expanded={isCattleSExpanded}
                        onPress={() => setCattleSExpanded(!isCattleSExpanded)}
                    >
                        <List.Item title="Gestante" onPress={() => handleChange('cattleStatus', 'Gestante')} />
                        <List.Item title="Producción" onPress={() => handleChange('cattleStatus', 'Producción')} />
                        <List.Item title="De reemplazo" onPress={() => handleChange('cattleStatus', 'De remplazo')} />
                        <List.Item title="De desecho" onPress={() => handleChange('cattleStatus', 'De desecho')} />
                    </List.Accordion>

                    {cattle.cattleStatus === 'Gestante' &&
                        <DatePickerInput
                            locale="es"
                            label="Fecha de gestación"
                            value={cattle.pregnantAt}
                            onChange={(d) => setCattle({ ...cattle, pregnantAt: d })}
                            inputMode="start"
                            mode="outlined"
                        />
                    }

                    <List.Accordion
                        title="Tipo de producción"
                        description={cattle.productionType}
                        expanded={isProdTypeExpanded}
                        onPress={() => setProdTypeExpanded(!isProdTypeExpanded)}
                    >
                        <List.Item title="Producción lechera" onPress={() => handleChange('productionType', 'Producción lechera')} />
                        <List.Item title="Producción de carne" onPress={() => handleChange('productionType', 'Producción de carne')} />
                    </List.Accordion>


                    <Divider style={{ marginVertical: 10 }} />

                    <Text variant="titleLarge">Genealogía</Text>
                    <Searchbar
                        placeholder='No. identenficador de la madre'
                        value={genealogy.motherId ? genealogy.motherId : ''}
                        onChangeText={text => setGenealogy({ ...genealogy, motherId: text })}
                    />

                    <Divider style={{ marginVertical: 10 }} />

                    <Checkbox.Item
                        label="En cuarentena"
                        status={inQuarantine ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setQuarantine(!inQuarantine);
                        }}
                    />
                    <TextInput
                        label={cattle.quarantineDaysLeft ? cattle.quarantineDaysLeft.toString() : 'Días de cuarentena'}
                        placeholder='Días de cuarentena'
                        mode='outlined'
                        disabled={!inQuarantine}
                        keyboardType="numeric"
                        value={cattle.quarantineDaysLeft?.toString()}
                        onChange={text => handleChange('quarantineDaysLeft', parseFloat(text.type))}
                    />

                    <Button
                        icon="arrow-right"
                        mode="contained-tonal"
                        style={{ marginTop: 20 }}
                        onPress={() => navigation.navigate('FeedForm', {
                            cattle: cattle,
                            genealogy: genealogy,
                            inQuarantine: inQuarantine
                        })}>
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
        minHeight: '100%'
    },
    container: {
        flex: 1,
        padding: 16,
        gap: 10,
    }
});