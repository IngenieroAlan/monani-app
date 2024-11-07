import { useAppSelector } from '@/hooks/useRedux';
import { CattleInfoParamsList } from '@/navigation/types';
import { useRoute } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, FAB, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BOTTOM_APPBAR_HEIGHT = 60;
const MEDIUM_FAB_HEIGHT = 46;

const Footer = () => {
  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();
  const { screen } = useAppSelector(state => state.ui);

  // const FABICON: Record<string, string> = {
  //   InfoRoute: 'pencil-outline',
  //   GenealogyRoute: 'plus',
  //   WeightRoute: 'plus',
  //   DietRoute: 'plus',
  //   MedicationRoute: 'pencil-outline',
  // };

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
      <FAB
        mode="flat"
        icon={'plus'}
        customSize={MEDIUM_FAB_HEIGHT}
        onPress={() => { }}
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