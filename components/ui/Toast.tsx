import { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { useGame } from '@/lib/game-state';
import { colors, fonts, fs } from '@/lib/tokens';

export default function Toast() {
  const { state } = useGame();
  const { toast } = state;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast) {
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    } else {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  }, [toast, opacity]);

  const borderColor = toast?.type === 'ok'
    ? 'rgba(168,124,40,.5)'
    : toast?.type === 'err'
      ? 'rgba(180,40,40,.5)'
      : colors.border;
  const textColor = toast?.type === 'ok'
    ? colors.gold
    : toast?.type === 'err'
      ? '#e05050'
      : colors.white;

  return (
    <Animated.View style={[styles.toast, { opacity, borderColor }]} pointerEvents="none">
      <Text style={[styles.text, { color: textColor }]}>{toast?.msg}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: colors.navH + 14,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 24,
    zIndex: 400,
  },
  text: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(10),
    letterSpacing: 1,
  },
});
