import { useState } from "react";
import { useMovies } from "./hooks/useMovies.hook";
import { useLocalStorageState } from "./hooks/useLocalStorageState.hook";
import { NavBar } from "./Components/NavBar";
import { ErrorMessage } from "./Components/ErrorMessage";
import { Loader } from "./Components/Loader";
import { NumResults } from "./Components/NumResults";
import { Main } from "./Components/Main";
import { Search } from "./Components/Search";
import { MovieDetails } from "./Components/MovieDetails";
import { MovieList } from "./Components/MovieList";
import { WatchedMovieList } from "./Components/WatchedMovieList";
import { Box } from "./Components/Box";
import { WatchedSummary } from "./Components/WatchedSummary";

export const average = (arr) =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
	const [query, setQuery] = useState("");
	const [selectedID, setSelectedId] = useState(null);
	const { movies, isLoading, error } = useMovies(query);

	const [watched, setWatched] = useLocalStorageState([], "watched");

	const handleSelectMovie = (id) => {
		setSelectedId((currId) => (currId === id ? null : id));
	};

	const handleCloseMovie = () => {
		setSelectedId(null);
	};

	const handleAddWatched = (movie) => {
		setWatched((watched) => [...watched, movie]);
	};

	const handleDeleteWatched = (id) => {
		setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
	};

	return (
		<>
			<NavBar>
				<Search query={query} setQuery={setQuery} />
				<NumResults movies={movies} />
			</NavBar>
			<Main>
				<Box>
					{!isLoading && !error && (
						<MovieList movies={movies} onSelectMovie={handleSelectMovie} />
					)}
					{error && <ErrorMessage message={error} />}
					{isLoading && <Loader />}
				</Box>
				<Box>
					{selectedID ? (
						<MovieDetails
							selectedID={selectedID}
							onCloseMovie={handleCloseMovie}
							onAddWatched={handleAddWatched}
							watched={watched}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedMovieList
								watched={watched}
								onDeleteWatched={handleDeleteWatched}
							/>
						</>
					)}
				</Box>
			</Main>
		</>
	);
}
