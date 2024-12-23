import useAppTheme from '@/theme'
import { View, ViewProps } from 'react-native'

export const SurfaceContainer = ({ children, style, ...rest }: ViewProps) => {
  const theme = useAppTheme()

  return (
    <View
      {...rest}
      style={[style, { flex: 1, backgroundColor: theme.colors.surface }]}
    >
      {children}
    </View>
  )
}
