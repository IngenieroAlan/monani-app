import React from 'react'
import { Button, Modal, Portal } from "react-native-paper";
import { Text } from "react-native";

interface Props{
    content: string;
    btnText: string;
}

export const PaperModal = ({content, btnText}:Props) => {
    const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
  };
  return (
    <>
    <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <Text>{content}</Text>
        </Modal>
      </Portal>
      <Button mode="elevated" onPress={showModal}>
        {btnText}
      </Button>
    </>
  )
}
