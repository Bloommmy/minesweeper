import React, {MouseEventHandler} from 'react';
import styles from './cell.module.css';
import { CellStates } from '../../modules/cell_states';

type CellProps = {
    row: number,
    column: number,
    state: CellStates,
    onContextMenu: MouseEventHandler<HTMLDivElement>,
    onMouseDown: MouseEventHandler<HTMLDivElement>,
    onMouseUp: MouseEventHandler<HTMLDivElement>,
}

function Cell({ row, column, state, onContextMenu, onMouseDown, onMouseUp }: CellProps) {
    return (
        <div className={ styles.cell }
             data-row={ String(row) }
             data-column={ String(column) }
             data-state={ state }
             onContextMenu={ onContextMenu }
             onMouseDown={ onMouseDown }
             onMouseUp={ onMouseUp }
        >
        </div>
    );
}

export default Cell;