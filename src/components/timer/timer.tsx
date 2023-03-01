import React, { ReactNode } from 'react';
import styles from './timer.module.css';

type TimerProps = {
    timer: number,
}
function Timer({ timer }: TimerProps) {
    return (
        <div className={styles.timer}>
            <div className={styles.number} data-timer={
                (timer > 999) ? (
                    '9'
                ) : (
                    (String(timer).length >= 3) ? String(timer).split("").reverse()[2] : '0'
                )
            }></div>
            <div className={styles.number} data-timer={
                (timer > 999) ? (
                    '9'
                ) : (
                    (String(timer).length >= 2) ? String(timer).split("").reverse()[1] : '0'
                )
            }></div>
            <div className={styles.number} data-timer={
                (timer > 999) ? (
                    '9'
                ) : (
                    String(timer).split("").reverse()[0]
                )
            }></div>
        </div>
    );
}
export default Timer;