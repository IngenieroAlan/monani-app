import merge from 'deepmerge'
import { MD3DarkTheme, MD3LightTheme, useTheme } from 'react-native-paper'

const LightThemeColors = {
  colors: {
    primary: 'rgb(63, 105, 0)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(178, 246, 95)',
    onPrimaryContainer: 'rgb(16, 32, 0)',
    secondary: 'rgb(67, 105, 21)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(195, 241, 141)',
    onSecondaryContainer: 'rgb(15, 32, 0)',
    tertiary: 'rgb(0, 106, 102)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(112, 247, 239)',
    onTertiaryContainer: 'rgb(0, 32, 30)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(253, 252, 245)',
    onBackground: 'rgb(27, 28, 24)',
    surface: 'rgb(253, 252, 245)',
    onSurface: 'rgb(27, 28, 24)',
    surfaceVariant: 'rgb(225, 228, 213)',
    onSurfaceVariant: 'rgb(68, 72, 61)',
    outline: 'rgb(117, 121, 108)',
    outlineVariant: 'rgb(197, 200, 186)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(48, 49, 44)',
    inverseOnSurface: 'rgb(242, 241, 233)',
    inversePrimary: 'rgb(151, 217, 69)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(244, 245, 233)',
      level2: 'rgb(238, 240, 225)',
      level3: 'rgb(232, 236, 218)',
      level4: 'rgb(230, 234, 216)',
      level5: 'rgb(226, 231, 211)'
    },
    surfaceDisabled: 'rgba(27, 28, 24, 0.12)',
    onSurfaceDisabled: 'rgba(27, 28, 24, 0.38)',
    backdrop: 'rgba(46, 50, 40, 0.4)',

    // Extended colors.
    success: 'rgb(16, 109, 32)',
    onSuccess: 'rgb(255, 255, 255)',
    successContainer: 'rgb(157, 248, 152)',
    onSuccessContainer: 'rgb(0, 34, 4)'
  }
}

const DarkThemeColors = {
  colors: {
    primary: 'rgb(151, 217, 69)',
    onPrimary: 'rgb(31, 55, 0)',
    primaryContainer: 'rgb(47, 79, 0)',
    onPrimaryContainer: 'rgb(178, 246, 95)',
    secondary: 'rgb(167, 212, 116)',
    onSecondary: 'rgb(30, 55, 0)',
    secondaryContainer: 'rgb(46, 79, 0)',
    onSecondaryContainer: 'rgb(195, 241, 141)',
    tertiary: 'rgb(78, 218, 211)',
    onTertiary: 'rgb(0, 55, 53)',
    tertiaryContainer: 'rgb(0, 80, 76)',
    onTertiaryContainer: 'rgb(112, 247, 239)',
    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 180, 171)',
    background: 'rgb(27, 28, 24)',
    onBackground: 'rgb(227, 227, 219)',
    surface: 'rgb(27, 28, 24)',
    onSurface: 'rgb(227, 227, 219)',
    surfaceVariant: 'rgb(68, 72, 61)',
    onSurfaceVariant: 'rgb(197, 200, 186)',
    outline: 'rgb(143, 146, 133)',
    outlineVariant: 'rgb(68, 72, 61)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(227, 227, 219)',
    inverseOnSurface: 'rgb(48, 49, 44)',
    inversePrimary: 'rgb(63, 105, 0)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(33, 37, 26)',
      level2: 'rgb(37, 43, 28)',
      level3: 'rgb(41, 49, 29)',
      level4: 'rgb(42, 51, 29)',
      level5: 'rgb(44, 55, 30)'
    },
    surfaceDisabled: 'rgba(227, 227, 219, 0.12)',
    onSurfaceDisabled: 'rgba(227, 227, 219, 0.38)',
    backdrop: 'rgba(46, 50, 40, 0.4)',

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
