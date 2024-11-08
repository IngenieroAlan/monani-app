import { useAppSelector } from '@/hooks/useRedux';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Appbar, FAB, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BOTTOM_APPBAR_HEIGHT = 60;
const MEDIUM_FAB_HEIGHT = 46;

const Footer = () => {
  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();
  const { screen } = useAppSelector(state => state.ui);
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: screen === 'DietRoute' ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [screen]);

  const FABICON = useMemo(() => {
    if (screen === 'InfoRoute' || screen === 'GenealogyRoute') {
      return 'pencil';
    } else return 'plus';
  }, [screen]);

  const navigateTo = () => {
    switch (screen) {
      case 'InfoRoute':
        console.log('Navigate to edit');
        break;
      case 'DietRoute':
        console.log('Navigate to add');
        break;
      case 'MedicationRoute':
        console.log('Navigate to add');
        break;
      case 'WeightRoute':
        console.log('Navigate to add');
        break;
      case 'MilkyRoute':
        console.log('Navigate to add');
        break;
      case 'GenealogyRoute':
        navigation.navigate('SearchOffspringView');
        break;
      default:
        console.log('Navigate to');
        break;
    }
  }

  return (
    <Appbar
      style={[
        styles.bottom,
        {
          height: BOTTOM_APPBAR_HEIGHT + bottom,
          backgroundColor: theme.colors.elevation.level2,
        },
      ]}
      safeAreaInsets={{ bottom }}
    >
      <Appbar.Action icon="trash-can-outline" onPress={() => { }} />
      <Appbar.Action icon="package-down" onPress={() => { }} />
      <Appbar.Action icon="tag-outline" onPress={() => { }} />

      <Animated.View style={{ opacity: fadeAnim }}>
        <Appbar.Action
          icon="cog-outline"
          onPress={() => {
            screen === 'DietRoute' && console.log('Navigate to settings');
          }} />
      </Animated.View>

      <FAB
        mode="flat"
        icon={FABICON}
        customSize={MEDIUM_FAB_HEIGHT}
        onPress={navigateTo}
        style={[
          styles.fab,
          { top: (BOTTOM_APPBAR_HEIGHT - MEDIUM_FAB_HEIGHT) / 2 },
        ]}
      />
    </Appbar>
  );
};

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  fab: {
    position: 'absolute',
    right: 16,
  },
});

export default Footer;