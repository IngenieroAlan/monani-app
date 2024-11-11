import database from '@/database'
import Cattle from '@/database/models/Cattle'
import Medication from '@/database/models/Medication'
import { NotificationType } from '@/database/models/Notification'
import { TableName } from '@/database/schema'
import { createTriggerNotification } from '@/notifee/constructors'
import { faker } from '@faker-js/faker/.'
import notifee from '@notifee/react-native'
import { addSeconds } from 'date-fns'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Button, Divider, Icon, List, Text, TextInput } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const types: NotificationType[] = ['birth', 'medication', 'quarantine']

const createRandomNotification = async (seconds: number) => {
  const cattle = await database.get<Cattle>(TableName.CATTLE).query().fetch()
  const medications = await database.get<Medication>(TableName.MEDICATIONS).query().fetch()

  const timestamp = addSeconds(new Date(), seconds).getTime()
  const type = faker.helpers.arrayElement(types)
  const cattleRecord = faker.helpers.arrayElement(await cattle)

  await createTriggerNotification({
    title: faker.lorem.sentence(),
    subtitle: faker.lorem.word(),
    body: faker.lorem.sentences(),
    data: {
      cattleId: cattleRecord.id,
      extraInfo: JSON.stringify(
        type === 'medication'
          ? [faker.helpers.arrayElement(await medications).name, cattleRecord.tagId]
          : [cattleRecord.tagId]
      ),
      timestamp,
      type
    },
    triggerTimestamp: timestamp
  })
}

const Permissions = () => {
  return (
    <View>
      <Text
        variant='titleMedium'
        style={{ paddingHorizontal: 16 }}
      >
        Permisos
      </Text>
      <List.Item
        title='Permitir notificaciones'
        description='Permite que la aplicación envíe notificaciones al dispositivo. Solo para Android.'
        right={() => (
          <View style={{ justifyContent: 'center' }}>
            <Icon
              size={24}
              source='open-in-new'
            />
          </View>
        )}
        onPress={async () => {
          await notifee.openNotificationSettings()
        }}
      />
      <Divider horizontalInset />
      <List.Item
        title='Alarmas y recordatorios'
        description='Permite que la aplicación programe evento basados en tiempos exactos. No es necesario, pero puede ayudar a entregar notificaciones sin retraso. Solo para Android 12+.'
        descriptionNumberOfLines={10}
        right={() => (
          <View style={{ justifyContent: 'center', marginLeft: 16 }}>
            <Icon
              size={24}
              source='open-in-new'
            />
          </View>
        )}
        onPress={async () => {
          await notifee.openAlarmPermissionSettings()
        }}
      />
    </View>
  )
}

const NotificationTrigger = () => {
  return (
    <View style={{ gap: 12, paddingHorizontal: 16 }}>
      <Text variant='titleMedium'>Mostrar notificación</Text>
      <Button
        mode='outlined'
        onPress={async () => await createRandomNotification(1)}
      >
        Notificar ahora
      </Button>
    </View>
  )
}

const NotificationScheduler = () => {
  const [seconds, setSeconds] = useState(1)

  return (
    <View style={{ gap: 12, paddingHorizontal: 16 }}>
      <Text variant='titleMedium'>Programar notificación</Text>
      <TextInput
        label='Lanzar notificación en'
        mode='outlined'
        right={<TextInput.Affix text='segundos' />}
        keyboardType='numeric'
        onChangeText={(text) => setSeconds(+text)}
      />
      <Button
        mode='outlined'
        onPress={async () => {
          await createRandomNotification(seconds)
        }}
      >
        Programar notificación
      </Button>
    </View>
  )
}

const PlaygroundView = () => {
  const insets = useSafeAreaInsets()

  return (
    <ScrollView
      style={{ flex: 1, paddingTop: insets.top + 16 }}
      contentContainerStyle={{ gap: 16 }}
    >
      <StatusBar />
      <NotificationTrigger />
      <Divider />
      <NotificationScheduler />
      <Divider />
      <Permissions />
    </ScrollView>
  )
}

export default PlaygroundView
