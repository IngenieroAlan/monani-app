import Cattle from "@/database/models/Cattle";
import { TableName } from "@/database/schema";
import { useAppSelector } from '@/hooks/useRedux';
import { cattleDetails } from '@/styles/main';
import { withObservables } from "@nozbe/watermelondb/react";
import { format } from 'date-fns';
import { es } from "date-fns/locale";
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Divider, Text } from "react-native-paper";

export const InfoRoute = () => {
  const { cattleInfo } = useAppSelector(state => state.cattles);
  return (
    <ScrollView style={cattleDetails.container}>
      {
        cattleInfo && (<CattleInfoDetails cattle={cattleInfo} />)
      }
    </ScrollView>
  );
}


const observeCattle = withObservables([TableName.CATTLE], ({ cattle }: { cattle: Cattle }) => ({
  cattle
}));

const CattleInfoDetails = observeCattle(({ cattle }: { cattle: Cattle }) => {
  return (
    <View style={cattleDetails.cardsContainer}>
      <Card style={cattleDetails.card}>
        <Card.Title title="Cuarentena" />
        <Divider style={{ width: "85%", alignSelf: "center" }} />
        <Card.Content style={{ marginTop: 10 }}>
          <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Tiempo restante</Text>
          <Text variant="titleSmall">27 días</Text>
        </Card.Content>
      </Card>
      <Card style={cattleDetails.card}>
        <Card.Title title="Datos generales" />
        <Divider style={{ width: "85%", alignSelf: "center" }} />
        <Card.Content style={{ marginTop: 10, gap: 8 }}>
          <View>
            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Nombre</Text>
            <Text variant="titleSmall">{cattle.name}</Text>
          </View>
          <View>
            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>No. identificador</Text>
            <Text variant="titleSmall">{cattle.tagId}</Text>
          </View>
          <View>
            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>No. de vaca</Text>
            <Text variant="titleSmall">{cattle.tagCattleNumber}</Text>
          </View>
          <View>
            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Fecha de ingreso</Text>
            <Text variant="titleSmall">Viernes 20 de septiembre de 2024</Text>
          </View>
        </Card.Content>
      </Card>
      <Card style={cattleDetails.card}>
        <Card.Title title="Datos biológicos" />
        <Divider style={{ width: "85%", alignSelf: "center" }} />
        <Card.Content style={{ marginTop: 10, gap: 8 }}>
          <View>
            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Peso</Text>
            <Text variant="titleSmall">{cattle.weight} kg</Text>
          </View>
          <View>
            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Edad</Text>
            {/* 3 años, 5 meses, 10 dias */}
            <Text variant="titleSmall"> {format(cattle.bornAt, "yyyyy,mmmm,dddd", { locale: es })}</Text>
          </View>
          <View>
            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Fecha de nacimiento</Text>
            {/* Viernes 03 de septiembre de 2021 */}
            <Text variant="titleSmall"> {format(cattle.bornAt, "dddd de mmm de yyyy", { locale: es })}</Text>
          </View>
        </Card.Content>
      </Card>
      <Card style={cattleDetails.card}>
        <Card.Title title="Estado productivo" />
        <Divider style={{ width: "85%", alignSelf: "center" }} />
        <Card.Content style={{ marginTop: 10, gap: 8 }}>
          <View>
            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Producción</Text>
            <Text variant="titleSmall">Lechera</Text>
          </View>
          <View>
            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Estado</Text>
            <Text variant="titleSmall">Gestante</Text>
          </View>
        </Card.Content>
      </Card>
      <Card style={cattleDetails.card}>
        <Card.Title title="Gestación" />
        <Divider style={{ width: "85%", alignSelf: "center" }} />
        <Card.Content style={{ marginTop: 10, gap: 8 }}>
          <View>
            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Edad gestacional</Text>
            <Text variant="titleSmall">7 meses, 3 días</Text>
          </View>
          <View>
            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Inicio de gestación</Text>
            <Text variant="titleSmall">Sabado 10 de marzo de 2024</Text>
          </View>
          <View>
            <Text variant='titleSmall' style={{ fontWeight: "bold" }}>Día de parto</Text>
            <Text variant="titleSmall">Martes 10 de diciembre de 2024</Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  )
})
