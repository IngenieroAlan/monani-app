import useAppTheme from '@/theme'
import { differenceInDays, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useMemo } from 'react'
import { View } from 'react-native'
import { Avatar, Card, Divider, Text } from 'react-native-paper'

const QuarantineCard = ({ quarantineEndsAt }: { quarantineEndsAt: Date }) => {
  const theme = useAppTheme()

  const endDate = useMemo(() => {
    return format(quarantineEndsAt, 'PPPP', { locale: es })
  }, [quarantineEndsAt])

  const remainingDays = useMemo(() => {
    return differenceInDays(quarantineEndsAt, new Date())
  }, [quarantineEndsAt])

  return (
    <Card mode='outlined'>
      <Card.Content>
        <View style={{ alignItems: 'center', gap: 12 }}>
          <Avatar.Icon
            size={52}
            icon='minus-circle-outline'
            color={theme.colors.inverseOnSurface}
          />
          <Text variant='titleLarge'>Ganado en cuarentena</Text>
        </View>
        <Divider
          horizontalInset
          style={{ marginVertical: 16 }}
        />
        <View style={{ gap: 12 }}>
          <View>
            <Text variant='labelMedium'>Días restantes</Text>
            <Text variant='bodyLarge'>{remainingDays} días</Text>
          </View>
          <View>
            <Text variant='labelMedium'>Fecha de finalización</Text>
            <Text variant='bodyLarge'>{endDate.charAt(0).toUpperCase() + endDate.slice(1)}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  )
}

export default QuarantineCard
