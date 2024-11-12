import useNumberFormat from '@/hooks/useNumberFormat'
import { StyleSheet, View } from 'react-native'
import { Card, Text } from 'react-native-paper'

type Props = {
    totalLiters: number;
    litersByYearAverage: number;
}

export const TotalMilkProducedCard = ({ totalLiters, litersByYearAverage }: Props) => {
    return (
        <Card mode='outlined'>
            <Card.Content style={{ gap: 12 }}>
                <View>
                    <Text variant='labelMedium'>Litros totales producidos</Text>
                    <Text variant='displayMedium'>{`${useNumberFormat(totalLiters.toFixed(2))} L.`}</Text>
                </View>
                <View style={styles.litersAverageContainer}>
                    <Text variant='labelSmall' style={{fontWeight:"700"}}>Litros anuales promedio</Text>
                    <Text variant='labelSmall'>{`${useNumberFormat(litersByYearAverage.toFixed(2))} L.`}</Text>
                </View>
            </Card.Content>
        </Card>
    )
}
const styles = StyleSheet.create({
    litersAverageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})