import { getIntervalDuration } from '@/utils/helpers'
import { addDays, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { memo, useMemo } from 'react'
import { View } from 'react-native'
import { Card, Divider, Text } from 'react-native-paper'

type PregnancyCard = {
  pregnantAt: Date
}

const PregnancyCard = (props: PregnancyCard) => {
  const { pregnantAtDate, pregnancyAge, birthDate } = useMemo(
    () => ({
      pregnantAtDate: format(props.pregnantAt, 'PPPP', { locale: es }),
      pregnancyAge: getIntervalDuration(props.pregnantAt, new Date()),
      birthDate: format(addDays(props.pregnantAt, 283), 'PPPP', { locale: es })
    }),
    [props.pregnantAt]
  )

  return (
    <Card mode='outlined'>
      <Card.Content>
        <Text variant='titleLarge'>Gestación</Text>
        <Divider
          horizontalInset
          style={{ marginVertical: 16 }}
        />
        <View style={{ gap: 12 }}>
          <View>
            <Text variant='labelMedium'>Edad gestacional</Text>
            <Text variant='bodyLarge'>{pregnancyAge}</Text>
          </View>
          <View>
            <Text variant='labelMedium'>Inicio de gestación</Text>
            <Text variant='bodyLarge'>{pregnantAtDate}</Text>
          </View>
          <View>
            <Text variant='labelMedium'>Posible día de parto</Text>
            <Text variant='bodyLarge'>{birthDate}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  )
}

export default memo(PregnancyCard)
