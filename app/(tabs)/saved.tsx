import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { getSavedMovies, removeSavedMovie } from "@/services/appwrite";

import { Link } from "expo-router";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Saved = () => {
  const [savedMovies, setSavedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadSavedMovies = async () => {
      try {
        setError(null);

        const movies = await getSavedMovies();
        setSavedMovies(movies ?? []);
      } catch (error) {
        console.log("Error fetching saved movies:", error);
        setError("Unable to load saved movies.");
      } finally {
        setLoading(false);
      }
    };

    loadSavedMovies();
  }, []);

  const handleRemoveMovie = async (movieId: number) => {
    try {
      await removeSavedMovie(movieId);

      setSavedMovies((currentMovies) =>
        currentMovies.filter((movie) => movie.movie_id !== movieId),
      );
    } catch (error) {
      console.log("Error removing saved movie:", error);
    }
  };

  const refreshSavedMovies = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const movies = await getSavedMovies();
      setSavedMovies(movies ?? []);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View className="flex-1 bg-primary">
      {/* Background */}
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
      />

      <View className="flex-1 px-5">
        {/* Logo */}
        <Image source={icons.logo} className="w-44 h-24 mt-20 mb-3 mx-auto" />

        {/* Heading */}
        <View className="items-center mt-5 mb-5">
          <Text className="text-2xl text-white font-bold mt-2">
            Saved Movies
          </Text>

          <Text className="text-gray-400 text-sm mt-2">
            Your favorite movies in one place
          </Text>
        </View>

        {/* Loading */}
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#ffffff" />

            <Text className="text-gray-400 text-sm mt-4">
              Loading saved movies...
            </Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center">
            <Image
              source={icons.save}
              className="size-10 mb-4"
              tintColor="#ffffff"
            />

            <Text className="text-red-400 text-base text-center">{error}</Text>
          </View>
        ) : savedMovies.length === 0 ? (
          /* Empty */
          <View className="flex-1 justify-center items-center">
            <Image
              source={icons.save}
              className="size-12 mb-5"
              tintColor="#ffffff"
            />

            <Text className="text-white text-lg font-semibold">
              No Saved Movies
            </Text>

            <Text className="text-gray-500 text-sm mt-2 text-center">
              Movies you save will appear here.
            </Text>
          </View>
        ) : (
          /* Saved Movies */
          <FlatList
            data={savedMovies}
            numColumns={3}
            refreshing={refreshing}
            onRefresh={refreshSavedMovies}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.$id}
            contentContainerStyle={{
              paddingBottom: 120,
            }}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              gap: 20,
              marginBottom: 15,
            }}
            renderItem={({ item }) => (
              <View className="w-[30%]">
                {/* Poster + Movie Details */}
                <View className="relative">
                  <Link href={`/movies/${item.movie_id}`} asChild>
                    <TouchableOpacity>
                      <Image
                        source={{
                          uri: item.poster_url,
                        }}
                        className="w-full h-44 rounded-lg"
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  </Link>

                  {/* Remove from Saved */}
                  <TouchableOpacity
                    onPress={() => handleRemoveMovie(item.movie_id)}
                    className="absolute bottom-2 right-2 bg-black/60 rounded-full p-2"
                  >
                    <Image
                      source={icons.saved_filled}
                      className="size-5"
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>

                {/* Movie title */}
                <Text
                  className="text-white text-sm font-semibold mt-2"
                  numberOfLines={2}
                >
                  {item.title}
                </Text>

                {/* Release year */}
                <Text className="text-gray-500 text-xs mt-1">
                  {item.release_date?.split("-")[0] || "N/A"}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default Saved;
