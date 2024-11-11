import merge from 'deepmerge'
import { MD3DarkTheme, MD3LightTheme, useTheme } from 'react-native-paper'

const LightThemeColors = {
  colors: {
    // Extended colors.
    success: 'rgb(16, 109, 32)',
    onSuccess: 'rgb(255, 255, 255)',
    successContainer: 'rgb(157, 248, 152)',
    onSuccessContainer: 'rgb(0, 34, 4)',
    notificationContainer: 'rgba(195, 241, 141, 0.3)' // Secondary container with 0.5 opacity.
  }
}

const DarkThemeColors = {
  colors: {
    // Extended colors.
    success: 'rgb(130, 219, 126)',
    onSuccess: 'rgb(0, 57, 10)',
    successContainer: 'rgb(0, 83, 18)',
    onSuccessContainer: 'rgb(157, 248, 152)',
    notificationContainer: 'rgba(46, 79, 0, 0.3)' // Secondary container with 0.5 opacity.
  }
}

export const CustomLightTheme = merge(MD3LightTheme, LightThemeColors)
export const CustomDarkTheme = merge(MD3DarkTheme, DarkThemeColors)

export type AppTheme = typeof CustomLightTheme | typeof CustomDarkTheme

const useAppTheme = () => useTheme<AppTheme>()
export default useAppTheme
