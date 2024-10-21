import { CattleContext, CattleDispatchContext } from "@/context/CattleContext"
import { Cattle, Genealogy } from "@/interfaces/cattleInterfaces"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useContext, useState } from "react"
import { ScrollView, View } from "react-native"
import { Appbar, Button, Checkbox, Divider, List, Searchbar, Text, TextInput, useTheme } from "react-native-paper"
import { DatePickerInput } from "react-native-paper-dates"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AddCattleStackParams } from "../../navigation/stacks/AddCattleStack"

type Props = NativeStackScreenProps<AddCattleStackParams, 'CattleForm'>;
export const CattleForm = ({ navigation, route }: Props) => {
    const theme = useTheme()
    const { cattle } = useContext(CattleContext)
    const dispatch = useContext(CattleDispatchContext)
    const [currentCattle, setCattle] = useState<Partial<Cattle>>(cattle)

    const [genealogy, setGenealogy] = useState<Partial<Genealogy>>({
        motherId: '',
        offspringId: currentCattle.tagId
    })

    const [isCattleSExpanded, setCattleSExpanded] = useState(false)
    const [isProdTypeExpanded, setProdTypeExpanded] = useState(false)
    const [inQuarantine, setQuarantine] = useState<boolean>(currentCattle.quarantineDaysLeft ? true : false)


    const handleChange = (key: string, value: any) => {
        if (key === 'weight' || key === 'quarantineDaysLeft') {
            if (isNaN(value)) return
        }

        key === 'cattleStatus' ? setCattleSExpanded(!isCattleSExpanded) : setProdTypeExpanded(!isProdTypeExpanded)
        setCattle({ ...currentCattle, [key]: value })
    }


    const validateForm = () => {
        // todo return message to show in toast
        if (!currentCattle.name
            || !currentCattle.tagId
            || !currentCattle.tagCattleNumber
            || !currentCattle.weight
            || !currentCattle.admittedAt
            || !currentCattle.bornAt
            || !currentCattle.cattleStatus
            || !currentCattle.productionType) {
            console.log('Missing fields');
            return false
        }

        if (currentCattle.cattleStatus === 'Gestante' && !currentCattle.pregnantAt) {
            console.log('Missing pregnantAt');
            return false
        }

        if (inQuarantine && !currentCattle.quarantineDaysLeft) {
            console.log('Missing quarantineDaysLeft');
            return false
        }

        return true
    }

    const handleNext = () => {
        // if (!validateForm()) return

        // dispatch({ type: 'save_cattle_information', payload: { cattle: currentCattle as Cattle, genealogy: genealogy as Genealogy } })

        navigation.navigate('Diet')
    }

    return (<>
        <Appbar.Header>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title='Información' />
        </Appbar.Header>
        <SafeAreaProvider>
            <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
                <ScrollView style={{
                    flexGrow: 1,
                    backgroundColor: theme.colors.surface
                }} >
                    <View style={{
                        flex: 1,
                        padding: 16,
                        gap: 10,
                        backgroundColor: theme.colors.surface
                    }}>
                        <Text variant="titleLarge">Datos Generales</Text>
                        <TextInput
                            label={'Nombre'}
                            mode='outlined'
                            value={currentCattle.name}
                            onChange={text => handleChange('name', text)}
                        />
                        <TextInput
                            label={'Numero identificador'}
                            mode='outlined'
                            keyboardType="numeric"
                            value={currentCattle.tagId}
                            onChange={text => handleChange('tagId', text)}
                        />
                        <TextInput
                            label={'Numero de vaca'}
                            mode='outlined'
                            keyboardType="numeric"
                            value={currentCattle.tagCattleNumber}
                            onChange={text => handleChange('tagCattleNumber', text)}
                        />
                        <DatePickerInput
                            locale="es"
                            label="Fecha de ingreso"
                            value={currentCattle.admittedAt}
                            onChange={(d) => setCattle({ ...currentCattle, admittedAt: d })}
                            inputMode="start"
                            mode="outlined"
                        />

                        <Divider style={{ marginVertical: 10 }} />

                        <Text variant="titleLarge">Datos de biológicos</Text>
                        <TextInput
                            label={'Peso'}
                            mode='outlined'
                            keyboardType="numeric"
                            value={currentCattle.weight?.toString()}
                            onChange={text => handleChange('weight', parseFloat(text.type))}
                        />
                        <DatePickerInput
                            locale="es"
                            label="Fecha de nacimiento"
                            value={currentCattle.bornAt}
                            onChange={(d) => setCattle({ ...currentCattle, bornAt: d })}
                            inputMode="start"
                            mode="outlined"
                        />

                        <Divider style={{ marginVertical: 10 }} />

                        <Text variant="titleLarge">Estado productivo</Text>
                        <List.Accordion
                            title="Estado"
                            description={currentCattle.cattleStatus}
                            expanded={isCattleSExpanded}
                            onPress={() => setCattleSExpanded(!isCattleSExpanded)}
                        >
                            <List.Item title="Gestante" onPress={() => handleChange('cattleStatus', 'Gestante')} />
                            <List.Item title="Producción" onPress={() => handleChange('cattleStatus', 'Producción')} />
                            <List.Item title="De reemplazo" onPress={() => handleChange('cattleStatus', 'De remplazo')} />
                            <List.Item title="De desecho" onPress={() => handleChange('cattleStatus', 'De desecho')} />
                        </List.Accordion>

                        {currentCattle.cattleStatus === 'Gestante' &&
                            <DatePickerInput
                                locale="es"
                                label="Fecha de gestación"
                                value={currentCattle.pregnantAt}
                                onChange={(d) => setCattle({ ...currentCattle, pregnantAt: d })}
                                inputMode="start"
                                mode="outlined"
                            />
                        }

                        <List.Accordion
                            title="Tipo de producción"
                            description={currentCattle.productionType}
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
                            label={'Días de cuarentena'}
                            mode='outlined'
                            disabled={!inQuarantine}
                            keyboardType="numeric"
                            value={currentCattle.quarantineDaysLeft?.toString()}
                            onChange={text => handleChange('quarantineDaysLeft', parseFloat(text.type))}
                        />
                    </View>
                </ScrollView>
                <Button
                    icon="arrow-right"
                    mode="elevated"
                    style={{ alignSelf: 'flex-end', marginHorizontal: 16, marginVertical: 10 }}
                    onPress={handleNext}>
                    Siguiente
                </Button>
            </View>
        </SafeAreaProvider>
    </>)
}