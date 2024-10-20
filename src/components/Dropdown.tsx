import { cloneElement, memo, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, Keyboard, ListRenderItem, Pressable, View } from 'react-native'
import { HelperText, Menu, TextInput, TextInputProps, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type DropdownGlobalProps = {
  value?: string // To show the value, it needs to be implemented like a text input.
  label?: string
  disabled?: boolean
  editable?: boolean
  error?: string
  textInputProps?: TextInputProps
}

type DropdownAnchorProps = {
  menuVisible: boolean
  setMenuVisible: (bool: boolean) => void
  setWidth: (n: number) => void
}

type DropdownMenuProps<T> = {
  options: T[]
  renderOption: ListRenderItem<T>
}

const Anchor = memo((props: DropdownGlobalProps & DropdownAnchorProps) => {
  const theme = useTheme()
  const [text, setText] = useState<string | undefined>()

  useEffect(() => setText(props.value), [props.value])

  const outlineStyle = useMemo(() => {
    if (props.disabled) return

    let borderColor = theme.colors.outline

    if (props.error !== undefined) {
      borderColor = theme.colors.error
    } else if (props.menuVisible) {
      borderColor = theme.colors.primary
    }

    return {
      borderColor: borderColor,
      borderWidth: props.menuVisible || props.error !== undefined ? 2 : 1
    }
  }, [props.menuVisible, props.disabled, props.error])

  const textInputIconColor = useMemo(() => {
    if (props.disabled) return

    return {
      colors: { onSurfaceDisabled: props.error === undefined ? theme.colors.onSurface : theme.colors.error }
    }
  }, [props.disabled, props.error])

  return (
    <Pressable
      onPress={() => {
        if (props.disabled) return

        Keyboard.dismiss()
        props.setMenuVisible(true)
      }}
      onLayout={(e) => props.setWidth(e.nativeEvent.layout.width)}
    >
      <TextInput
        outlineStyle={outlineStyle}
        label={props.label}
        value={text}
        error={props.error !== undefined}
        disabled={props.disabled}
        editable={props.editable ?? false}
        mode='outlined'
        onChangeText={(text) => setText(text)}
        right={
          <TextInput.Icon
            theme={textInputIconColor}
            disabled
            icon={props.menuVisible ? 'menu-up' : 'menu-down'}
          />
        }
        {...props.textInputProps}
      />
    </Pressable>
  )
})

const PADDING = 16

const Dropdown = <T,>(props: DropdownGlobalProps & DropdownMenuProps<T>) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const select = useRef(-1) // To highlight the selected option. Not to show the value.
  const [width, setWidth] = useState(0) // To resize the menu dropdown and match anchor width.
  const [menuVisible, setMenuVisible] = useState(false)

  useEffect(() => {
    setMenuVisible(false)
  }, [props.disabled])

  return (
    <View>
      <Menu
        contentStyle={{ minWidth: width }}
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchorPosition='bottom'
        statusBarHeight={insets.top}
        anchor={
          <Anchor
            error={props.error}
            value={props.value}
            label={props.label}
            disabled={props.disabled}
            editable={props.editable}
            textInputProps={props.textInputProps}
            menuVisible={menuVisible}
            setMenuVisible={setMenuVisible}
            setWidth={setWidth}
          />
        }
      >
        <FlatList
          scrollEnabled={false}
          data={props.options}
          renderItem={({ item, index, separators }) => {
            const option = props.renderOption({ item, index, separators })

            if (!option) return option

            let backgroundColor =
              select.current === index ? theme.colors.secondaryContainer : theme.colors.elevation.level2

            // Not the most performant approach.
            const element = cloneElement(option, {
              style: {
                minWidth: width,
                backgroundColor: backgroundColor
              },
              contentStyle: { minWidth: width - PADDING * 2 },
              onPress: () => {
                select.current = index

                if (option.props.onPress) option.props.onPress()

                setMenuVisible(false)
              }
            })

            return element
          }}
        />
      </Menu>
      {props.error !== undefined && <HelperText type='error'>{props.error}</HelperText>}
    </View>
  )
}

export default Dropdown
