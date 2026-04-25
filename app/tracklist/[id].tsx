import { Redirect, useLocalSearchParams } from "expo-router";
import { useGame } from "@/lib/game-state";
import TrackListBuilderScreen from "@/components/screens/TrackListBuilderScreen";

export default function TrackListDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const { state } = useGame();
  const sid = Array.isArray(id) ? id[0] : id;
  if (!sid || !state.decks.some((d) => d.id === sid)) {
    return <Redirect href="/tracklist" />;
  }
  return <TrackListBuilderScreen deckId={sid} />;
}
