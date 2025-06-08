import React from 'react';
import styles from './VideoPlayer.module.css';

const VideoPlayer = ({ videoUrl }) => {
  return (
    <div className={styles.videoContainer}>
      <video className={styles.video} controls>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;