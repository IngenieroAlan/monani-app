import useAppTheme from '@/theme'
import { ComponentProps, ElementType } from 'react'
import { View } from 'react-native'

type SurfaceContainerProps<T extends ElementType> = {
  Component?: T
} & ComponentProps<T>

export const SurfaceContainer = <T extends React.ElementType = typeof View>({
  Component = View,
  children,
  style,
  ...rest
}: SurfaceContainerProps<T>) => {
  const theme = useAppTheme()

  return (
    <Component
      {...rest}
      style={[style, { flex: 1, backgroundColor: theme.colors.surface }]}
    >
      {children}
    </Component>
  )
}
