import React, { ReactNode } from 'react';
import styles from './smile.module.css';

type SmileProps = {
    emotion: string,
}
function Smile({ emotion }: SmileProps) {
    return (
        <div className={styles.Smile} data-game-status={ emotion }></div>
    );
}
export default Smile;