import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { memo, useMemo } from 'react'
import { View } from 'react-native'
import { Card, Divider, Text } from 'react-native-paper'

type GeneralInfoCardProps = {
  name?: string
  tagId: string
  tagCattleNumber: string
  admittedAt: Date
}

const GeneralInfoCard = (props: GeneralInfoCardProps) => {
  const admittedAtDate = useMemo(() => {
    return format(props.admittedAt, 'PPPP', { locale: es })
  }, [props.admittedAt])

  return (
    <Card mode='outlined'>
      <Card.Content>
        <Text variant='titleLarge'>Datos generales</Text>
        <Divider
          horizontalInset
          style={{ marginVertical: 16 }}
        />
        <View style={{ gap: 12 }}>
          {props.name && (
            <View>
              <Text variant='labelMedium'>Nomber</Text>
              <Text variant='bodyLarge'>{props.name}</Text>
            </View>
          )}
          <View>
            <Text variant='labelMedium'>No. identificador</Text>
            <Text variant='bodyLarge'>{props.tagId}</Text>
          </View>
          <View>
            <Text variant='labelMedium'>No. de vaca</Text>
            <Text variant='bodyLarge'>{props.tagCattleNumber}</Text>
          </View>
          <View>
            <Text variant='labelMedium'>Fecha de ingreso</Text>
            <Text variant='bodyLarge'>
              {admittedAtDate.charAt(0).toUpperCase() + admittedAtDate.slice(1)}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  )
}

export default memo(GeneralInfoCard)
