import React from "react";
import VideoPlayer from "@/components/VideoPlayer";

const mockMovies = [
  {
    id: 1,
    title: "Movie 1",
    poster_path: "/path_to_poster.jpg",
    video_url: "/path_to_video.mp4",
    description: "Description for Movie 1.",
  },
  {
    id: 2,
    title: "Movie 2",
    poster_path: "/path_to_poster.jpg",
    video_url: "/path_to_video.mp4",
    description: "Description for Movie 2.",
  },
];

export default async function MovieDetailPage({ params }) {
  // Await params as per Next.js dynamic route requirements
  const { id } = await params;
  const movie = mockMovies.find((m) => m.id === Number(id));
  if (!movie) return <div className="p-8">Movie not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
      <img
        src={movie.poster_path}
        alt={movie.title}
        className="mb-4 w-48 rounded"
      />
      <p className="mb-4">{movie.description}</p>
      <VideoPlayer videoUrl={movie.video_url} />
    </div>
  );
}
