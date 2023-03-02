import React from 'react';
import styles from './numbersList.module.css';

type NumbersListProps = {
    numerico: number,
}
function NumbersList({ numerico }: NumbersListProps) {
    const numerico_view = ('00'+String(Math.min(999, numerico))).split("").reverse()
    return (
        <div className={styles.timer}>
            <div className={styles.number} data-timer={numerico_view[2]}></div>
            <div className={styles.number} data-timer={numerico_view[1]}></div>
            <div className={styles.number} data-timer={numerico_view[0]}></div>
        </div>
    );
}
export default NumbersList;