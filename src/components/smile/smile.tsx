import React, { MouseEventHandler } from 'react';
import styles from './smile.module.css';

type SmileProps = {
    emotion: string,
    onClick: MouseEventHandler<HTMLDivElement>,
}
function Smile({ emotion, onClick }: SmileProps) {
    return (
        <div className={styles.Smile} data-game-status={ emotion } onClick={ onClick }></div>
    );
}
export default Smile;