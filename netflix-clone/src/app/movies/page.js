import React from "react";
import MovieCard from "@/components/MovieCard";
import Link from "next/link";

const movies = [
  {
    id: 1,
    title: "Movie 1",
    poster_path: "/path_to_poster.jpg",
  },
  {
    id: 2,
    title: "Movie 2",
    poster_path: "/path_to_poster.jpg",
  },
];

export default function MoviesListPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Movies</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movies/${movie.id}`}>
            <MovieCard movie={movie} onSelect={() => {}} />
          </Link>
        ))}
      </div>
    </div>
  );
}
