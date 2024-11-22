import CattleArchive from '@/database/models/CattleArchive'
import useNumberFormat from '@/hooks/useNumberFormat'
import { getIntervalDuration } from '@/utils/helpers'
import { withObservables } from '@nozbe/watermelondb/react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { memo, useMemo } from 'react'
import { View } from 'react-native'
import { Card, Divider, Text } from 'react-native-paper'
import { of } from 'rxjs'

type AgeDisplayProps = {
  archive?: CattleArchive
  bornAt: Date
}

type BiologicalInfoCardProps = {
  weight: number
  bornAt: Date
  archive?: CattleArchive
}

const observeArchive = withObservables(['archive'], ({ archive }: { archive?: CattleArchive }) => ({
  archive: archive || of(undefined)
}))

const AgeDisplay = observeArchive((props: AgeDisplayProps) => {
  const age = useMemo(() => {
    return getIntervalDuration(props.bornAt, props.archive?.archivedAt ?? new Date())
  }, [props.bornAt, props.archive?.archivedAt])

  return (
    <View>
      <Text variant='labelMedium'>Edad</Text>
      <Text variant='bodyLarge'>{age}</Text>
    </View>
  )
})

const BiologicalInfoCard = (props: BiologicalInfoCardProps) => {
  const bornDate = useMemo(() => {
    return format(props.bornAt, 'PPPP', { locale: es })
  }, [props.bornAt])

  return (
    <Card mode='outlined'>
      <Card.Content>
        <Text variant='titleLarge'>Datos biológicos</Text>
        <Divider
          horizontalInset
          style={{ marginVertical: 16 }}
        />
        <View style={{ gap: 12 }}>
          <View>
            <Text variant='labelMedium'>Peso</Text>
            <Text variant='bodyLarge'>{useNumberFormat(props.weight.toFixed(3))} kg.</Text>
          </View>
          <AgeDisplay
            bornAt={props.bornAt}
            archive={props.archive}
          />
          <View>
            <Text variant='labelMedium'>Fecha de nacimiento</Text>
            <Text variant='bodyLarge'>{bornDate.charAt(0).toUpperCase() + bornDate.slice(1)}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  )
}

export default memo(BiologicalInfoCard)
