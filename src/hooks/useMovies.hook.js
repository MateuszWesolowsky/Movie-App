import { useEffect, useState } from "react";

const KEY = "8266c2c";

export const useMovies = (query) => {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const controller = new AbortController();
		const fetchMovies = async () => {
			try {
				setIsLoading(true);
				setError("");
				const res = await fetch(
					`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
					{ signal: controller.signal }
				);
				const data = await res.json();

				if (!res.ok)
					throw new Error("Something went wrong with fetching movies");

				if (data.Response === "False") throw new Error("Movie not found!");
				setMovies(data.Search);
				setError("");
			} catch (err) {
				if (err.name !== "AbortError") {
					setError(err.message);
				}
			} finally {
				setIsLoading(false);
			}
		};

		if (query.length < 3) {
			setMovies([]);
			setError("");
			return;
		}

		// handleCloseMovie();
		fetchMovies();

		return () => {
			controller.abort();
		};
	}, [query]);

	return {
		movies,
		isLoading,
		error,
	};
};
