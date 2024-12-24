import Cattle from "@/database/models/Cattle"
import { useAppDispatch } from "@/hooks/useRedux"
import { nestCattle } from "@/redux/slices/cattles"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { useNavigation } from "@react-navigation/native"
import { memo, useCallback, useMemo, useRef, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Button, Divider, Text, useTheme } from "react-native-paper"
import MBottomSheet from "../../../../MBottomSheet"

type BottomSheetProps = {
  cattleBottomSheet: number
  setCattleBottomSheet: (n: number) => void
  cattle: Cattle
}

const CattleDetailsBottomSheet = ({ cattleBottomSheet, setCattleBottomSheet, cattle }: BottomSheetProps) => {
  const snapPoints = useMemo(() => ["50", "25%"], []);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isPressed, setIsPressed] = useState(false)

  // Transform the date of cattle bornAt to a readable format like this 3 años, 5 meses, 10 días
  const Age = useMemo(() => {
    const bornDate = new Date(cattle.bornAt)
    const currentDate = new Date()
    const age = currentDate.getTime() - bornDate.getTime()
    const years = Math.floor(age / 31536000000)
    const months = Math.floor((age % 31536000000) / 2628000000)
    const days = Math.floor(((age % 31536000000) % 2628000000) / 86400000)
    return `${years} años, ${months} meses, ${days} días`
  }, [cattle.bornAt])

  // Transform the date to a readable format like this Jueves 14 de octubre de 2022
  const transformDate = useCallback((date: Date) => {
    const dateObject = new Date(date)
    return dateObject.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [])
  const bornDate = useMemo(() => transformDate(cattle.bornAt), [cattle.bornAt])
  const admissionDate = useMemo(() => transformDate(cattle.admittedAt), [cattle.admittedAt])


  return (
    <MBottomSheet
      ref={bottomSheetRef}
      index={cattleBottomSheet}
      snapPoints={snapPoints}
      onClose={() => setCattleBottomSheet(-1)}
    >
      <BottomSheetScrollView scrollEnabled={false}>
        <View style={{ paddingHorizontal: 16 }}>
          <Button
            mode="contained-tonal"
            style={[styles.button, { backgroundColor: theme.colors.secondaryContainer }]}
            disabled={isPressed}
            onPress={() => {
              setIsPressed(true)
              bottomSheetRef.current?.close()
              dispatch(nestCattle(cattle))
              navigation.navigate('CattleStack', {
                screen: 'CattleInfoTabsStack',
                params: { screen: 'InfoRoute' }
              })
              setIsPressed(false)
            }}>
            Ver mas
          </Button>
        </View>

        <View style={{ padding: 16 }}>
          <View
            style={[styles.infoContainer, { borderColor: theme.colors.outlineVariant }]}
          >
            <Text variant="titleLarge">Información del ganado</Text>
            <View style={{ paddingHorizontal: 16 }} ><Divider /></View>
            <View style={styles.dataView}>
              <Text variant="titleSmall">Nombre</Text>
              <Text>{cattle.name ? cattle.name : 'Sin nombre'}</Text>
            </View>
            <View style={styles.dataView}>
              <Text variant="titleSmall">No. identificador</Text>
              <Text>{cattle.tagId}</Text>
            </View>
            <View style={styles.dataView}>
              <Text variant="titleSmall">No. de vaca</Text>
              <Text>{cattle.tagCattleNumber}</Text>
            </View>
            <View style={styles.dataView}>
              <Text variant="titleSmall">Fecha de ingreso</Text>
              <Text>{admissionDate}</Text>
            </View>
            <View style={styles.dataView}>
              <Text variant="titleSmall">Peso</Text>
              <Text>{cattle.weight} kg</Text>
            </View>
            <View style={styles.dataView}>
              <Text variant="titleSmall">Edad</Text>
              <Text>{Age}</Text>
            </View>
            <View style={styles.dataView}>
              <Text variant="titleSmall">Fecha de nacimiento</Text>
              <Text>{bornDate}</Text>
            </View>
            <View style={styles.dataView}>
              <Text variant="titleSmall">Producción</Text>
              <Text>{cattle.productionType}</Text>
            </View>
            <View style={styles.dataView}>
              <Text variant="titleSmall">Estado</Text>
              <Text>{cattle.cattleStatus}</Text>
            </View>
          </View>
        </View>

      </BottomSheetScrollView>
    </MBottomSheet>
  )
}

const styles = StyleSheet.create({
  infoContainer: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  button: {
    width: 'auto',
    alignSelf: 'flex-end',
  },
  dataView: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  }
})

export default memo(CattleDetailsBottomSheet)