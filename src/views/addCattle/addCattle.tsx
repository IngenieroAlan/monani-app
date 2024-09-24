import { ScrollView, View } from "react-native"
import { Button, Checkbox, Divider, List, Searchbar, Text, TextInput } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"

export const AddCattleView = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={mainStyles.container} >
                <Checkbox.Item label="En cuarentena" status="unchecked" />

                <Divider style={{ marginVertical: 10 }} />

                <TextInput
                    placeholder='Nombre'
                    mode='outlined'
                />
                <TextInput
                    placeholder='Peso'
                    mode='outlined'
                />
                <TextInput
                    placeholder='Fecha de nacimiento'
                    mode='outlined'
                />
                <TextInput
                    placeholder='Numero identificador'
                    mode='outlined'
                />
                <TextInput
                    placeholder='Numero de vaca'
                    mode='outlined'
                />
                <TextInput
                    placeholder='Fecha de ingreso'
                    mode='outlined'
                />

                <Divider style={{ marginVertical: 10 }} />

                <List.Accordion title="Estado">
                    <List.Item title="Vivo" />
                    <List.Item title="Muerto" />
                </List.Accordion>

                <List.Accordion title="Tipo de producción">
                    <List.Item title="Leche" />
                    <List.Item title="Carne" />
                </List.Accordion>

                <Divider style={{ marginVertical: 10 }} />

                <Searchbar
                    placeholder='No. identenficador de la madre'
                    onChange={() => console.log('Searching...')}
                    value=""
                />

                <Button icon="arrow-right" mode="contained-tonal" onPress={() => console.log('Pressed')}>
                    Siguiente
                </Button>
            </ScrollView>
        </SafeAreaView>
    )
}

const mainStyles = {
    container: {
        flex: 1,
        padding: 20
    }
}