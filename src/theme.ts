import { MD3DarkTheme, MD3LightTheme, useTheme } from 'react-native-paper'
import merge from 'deepmerge'

const SuccessLightTheme = {
  colors: {
    success: 'rgb(16, 109, 32)',
    onSuccess: 'rgb(255, 255, 255)',
    successContainer: 'rgb(157, 248, 152)',
    onSuccessContainer: 'rgb(0, 34, 4)'
  }
}

const SuccessDarkTheme = {
  colors: {
    success: 'rgb(130, 219, 126)',
    onSuccess: 'rgb(0, 57, 10)',
    successContainer: 'rgb(0, 83, 18)',
    onSuccessContainer: 'rgb(157, 248, 152)'
  }
}

export const ExtendedLightTheme = merge(MD3LightTheme, SuccessLightTheme)
export const ExtendedDarkTheme = merge(MD3DarkTheme, SuccessDarkTheme)

export type AppTheme = typeof ExtendedLightTheme | typeof ExtendedDarkTheme

const useAppTheme = () => useTheme<AppTheme>()
export default useAppTheme