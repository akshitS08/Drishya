import { Client, Databases, ID, Query } from "react-native-appwrite";

// track the searches made by the user

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const METRICS_ID = process.env.EXPO_PUBLIC_APPWRITE_METRICS_ID!;

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
