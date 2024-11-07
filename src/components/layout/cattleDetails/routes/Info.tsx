import { cattleDetails } from '@/styles/main';
import React from 'react';
import { ScrollView } from 'react-native';
import { CattleInfoDetails } from '../Components/CattleInfoDetails';
import { useAppSelector } from '@/hooks/useRedux';

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


