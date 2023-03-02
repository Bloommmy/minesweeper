import React, { ReactNode } from 'react';
import styles from './header.module.css';

type HeaderProps = {
    children: ReactNode,
}
function Header({ children }: HeaderProps) {
    return (
        <div className={ styles.header }>
            { children }
        </div>
    );
}

export default Header;