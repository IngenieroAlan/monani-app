import { StyleSheet, View, ViewProps } from 'react-native'
import MSnackbar from './MSnackbar'

export const DISMISS_SNACKBAR_ID = 'dismissSnackbar'

// Just a wrapper to add some styles.
const SnackbarContainer = (props: ViewProps & { dismissSnackbar?: boolean }) => {
  return (
    <View
      style={styles.container}
      {...props}
    >
      {props.children}
      {props.dismissSnackbar && <MSnackbar id={DISMISS_SNACKBAR_ID}>Los cambios han sido descartados.</MSnackbar>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 72,
    width: '100%',
    gap: 16,
    padding: 16
  }
})

export default SnackbarContainer
