import { CellStates } from './cell_states'

export class CellState {
    visible: CellStates;
    hidden: CellStates;

    constructor(visible: CellStates, hidden: CellStates) {
        this.visible = visible;
        this.hidden = hidden;
    }
}