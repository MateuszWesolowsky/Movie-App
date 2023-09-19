import { useEffect, useState } from "react";
import { StarRating } from "./StarRating";
import { useKey } from "../hooks/useKey.hook";
import { Loader } from "./Loader";

export const MovieDetails = ({
	selectedID,
	onCloseMovie,
	onAddWatched,
	watched,
}) => {
	const [movie, setMovie] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [userRating, setUserRating] = useState("");

	const isWatched = watched.map((movie) => movie.imdbID).includes(selectedID);
	const watchedUserRating = watched.find(
		(movie) => movie.imdbID === selectedID
	)?.userRating;

	const {
		Title: title,
		Poster: poster,
		Year: year,
		Runtime: runtime,
		imdbRating,
		Plot: plot,
		Released: realesed,
		Actors: actors,
		Director: director,
		Genre: genre,
	} = movie;

	const handleAdd = () => {
		const newWatchedMovie = {
			imdbID: selectedID,
			title,
			year,
			poster,
			imdbRating: Number(imdbRating),
			runtime: Number(runtime.split(" ").at(0)),
			userRating,
		};
		onAddWatched(newWatchedMovie);
		onCloseMovie();
	};

	useKey("Escape", onCloseMovie);

	useEffect(() => {
		const getMovieDetails = async () => {
			setIsLoading(true);
			const res = await fetch(
				`https://www.omdbapi.com/?apikey=8266c2c&i=${selectedID}`
			);
			const data = await res.json();

			setMovie(data);
			setIsLoading(false);
		};

		getMovieDetails();
	}, [selectedID]);

	useEffect(() => {
		if (!title) return;
		document.title = `Movie | ${title}`;
		return () => {
			document.title = "Movie App";
		};
	}, [title]);

	return (
		<div className='details'>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<header>
						<button className='btn-back' onClick={onCloseMovie}>
							&larr;
						</button>
						<img src={poster} alt={`Poster of ${movie}`} />
						<div className='details-overview'>
							<h2>{title}</h2>
							<p>
								{realesed} &bull; {runtime}
							</p>
							<p>{genre}</p>
							<p>
								<span>⭐</span>
								{imdbRating} IMDb rating
							</p>
						</div>
					</header>
					<section>
						<div className='rating'>
							{!isWatched ? (
								<>
									<StarRating
										maxRating={10}
										size={24}
										onSetRating={setUserRating}
									/>
									{userRating > 0 && (
										<button className='btn-add' onClick={handleAdd}>
											+ Add to list
										</button>
									)}
								</>
							) : (
								<p>
									You rated this movie {watchedUserRating}
									<span>⭐</span>
								</p>
							)}
						</div>
						<p>
							<em>{plot}</em>
						</p>
						<p>Starring {actors}</p>
						<p>Directed {director}</p>
					</section>
				</>
			)}
		</div>
	);
};
