import { Movie } from "./Movie";

export const MovieList = ({ movies, onSelectMovie }) => {
	return (
		<ul className='list list-movies'>
			{movies.map((movie) => (
				<Movie key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie} />
			))}
		</ul>
	);
};
