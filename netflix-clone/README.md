# Netflix Clone

Final Group Project for WEB101 & WEB102 – Netflix Clone

## Component Structure

- **NavBar**: Top navigation bar, persistent across pages.
- **Footer**: Bottom footer, persistent across pages.
- **MovieCard**: Displays a movie poster and title, reusable in lists.
- **HeroBanner**: (Planned) Large banner for featured content.
- **VideoPlayer**: Plays movie trailers or content.
- **Modal**: Reusable modal for dialogs and overlays.
- **Button**: (Planned) Reusable button component.

## Routing Logic

- Uses Next.js `app/` directory routing.
- **Home Page**: `/` – Shows movie list.
- **Movies List**: `/movies` – (Planned) Full list of movies.
- **Movie Details**: `/movies/[id]` – Dynamic route for movie details.
- **Protected Routes**: (Planned) Middleware for authentication-protected pages.

## UI Decisions

- **Tailwind CSS** for rapid, responsive UI development.
- **Dark Mode**: Uses CSS variables and media queries for dark/light themes.
- **Reusable Components**: Modular approach for maintainability.
- **Responsive Design**: Uses Tailwind's grid and utility classes for mobile-first layouts.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
