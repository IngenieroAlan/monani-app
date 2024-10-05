import { useState } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { Button, Checkbox, Divider, List, Searchbar, Text, TextInput } from "react-native-paper"
import { colors } from "../../utils/colors"

export const AddCattleView = () => {
    const [text, setText] = useState<any>('')
    return (
        <ScrollView style={styles.container} >
            <View style={styles.scrollContainer}>
                <Checkbox.Item label="En cuarentena" status="unchecked" />

                <Divider style={{ marginVertical: 10 }} />

                <TextInput
                    placeholder='Nombre'
                    mode='flat'
                    value=""
                    onChange={text => setText(text)}
                />
                <TextInput
                    placeholder='Peso'
                    mode='outlined'
                    value=""
                    onChange={text => setText(text)}
                />
                <TextInput
                    placeholder='Fecha de nacimiento'
                    mode='outlined'
                    value=""
                    onChange={text => setText(text)}
                />
                <TextInput
                    placeholder='Numero identificador'
                    mode='outlined'
                    value=""
                    onChange={text => setText(text)}
                />
                <TextInput
                    placeholder='Numero de vaca'
                    mode='outlined'
                    value=""
                    onChange={text => setText(text)}
                />
                <TextInput
                    placeholder='Fecha de ingreso'
                    mode='outlined'
                    value=""
                    onChange={text => setText(text)}
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
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        minHeight: '100%',
        backgroundColor: colors.background
    },
    container: {
        flex: 1,
        padding: 16,
    }
});
