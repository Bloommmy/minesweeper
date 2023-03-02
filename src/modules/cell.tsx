import { CellState } from './cell_state'

export class Cell {
    visible: CellState;
    hidden: CellState;

    constructor(visible: CellState, hidden: CellState) {
        this.visible = visible;
        this.hidden = hidden;
    }
}