import merge from 'deepmerge'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'
import { Pressable, View } from 'react-native'
import { HelperText, Menu, ThemeProvider, useTheme } from 'react-native-paper'
import { Dropdown, DropdownProps } from 'react-native-paper-dropdown'
import { MD3Theme } from 'react-native-paper/lib/typescript/types'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export type DropdownOption<T> = { label: T; value: T }
type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> }

const RenderController = (
  props: DropdownProps & {
    onChange: (...event: any[]) => void
    controllerValue: any
    theme?: DeepPartial<MD3Theme>
  }
) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <ThemeProvider theme={merge(theme, props.theme || {})}>
      <Dropdown
        mode='outlined'
        value={props.controllerValue}
        hideMenuHeader
        statusBarHeight={insets.top}
        Touchable={Pressable}
        CustomDropdownItem={(itemProps) => (
          <Menu.Item
            title={itemProps.option.label}
            onPress={() => {
              itemProps.toggleMenu()

              if (itemProps.onSelect) itemProps.onSelect(itemProps.option.value)

              props.onChange(itemProps.option.value)
            }}
            style={{
              minWidth: itemProps.width,
              backgroundColor:
                itemProps.value === itemProps.option.value
                  ? theme.colors.secondaryContainer
                  : theme.colors.elevation.level2
            }}
          />
        )}
        menuContentStyle={{
          top: 56,
          paddingVertical: 8,
          backgroundColor: theme.colors.elevation.level2
        }}
        {...props}
      />
    </ThemeProvider>
  )
}

const MDropdown = <T extends FieldValues>(
  props: DropdownProps & {
    name: FieldPath<T>
    control?: Control<T>
    errroMessage?: string
    theme?: DeepPartial<MD3Theme>
  }
) => {
  return (
    <View>
      <Controller
        name={props.name}
        control={props.control}
        render={({ field: { onChange, value } }) => (
          <RenderController
            onChange={onChange}
            controllerValue={value}
            {...props}
          />
        )}
      />
      {props.error && props.errroMessage && <HelperText type='error'>{props.errroMessage}</HelperText>}
    </View>
  )
}

export default MDropdown
