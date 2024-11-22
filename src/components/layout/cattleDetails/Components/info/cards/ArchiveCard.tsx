import CattleArchive from '@/database/models/CattleArchive'
import useAppTheme from '@/theme'
import { withObservables } from '@nozbe/watermelondb/react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { memo, useMemo } from 'react'
import { View } from 'react-native'
import { Avatar, Card, Divider, Text } from 'react-native-paper'

const observeArchive = withObservables(['archive'], ({ archive }: { archive: CattleArchive }) => ({
  archive
}))

const ArchiveCard = observeArchive(({ archive }: { archive: CattleArchive }) => {
  const theme = useAppTheme()
  const archiveDate = useMemo(() => {
    return format(archive.archivedAt, 'PPPP', { locale: es })
  }, [archive.archivedAt])

  return (
    <Card mode='outlined'>
      <Card.Content>
        <View style={{ alignItems: 'center', gap: 12 }}>
          <Avatar.Icon
            size={52}
            icon='archive-outline'
            color={theme.colors.inverseOnSurface}
          />
          <Text variant='titleLarge'>Ganado archivado</Text>
        </View>
        <Divider
          horizontalInset
          style={{ marginVertical: 16 }}
        />
        <View style={{ gap: 12 }}>
          <View>
            <Text variant='labelMedium'>Motivo</Text>
            <Text variant='bodyLarge'>{archive.reason}</Text>
          </View>
          <View>
            <Text variant='labelMedium'>Fecha</Text>
            <Text variant='bodyLarge'>{archiveDate.charAt(0).toUpperCase() + archiveDate.slice(1)}</Text>
          </View>
          {archive.notes && (
            <View>
              <Text variant='labelMedium'>Notas</Text>
              <Text variant='bodyLarge'>{archive.notes}</Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  )
})

export default memo(ArchiveCard)
