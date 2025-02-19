import useFeeds from '@/hooks/collections/useFeeds'
import { DietFeedFields } from '@/validationSchemas/DietFeedSchema'
import { useMemo } from 'react'
import { Control, FormState, useController } from 'react-hook-form'
import { Text, useTheme } from 'react-native-paper'
import { CustomTextInput } from '../CustomTextInput'
import MDropdown from '../MDropdown'
import MSearchBar, { SearchBarDataItem } from '../MSearchBar'
import { SurfaceContainer } from '../SurfaceContainer'

const DietFeedForm = ({
  control,
  formState,
  feedName,
  cattleWeight
}: {
  control: Control<DietFeedFields>
  formState: FormState<DietFeedFields>
  feedName?: string
  cattleWeight: number
}) => {
  const theme = useTheme()
  const { errors } = formState
  const { field: feedProportion } = useController({ name: 'feedProportion', control })
  const { field: quantity } = useController({ name: 'quantity', control })

  const formattedWeight = useMemo(() => {
    const equivalentWeight = cattleWeight * ((quantity.value ?? 0) / 100)
    const decimals = equivalentWeight.toString().split('.')[2]
    return `${Math.trunc(equivalentWeight)}.${decimals ? decimals.padEnd(3, '0') : '000'}`
  }, [quantity.value])

  const { feedsRecords } = useFeeds()

  const dropdownOptions = [
    {
      label: 'Por porcentaje',
      value: 'Por porcentaje'
    },
    {
      label: 'Fija',
      value: 'Fija'
    }
  ]

  const feedData: SearchBarDataItem[] = useMemo(
    () =>
      feedsRecords.map((feed) => ({
        id: feed.id,
        title: feed.name,
        description: feed.feedType,
        value: feed.id
      })),
    [feedsRecords]
  )

  return (
    <SurfaceContainer style={{ padding: 16, gap: 10 }}>
      <MSearchBar
        name='feed'
        control={control}
        placeholder='Alimento'
        initialQuery={feedName}
        mode='bar'
        theme={{ roundness: 1 }}
        data={feedData}
        erroMessage={errors.feed?.message ? String(errors.feed.message) : ''}
        maxHeight={500}
      />
      <MDropdown
        name='feedProportion'
        control={control}
        label='Proporción*'
        options={dropdownOptions}
        error={errors.feedProportion !== undefined}
        errroMessage={errors.feedProportion?.message}
        theme={{
          colors: { background: theme.colors.elevation.level1 }
        }}
      />

      <CustomTextInput
        name='quantity'
        control={control}
        label='Cantidad*'
        errors={errors.quantity}
        helperText={errors.quantity?.message ? errors.quantity?.message : ''}
        more={{
          theme: { colors: { background: theme.colors.elevation.level1 } },
          keyboardType: 'numeric',
          value: quantity.value ? String(quantity.value) : '',
          onChangeText: (value: string) => quantity.onChange(parseFloat(value))
        }}
      />
      <Text variant='labelSmall'>
        {feedProportion.value === 'Por porcentaje' ? `Equivalente a ${formattedWeight} kg.` : ''}
      </Text>
    </SurfaceContainer>
  )
}

export default DietFeedForm
