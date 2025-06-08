"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import MovieCard from "@/components/MovieCard";
import Modal from "@/components/Modal";
import VideoPlayer from "@/components/VideoPlayer";
import {
  FaHome,
  FaSearch,
  FaList,
  FaPlay,
  FaPlus,
  FaFilm,
} from "react-icons/fa";

// Use a larger set of unique poster images for more variety
const movieData = [
  {
    title: "Wonder Woman 1984",
    poster: "https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
  },
  {
    title: "The Croods: A New Age",
    poster: "https://image.tmdb.org/t/p/w500/6KErczPBROQty7QoIsaa6wJYXZi.jpg",
  },
  {
    title: "Tenet",
    poster: "https://image.tmdb.org/t/p/w500/9O1Iy9od7uQ6hXo0xwFq78ZUv2U.jpg",
  },
  {
    title: "The Witches",
    poster: "https://image.tmdb.org/t/p/w500/4ZocdxnOO6q2UbdKye2wgofLFhB.jpg",
  },
  {
    title: "Greenland",
    poster: "https://image.tmdb.org/t/p/w500/6DrHO1jr3qVrViUO6s6kFiAGM7.jpg",
  },
  {
    title: "Monster Hunter",
    poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
  },
  {
    title: "The Call",
    poster: "https://image.tmdb.org/t/p/w500/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
  },
  {
    title: "Joker",
    poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
  },
  {
    title: "The SpongeBob Movie: Sponge on the Run",
    poster: "https://image.tmdb.org/t/p/w500/5KCVkau1HEl7ZzfPsKAPM0sMiKc.jpg",
  },
  {
    title: "Soul",
    poster: "https://image.tmdb.org/t/p/w500/6bCplVkhowCjTHXWv49UjRPn0eK.jpg",
  },
  {
    title: "Avengers: Infinity War",
    poster: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
  },
  {
    title: "Joker (Alt)",
    poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
  },
  {
    title: "The New Mutants",
    poster: "https://image.tmdb.org/t/p/w500/2bXbqYdUdNVa8VIWXVfclP2ICtT.jpg",
  },
  {
    title: "The Lion King",
    poster: "https://image.tmdb.org/t/p/w500/riYInlsq2kf1AWoGm80JQW5dLKp.jpg",
  },
  {
    title: "The Grudge",
    poster: "https://image.tmdb.org/t/p/w500/6agKYU5IQFpuDyUYPu39w7UCRrJ.jpg",
  },
  {
    title: "Parasite",
    poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
  },
  {
    title: "Bloodshot",
    poster: "https://image.tmdb.org/t/p/w500/8WUVHemHFH2ZIP6NWkwlHWsyrEL.jpg",
  },
  {
    title: "The Outpost",
    poster: "https://image.tmdb.org/t/p/w500/4n8QNNdk4BOX9Dslfbz5Dy6j1HK.jpg",
  },
  {
    title: "Hard Kill",
    poster: "https://image.tmdb.org/t/p/w500/6CoRTJTmijhBLJTUNoVSUNxZMEI.jpg",
  },
  {
    title: "Unhinged",
    poster: "https://image.tmdb.org/t/p/w500/2AwPvNHphpZBJDqjZKVuMAbvS0v.jpg",
  },
  {
    title: "The Empty Man",
    poster: "https://image.tmdb.org/t/p/w500/7D430eqZj8y3oVkLFfsWXGRcpEG.jpg",
  },
  {
    title: "The Midnight Sky",
    poster: "https://image.tmdb.org/t/p/w500/6ApDtO7xaWAfPqfi2IARXIzj8QS.jpg",
  },
  {
    title: "Mortal Kombat",
    poster: "https://image.tmdb.org/t/p/w500/9yBVqNruk6Ykrwc32qrK2TIE5xw.jpg",
  },
  {
    title: "Space Sweepers",
    poster: "https://image.tmdb.org/t/p/w500/6zbKgwgaaCyyBXE4Sun4oWQfQmi.jpg",
  },
  { title: "Random Movie 1", poster: "https://picsum.photos/id/1015/400/600" },
  { title: "Random Movie 2", poster: "https://picsum.photos/id/1016/400/600" },
  { title: "Random Movie 3", poster: "https://picsum.photos/id/1025/400/600" },
  { title: "Random Movie 4", poster: "https://picsum.photos/id/1027/400/600" },
  { title: "Random Movie 5", poster: "https://picsum.photos/id/1035/400/600" },
  { title: "Random Movie 6", poster: "https://picsum.photos/id/1041/400/600" },
  { title: "Random Movie 7", poster: "https://picsum.photos/id/1043/400/600" },
  { title: "Random Movie 8", poster: "https://picsum.photos/id/1050/400/600" },
  { title: "Random Movie 9", poster: "https://picsum.photos/id/1062/400/600" },
  { title: "Random Movie 10", poster: "https://picsum.photos/id/1069/400/600" },
];

