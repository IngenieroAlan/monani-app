import { RootStackParamList } from '@/navigation/types';
import { colors } from '@/utils/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Appbar, Icon } from 'react-native-paper';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { DietRoute } from './routes/Diet';
import { InfoRoute } from "./routes/Info";
import { useAppSelector } from '@/hooks/useRedux';
import { useNavigation } from '@react-navigation/native';

const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: '#ff4081' }} />
);

const SecondRoute = () => (
    <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
);

const renderScene = SceneMap({
    info: InfoRoute,
    diet: DietRoute,
    medication: FirstRoute,
    weight: SecondRoute,
    milkyProd: FirstRoute,
    genealogy: SecondRoute,
});

const iconSize = 20;
//NativeStackScreenProps<RootStackParamList, 'CattleDetailsLayout'>

export const Cattle = () => {
    const layout = useWindowDimensions();
    const navigator = useNavigation();
    const { selectedCattle } = useAppSelector(state => state.cattles);
    console.log(selectedCattle);
    
    const [routes] = React.useState([
        { key: 'info', title: 'Información', icon: <Icon size={iconSize} source={'file-document-outline'} /> },
        { key: 'diet', title: 'Dieta', icon: <Icon size={iconSize} source={'food-apple-outline'} /> },
        { key: 'medication', title: 'Medicación', icon: <Icon size={iconSize} source={'clipboard-text-outline'} /> },
        { key: 'weight', title: 'Pesaje', icon: <Icon size={iconSize} source={'scale'} /> },
        { key: 'milkyProd', title: 'Prod. Lechera', icon: <Icon size={iconSize} source={'beer-outline'} /> },
        { key: 'genealogy', title: 'Genealogía', icon: <Icon size={iconSize} source={'family-tree'} /> },
    ]);
    const [index, setIndex] = React.useState(0);

    return (<>
        <Appbar.Header>
            <Appbar.BackAction onPress={navigator.goBack} />
            <Appbar.Content title={`No. ${selectedCattle}`} />
        </Appbar.Header>
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width, height: layout.height }}
            renderTabBar={(props) => (
                <TabBar
                    {...props}
                    scrollEnabled
                    indicatorStyle={{ backgroundColor: colors.icons.main }}
                    style={{ backgroundColor: '#FFF' }}
                    labelStyle={{ fontSize: 12, color: "black", textTransform: 'none' }}
                    tabStyle={{ width: 'auto' }}
                    renderIcon={({ route }) => route.icon}
                />
            )}
        />
    </>);
};
