import React, { ReactNode } from 'react';
import styles from './field.module.css';

type FieldProps = {
    children: ReactNode,
}
function Field({ children }: FieldProps) {
    return (
        <div className={ styles.field }>
            { children }
        </div>
    );
}

export default Field;