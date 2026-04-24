import { Redirect, useLocalSearchParams } from "expo-router";
import CollectionGenreScreen from "@/components/screens/CollectionGenreScreen";
import { parseCollectionHubGenre } from "@/lib/data/collection-hub";

export default function CollectionByGenreRoute() {
  const { genre } = useLocalSearchParams<{ genre: string }>();
  const g = parseCollectionHubGenre(genre);
  if (!g) return <Redirect href="/collection" />;
  return <CollectionGenreScreen genre={g} />;
}
