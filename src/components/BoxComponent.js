import React from 'react';
import styles from '../components/BoxComponent'; // Asegúrate de que el nombre del archivo CSS coincida
const BoxComponent = () => {
  return (
    <div className={styles.boxes}>
      <div className={styles.box}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className={styles.box}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className={styles.box}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className={styles.box}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default BoxComponent;
