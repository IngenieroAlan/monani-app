import { useState } from "react";
import { Button, Dialog, Portal, Searchbar, TextInput } from "react-native-paper";

interface Props {
    visible: boolean;
    onDismiss: () => void;
    onAdd: () => void;
}

export default function AddFeedDialog({ visible, onDismiss, onAdd }: Props) {
    const [quantity, setQuantity] = useState('');
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Title>Agregar alimento</Dialog.Title>
                <Dialog.Content>
                    <Searchbar placeholder="Buscar alimento" value="" />
                    <TextInput
                        label="Cantidad"
                        value={quantity}
                        onChangeText={setQuantity}
                        keyboardType="numeric"
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>Cancelar</Button>
                    <Button onPress={onAdd}>Agregar</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal >
    );
}