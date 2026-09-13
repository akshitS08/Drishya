import { Client, Databases, ID, Query } from "react-native-appwrite";

// track the searches made by the user

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const METRICS_ID = process.env.EXPO_PUBLIC_APPWRITE_METRICS_ID!;
const SAVED_MOVIES_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_MOVIES_ID!;

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, METRICS_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];

      await database.updateDocument(
        DATABASE_ID,
        METRICS_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        },
      );
    } else {
      await database.createDocument(DATABASE_ID, METRICS_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        title: movie.title,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }

  // check if a record of that search has already exist in the appwrite database.
  // if a document is found increment the searchCount field
  // if no document is found,
  // then create a new document in appwrite database -> count initialze with 1
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, METRICS_ID, [
      Query.orderDesc("count"),
      Query.limit(5),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const saveMovie = async (movie: {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, SAVED_MOVIES_ID, [
      Query.equal("movie_id", movie.id),
    ]);

    // Movie is not already saved
    if (result.documents.length === 0) {
      await database.createDocument(DATABASE_ID, SAVED_MOVIES_ID, ID.unique(), {
        movie_id: movie.id,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        release_date: movie.release_date,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const isMovieSaved = async (movieId: number) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, SAVED_MOVIES_ID, [
      Query.equal("movie_id", movieId),
    ]);

    return result.documents.length > 0;
  } catch (error) {
    console.log("Error checking saved movie:", error);
    throw error;
  }
};

export const getSavedMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, SAVED_MOVIES_ID, [
      Query.orderDesc("$createdAt"),
    ]);

    return result.documents;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const removeSavedMovie = async (movieId: number) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, SAVED_MOVIES_ID, [
      Query.equal("movie_id", movieId),
    ]);

    if (result.documents.length === 0) {
      return;
    }

    const savedMovie = result.documents[0];

    await database.deleteDocument(DATABASE_ID, SAVED_MOVIES_ID, savedMovie.$id);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
