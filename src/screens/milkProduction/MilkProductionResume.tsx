import React from 'react'
import { View } from 'react-native'
import { useTheme } from 'react-native-paper'
import mainStyles from '../../styles/main'
import { useMilkProductionResume } from '@/hooks/collections/useMilkProductionResume';
import { TotalMilkProducedCard } from '@/components/milkProduction/TotalMilkProducedCard';
import { FlashList } from '@shopify/flash-list';
import { AnnualMilkProducedAccordion } from '@/components/milkProduction/AnnualMilkProducedAccordion';
import { EmptyItem } from '@/components/milkProduction/EmptyItem';

export const MilkProductionResumeView = () => {
    const theme = useTheme();
    const { yearlyMilkProductionData, annualAverage, totalLiters } = useMilkProductionResume();

    return (
        <View style={{ ...mainStyles.container, display: "flex", gap: 20, backgroundColor: theme.colors.surface }}>
            <View style={{ padding: 15 }}>
                <TotalMilkProducedCard litersByYearAverage={annualAverage} totalLiters={totalLiters} />
            </View>
            <FlashList
                data={Object.values(yearlyMilkProductionData || {})}
                renderItem={({ item }) => <AnnualMilkProducedAccordion yearData={item} />}
                ListEmptyComponent={<EmptyItem />}
                estimatedItemSize={20}
            />
        </View>
    );
}
