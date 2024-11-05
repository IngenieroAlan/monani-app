import database from '@/database';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { getCattles, setCattleInfo } from '@/redux/slices/cattles';
import { colors } from '@/utils/colors';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Appbar, Icon } from 'react-native-paper';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { DietRoute } from './routes/Diet';
import { GenealogyRoute } from './routes/Genealogy';
import { InfoRoute } from "./routes/Info";

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
    genealogy: GenealogyRoute,
});

const iconSize = 20;
//NativeStackScreenProps<RootStackParamList, 'CattleDetailsLayout'>

export const Cattle = () => {
    const layout = useWindowDimensions();
    const navigator = useNavigation();
    const { selectedCattle, cattles, cattleInfo } = useAppSelector(state => state.cattles);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getCattles(database))
        const res = cattles.find(cow => cow.id === selectedCattle);
        dispatch(setCattleInfo(res))
    }, [dispatch])


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
            <Appbar.Content title={`No. ${cattleInfo?.tagId}`} />
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
