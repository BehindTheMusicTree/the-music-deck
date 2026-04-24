import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { colors, fonts, fs } from '@/lib/tokens';

const NAV = [
  { screen: '',            label: 'Home',       icon: '🏠' },
  { screen: 'collection',  label: 'Collection',  icon: '🎴' },
  { screen: 'tracklist', label: 'Track list',   icon: '⚔️' },
  { screen: 'battle',      label: 'Battle',      icon: '🎯' },
  { screen: 'market',      label: 'Market',      icon: '🛒' },
  { screen: 'digcrate',   label: 'Crate Dig',   icon: '🎲' },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.nav, { paddingBottom: insets.bottom }]}>
      {NAV.map(({ screen, label, icon }) => {
        const href = screen ? `/${screen}` : '/';
        const isHome = href === '/';
        const active =
          pathname === href
          || (isHome && (pathname === '/index' || pathname === '/pack'));
        return (
          <Pressable
            key={screen}
            style={[styles.item, active ? styles.itemActive : styles.itemInactive]}
            onPress={() => router.push(href as any)}
          >
            <Text style={[styles.icon, active && styles.activeColor]}>{icon}</Text>
            <Text style={[styles.label, active && styles.activeColor]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    backgroundColor: 'rgba(9,8,13,0.98)',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    zIndex: 200,
    minHeight: colors.navH,
    flexShrink: 0,
  },
  item: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  itemInactive: { opacity: 0.4 },
  itemActive: { opacity: 1 },
  icon: {
    fontSize: fs(19),
    lineHeight: fs(22),
    color: colors.white,
  },
  label: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(7),
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.white,
  },
  activeColor: {
    color: colors.gold,
  },
});