function Carousel({ title, movies, onSelect }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {movies.map((movie, idx) => (
          <div key={idx} className="flex-shrink-0 w-[160px]">
            <MovieCard movie={movie} onSelect={onSelect} />
          </div>
        ))}
      </div>
    </div>
  );
}

const ALL_MOVIES = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  title: movieData[i % movieData.length].title,
  poster_path: movieData[i % movieData.length].poster,
  video_url: "/path_to_video.mp4",
}));

const PAGE_SIZE = 12;

export default function Page() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  const movies = ALL_MOVIES.slice(0, visibleCount);

  // Infinite scroll logic
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && visibleCount < ALL_MOVIES.length) {
        setLoading(true);
        setTimeout(() => {
          setVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, ALL_MOVIES.length)
          );
          setLoading(false);
        }, 500); // Simulate loading delay
      }
    },
    [visibleCount]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new window.IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
    // For routing to details page in the future:
    // router.push(`/movies/${movie.id}`);
  };

  const allMovies = movieData; // Show all movies in a grid below hero

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <aside className="w-16 flex flex-col items-center py-8 bg-[#141414] space-y-8">
        <FaSearch className="text-2xl text-gray-400 hover:text-white cursor-pointer" />
        <FaHome className="text-2xl text-red-600" />
        <FaFilm className="text-2xl text-gray-400 hover:text-white cursor-pointer" />
        <FaList className="text-2xl text-gray-400 hover:text-white cursor-pointer" />
        <FaPlus className="text-2xl text-gray-400 hover:text-white cursor-pointer" />
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-0 md:px-8 pb-8">
        {/* Hero Banner */}
        <section className="relative flex flex-col md:flex-row items-center md:items-end bg-gradient-to-r from-black via-[#181818] to-transparent h-[400px] md:h-[440px] w-full overflow-hidden mb-10">
          <div className="z-10 p-8 md:w-1/2 flex flex-col justify-center h-full">
            <div className="mb-2">
              <span className="text-xs text-red-600 font-bold tracking-widest">
                N SERIES
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-2">
              <span className="font-light">MONEY</span>
              <span className="ml-2 px-2 bg-red-600 text-white rounded">
                HEIST
              </span>
            </h1>
            <div className="text-gray-300 text-lg mb-2">PART 4</div>
            <div className="flex items-center gap-4 mb-2">
              <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                IMDb
              </span>
              <span className="text-white font-semibold">8.8/10</span>
              <span className="text-red-500 font-bold">2B+ Streams</span>
            </div>
            <div className="flex gap-4 mt-4">
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded flex items-center gap-2">
                <FaPlay /> Play
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-6 rounded">
                Watch Trailer
              </button>
            </div>
          </div>
          <img
            src="./movies/money_heist_banner.jpg"
            alt="Money Heist Banner"
            className="absolute right-0 top-0 h-full object-cover w-full md:w-2/3 opacity-60 md:opacity-100"
            style={{ objectPosition: "right" }}
          />
        </section>

        {/* All Movies Grid */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-white mb-4">All Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {allMovies.map((movie, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  handleCardClick({
                    ...movie,
                    video_url: movie.video_url || "/path_to_video.mp4",
                  })
                }
                className="flex flex-col items-center group focus:outline-none"
                tabIndex={0}
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-[140px] h-[210px] object-cover rounded-lg shadow-md mb-2 transition-transform duration-200 group-hover:scale-105 group-focus:scale-105 group-hover:ring-2 group-hover:ring-red-600"
                  style={{ background: "#222" }}
                />
                <span className="text-white text-sm text-center group-hover:text-red-500 group-focus:text-red-500 transition-colors">
                  {movie.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal for video */}
        <Modal isOpen={!!selectedMovie} onClose={() => setSelectedMovie(null)}>
          {selectedMovie && (
            <div>
              <h2 className="text-xl font-semibold mb-2 text-white">
                {selectedMovie.title}
              </h2>
              <VideoPlayer
                videoUrl={selectedMovie.video_url || "/path_to_video.mp4"}
              />
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}
