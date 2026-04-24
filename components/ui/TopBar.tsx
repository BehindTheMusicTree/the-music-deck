import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '@/lib/game-state';
import { colors, fonts, fs } from '@/lib/tokens';

export default function TopBar() {
  const { state } = useGame();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.topBar, { paddingTop: insets.top }]}>
      <View style={styles.inner}>
        <Text style={styles.logo}>
          <Text style={styles.logoThe}>THE </Text>
          MUSIC TRACK LIST
        </Text>
        <View style={styles.right}>
          <Text style={styles.level}>Lv. 7 · Collector</Text>
          <Text style={styles.coins}>⬡ {state.coins}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: 'rgba(9,8,13,0.97)',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 200,
  },
  inner: {
    height: colors.topH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  logo: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(9),
    letterSpacing: 2,
    color: colors.gold,
  },
  logoThe: {
    color: colors.muted,
    fontFamily: fonts.cinzel,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  level: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(10),
    color: colors.muted,
  },
  coins: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(11),
    color: colors.gold,
  },
});
