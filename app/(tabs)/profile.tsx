import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import { getSavedMovies } from "@/services/appwrite";

import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

const Profile = () => {
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadSavedCount = async () => {
      try {
        const movies = await getSavedMovies();
        setSavedCount(movies?.length ?? 0);
      } catch (error) {
        console.log("Error fetching saved movie count:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedCount();
  }, []);

  const refreshSavedCount = async () => {
    try {
      setRefreshing(true);

      const movies = await getSavedMovies();
      setSavedCount(movies?.length ?? 0);
    } catch (error) {
      console.log("Error refreshing saved movie count:", error);
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshSavedCount}
            tintColor="#ffffff"
          />
        }
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        <View className="px-5">
          {/* Logo */}
          <Image source={icons.logo} className="w-44 h-24 mt-20 mb-3 mx-auto" />

          {/* Header */}
          <View className="items-center mt-5">
            <Text className="text-white text-3xl font-bold">Drishya</Text>

            <Text className="text-gray-400 text-sm mt-2">
              Your movie discovery space
            </Text>
          </View>

          {/* Stats */}
          <View className="flex-row justify-between mt-8 gap-x-4">
            <View className="flex-1 bg-dark-100 rounded-xl p-5 items-center">
              <Image
                source={icons.saved_filled}
                className="size-7 mb-3"
                resizeMode="contain"
              />

              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white text-2xl font-bold">
                  {savedCount}
                </Text>
              )}

              <Text className="text-gray-400 text-sm mt-1">Saved Movies</Text>
            </View>

            <View className="flex-1 bg-dark-100 rounded-xl p-5 items-center">
              <Image
                source={icons.star}
                className="size-7 mb-3"
                resizeMode="contain"
              />

              <Text className="text-white text-2xl font-bold">TMDB</Text>

              <Text className="text-gray-400 text-sm mt-1">Movie Data</Text>
            </View>
          </View>

          {/* About Drishya */}
          <View className="mt-8">
            <Text className="text-white text-xl font-bold mb-4">
              About Drishya
            </Text>

            <View className="bg-dark-100 rounded-xl p-5">
              <Text className="text-white text-base font-semibold mb-2">
                Discover. Save. Enjoy.
              </Text>

              <Text className="text-gray-400 text-sm leading-6">
                Drishya is a movie discovery app where you can explore movies,
                view detailed information, and save your favorite movies for
                later.
              </Text>
            </View>
          </View>

          {/* App Information */}
          <View className="mt-8">
            <Text className="text-white text-xl font-bold mb-4">
              App Information
            </Text>

            <View className="bg-dark-100 rounded-xl overflow-hidden">
              <View className="flex-row items-center p-5">
                <View className="bg-primary rounded-full p-3">
                  <Image
                    source={icons.star}
                    className="size-5"
                    resizeMode="contain"
                  />
                </View>

                <View className="ml-4">
                  <Text className="text-white text-base font-semibold">
                    Version
                  </Text>

                  <Text className="text-gray-400 text-sm mt-1">1.0.0</Text>
                </View>
              </View>

              <View className="h-[1px] bg-gray-700 mx-5" />

              <View className="flex-row items-center p-5">
                <View className="bg-primary rounded-full p-3">
                  <Image
                    source={icons.save}
                    className="size-5"
                    tintColor="#ffffff"
                    resizeMode="contain"
                  />
                </View>

                <View className="ml-4">
                  <Text className="text-white text-base font-semibold">
                    Built With
                  </Text>

                  <Text className="text-gray-400 text-sm mt-1">
                    React Native • Expo • Appwrite
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Movie Database */}
          <View className="mt-8">
            <Text className="text-white text-xl font-bold mb-4">
              Movie Database
            </Text>

            <View className="bg-dark-100 rounded-xl p-5">
              <Text className="text-white text-base font-semibold mb-2">
                Powered by TMDB
              </Text>

              <Text className="text-gray-400 text-sm leading-6">
                Movie information, ratings, posters, and other movie data are
                provided by The Movie Database (TMDB).
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View className="items-center mt-10">
            <Text className="text-gray-500 text-sm">
              Made with ❤️ for movie lovers
            </Text>

            <Text className="text-gray-600 text-xs mt-2">Drishya • 2026</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
