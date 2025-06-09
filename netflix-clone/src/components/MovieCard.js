import React from 'react';
import styles from './MovieCard.module.css';

export default function MovieCard({ movie, onSelect }) {
  return (
    <div className={styles.card} onClick={() => onSelect(movie)}>
      <img
        src={movie.poster_path}
        alt={movie.title}
        className={styles.poster}
      />
      <h3 className={styles.title}>{movie.title}</h3>
    </div>
  );
}