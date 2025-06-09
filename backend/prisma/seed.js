const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log(' Starting database seeding...');

  // Create genres
  const genres = await Promise.all([
    prisma.genre.create({
      data: {
        name: 'Action',
        description: 'High-energy movies with exciting sequences'
      }
    }),
    prisma.genre.create({
      data: {
        name: 'Drama',
        description: 'Character-driven stories with emotional depth'
      }
    }),
    prisma.genre.create({
      data: {
        name: 'Comedy',
        description: 'Light-hearted movies designed to entertain'
      }
    }),
    prisma.genre.create({
      data: {
        name: 'Thriller',
        description: 'Suspenseful movies that keep you on edge'
      }
    }),
    prisma.genre.create({
      data: {
        name: 'Sci-Fi',
        description: 'Science fiction and futuristic themes'
      }
    })
  ]);

  console.log(' Created genres');

  // Create sample movies
  const movies = await Promise.all([
    prisma.movie.create({
      data: {
        title: 'Stranger Things: The Movie',
        description: 'A supernatural thriller set in the 1980s',
        releaseYear: 2024,
        duration: 120,
        rating: 8.5,
        isTrending: true,
        isNetflixOriginal: true,
        imageUrl: 'https://example.com/stranger-things.jpg',
        trailerUrl: 'https://example.com/stranger-things-trailer.mp4'
      }
    }),
    prisma.movie.create({
      data: {
        title: 'The Crown: Final Season',
        description: 'Historical drama about the British Royal Family',
        releaseYear: 2023,
        duration: 180,
        rating: 9.1,
        isTrending: false,
        isNetflixOriginal: true,
        imageUrl: 'https://example.com/crown.jpg'
      }
    }),
    prisma.movie.create({
      data: {
        title: 'Action Hero',
        description: 'High-octane action movie with stunning visuals',
        releaseYear: 2024,
        duration: 105,
        rating: 7.8,
        isTrending: true,
        isNetflixOriginal: false
      }
    })
  ]);

  console.log(' Created movies');

  // Create movie-genre relations
  await Promise.all([
    // Stranger Things - Thriller & Sci-Fi
    prisma.movieGenre.create({
      data: {
        movieId: movies[0].id,
        genreId: genres[3].id // Thriller
      }
    }),
    prisma.movieGenre.create({
      data: {
        movieId: movies[0].id,
        genreId: genres[4].id // Sci-Fi
      }
    }),
    // The Crown - Drama
    prisma.movieGenre.create({
      data: {
        movieId: movies[1].id,
        genreId: genres[1].id // Drama
      }
    }),
    // Action Hero - Action
    prisma.movieGenre.create({
      data: {
        movieId: movies[2].id,
        genreId: genres[0].id // Action
      }
    })
  ]);

  console.log(' Created movie-genre relations');

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'phuntsho@netflix.com',
        password: 'hashedpassword123', // In real app, this would be hashed
        name: 'phuntsho namgyel',
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'sonam@netflix.com',
        password: 'hashedadminpass',
        name: 'sonam dorji',
        role: 'ADMIN'
      }
    })
  ]);

  console.log(' Created users');

  console.log(' Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(' Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });