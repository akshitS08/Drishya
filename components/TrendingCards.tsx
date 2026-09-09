import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Movie {
  movie_id: string | number;
  title: string;
  poster_url: string;
}

interface TrendingCardProps {
  movie: Movie;
  index: number;
}

const TrendingCard = ({
  movie: { movie_id, title, poster_url },
  index,
}: TrendingCardProps) => {
  const rank = index + 1;

  return (
    <Link href={`/movies/${movie_id}`} asChild>
      {/* Container: 'pl-5' gives space so the left-overflowing 3D number isn't clipped */}
      <TouchableOpacity className="w-36 pl-5 mr-3">
        {/* Poster Wrapper */}
        <View className="relative">
          {/* Main Poster Image */}
          <Image
            source={{ uri: poster_url }}
            className="w-32 h-48 rounded-xl"
            resizeMode="cover"
          />

          {/* Bottom subtle dark gradient to increase contrast behind the number base */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            className="absolute bottom-0 left-0 right-0 h-16 rounded-b-xl"
          />

          {/* 3D Number Container: Positioned outside the left edge using '-left-5' */}
          <View className="absolute -left-5 -bottom-2 z-20">
            {/* 1. Background Shadow Layer */}
            <Text
              style={styles.text3DShadow}
              className="text-6xl font-black text-indigo-950 absolute top-0.5 left-0.5"
            >
              {rank}
            </Text>

            {/* 2. Main Front Layer */}
            <Text
              style={styles.text3DFront}
              className="text-6xl font-black text-white"
            >
              {rank}
            </Text>
          </View>
        </View>

        {/* Title Section (Below Poster) */}
        <Text
          className="text-sm font-bold mt-3 text-white pl-1"
          numberOfLines={2}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  text3DFront: {
    // Sharp drop shadow giving the top text layer elevation
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  text3DShadow: {
    // Subtle blur to the background 3D extrusion
    textShadowColor: "rgba(0, 0, 0, 0.9)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 1,
  },
});

export default TrendingCard;
