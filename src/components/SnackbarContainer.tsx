import { StyleSheet, View, ViewProps } from 'react-native'
import MSnackbar from './MSnackbar'

// Just a wrapper to add some styles.
const SnackbarContainer = (props: ViewProps & { dismissSnackbarId?: string; bottom?: number }) => {
  return (
    <View
      style={{ ...styles.container, bottom: props.bottom || 0 }}
      {...props}
    >
      {props.children}
      {props.dismissSnackbarId !== undefined && (
        <MSnackbar id={props.dismissSnackbarId}>Los cambios han sido descartados.</MSnackbar>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    gap: 16,
    padding: 16
  }
})

export default SnackbarContainer
