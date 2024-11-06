import merge from 'deepmerge'
import { MD3DarkTheme, MD3LightTheme, useTheme } from 'react-native-paper'

const LightThemeColors = {
  colors: {
    primary: 'rgb(3, 110, 13)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(153, 249, 137)',
    onPrimaryContainer: 'rgb(0, 34, 1)',
    secondary: 'rgb(83, 99, 78)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(214, 232, 205)',
    onSecondaryContainer: 'rgb(17, 31, 15)',
    tertiary: 'rgb(56, 101, 105)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(188, 235, 239)',
    onTertiaryContainer: 'rgb(0, 32, 34)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(252, 253, 246)',
    onBackground: 'rgb(26, 28, 25)',
    surface: 'rgb(252, 253, 246)',
    onSurface: 'rgb(26, 28, 25)',
    surfaceVariant: 'rgb(223, 228, 216)',
    onSurfaceVariant: 'rgb(66, 73, 63)',
    outline: 'rgb(115, 121, 110)',
    outlineVariant: 'rgb(194, 200, 188)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(47, 49, 45)',
    inverseOnSurface: 'rgb(241, 241, 235)',
    inversePrimary: 'rgb(125, 220, 112)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(240, 246, 234)',
      level2: 'rgb(232, 242, 227)',
      level3: 'rgb(225, 237, 220)',
      level4: 'rgb(222, 236, 218)',
      level5: 'rgb(217, 233, 213)'
    },
    surfaceDisabled: 'rgba(26, 28, 25, 0.12)',
    onSurfaceDisabled: 'rgba(26, 28, 25, 0.38)',
    backdrop: 'rgba(44, 50, 42, 0.4)',

    // Extended colors.
    success: 'rgb(16, 109, 32)',
    onSuccess: 'rgb(255, 255, 255)',
    successContainer: 'rgb(157, 248, 152)',
    onSuccessContainer: 'rgb(0, 34, 4)'
  }
}

const DarkThemeColors = {
  colors: {
    primary: 'rgb(125, 220, 112)',
    onPrimary: 'rgb(0, 58, 3)',
    primaryContainer: 'rgb(0, 83, 7)',
    onPrimaryContainer: 'rgb(153, 249, 137)',
    secondary: 'rgb(187, 204, 178)',
    onSecondary: 'rgb(38, 52, 34)',
    secondaryContainer: 'rgb(60, 75, 55)',
    onSecondaryContainer: 'rgb(214, 232, 205)',
    tertiary: 'rgb(160, 207, 211)',
    onTertiary: 'rgb(0, 54, 58)',
    tertiaryContainer: 'rgb(30, 77, 81)',
    onTertiaryContainer: 'rgb(188, 235, 239)',
    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 180, 171)',
    background: 'rgb(26, 28, 25)',
    onBackground: 'rgb(226, 227, 221)',
    surface: 'rgb(26, 28, 25)',
    onSurface: 'rgb(226, 227, 221)',
    surfaceVariant: 'rgb(66, 73, 63)',
    onSurfaceVariant: 'rgb(194, 200, 188)',
    outline: 'rgb(140, 147, 135)',
    outlineVariant: 'rgb(66, 73, 63)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(226, 227, 221)',
    inverseOnSurface: 'rgb(47, 49, 45)',
    inversePrimary: 'rgb(3, 110, 13)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(31, 38, 29)',
      level2: 'rgb(34, 43, 32)',
      level3: 'rgb(37, 49, 35)',
      level4: 'rgb(38, 51, 35)',
      level5: 'rgb(40, 55, 37)'
    },
    surfaceDisabled: 'rgba(226, 227, 221, 0.12)',
    onSurfaceDisabled: 'rgba(226, 227, 221, 0.38)',
    backdrop: 'rgba(44, 50, 42, 0.4)',

    // Extended colors.
    success: 'rgb(130, 219, 126)',
    onSuccess: 'rgb(0, 57, 10)',
    successContainer: 'rgb(0, 83, 18)',
    onSuccessContainer: 'rgb(157, 248, 152)'
  }
}

export const CustomLightTheme = merge(MD3LightTheme, LightThemeColors)
export const CustomDarkTheme = merge(MD3DarkTheme, DarkThemeColors)

export type AppTheme = typeof CustomLightTheme | typeof CustomDarkTheme

const useAppTheme = () => useTheme<AppTheme>()
export default useAppTheme
