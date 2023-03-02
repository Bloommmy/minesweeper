import {CellState} from './cell_state'
import {Cell} from "./cell"
import {MouseEvent} from "react";

export enum StatusGame {
    game = 'game',
    game_over = 'game_over',
    wow = 'wow',
    finish = 'finish'
}
export class Game {
    field_size: number;
    field: Cell[][];
    game_status: string;
    first_click: boolean;
    mines_sum: number;
    stopwatch_value: number;
    stopwatch: ReturnType<typeof setInterval> | undefined;
    listener?: () => void;

    constructor() {
        this.first_click = false;
        this.field_size = 16;
        this.mines_sum = 6;
        this.game_status = StatusGame.game;
        this.stopwatch_value = 0;
        this.stopwatch = undefined;
        this.field = this.createField();
    }

    createField() {
        const createRow = () => new Array(this.field_size).fill(1).map(() => new Cell(CellState.close, CellState.empty))
        return new Array(this.field_size).fill(1).map(createRow)
    }

    addEventListen(listener: () => void): () => void {
        this.listener = listener
        return () => this.listener = undefined
    }

    pushEvent() {
        if (this.listener) {
            this.listener()
        }
    }

    updateGameStatus(new_status: StatusGame) {
        this.game_status = new_status
    }

    getGameData() {
        return {
            cells: this.field,
            statusGame: this.game_status,
            timer: this.stopwatch_value,
            mines: this.mines_sum
        }
    }

    startStopwatch() {
        this.stopwatch = setInterval(() => {
            this.stopwatch_value = this.stopwatch_value + 1
            this.pushEvent()
        }, 1000)
    }

    stopStopwatch() {
        clearInterval(this.stopwatch)
    }

    onMouseEvent(row: number, column: number, e: MouseEvent<HTMLDivElement>) {
        switch (e.button) {
            case 2:
                if (e.type === 'mouseup') {
                    this.onRightButton(row, column)
                }
                break
            case 0:
                switch (e.type) {
                    case 'mousedown':
                        if (this.field[row][column].visible === CellState.close) {
                            if (this.game_status === StatusGame.game) {
                                this.updateGameStatus(StatusGame.wow)
                            }
                        }
                        break
                    case 'mouseup':
                        if (this.game_status === StatusGame.wow) {
                            this.updateGameStatus(StatusGame.game)
                        }
                        this.onLeftButton(row, column)
                        break
                }
                break
        }
        this.pushEvent()
    }

    onLeftButton(row: number, column: number) {
        if (this.game_status === StatusGame.game_over || this.game_status === StatusGame.finish) {
            return;
        }
        this.startGame(row, column)
        this.openCells(row, column)
    }

    onRightButton(row: number, column: number) {
        if (this.game_status === StatusGame.game_over || this.game_status === StatusGame.finish) {
            return;
        }
        switch (this.field[row][column].visible) {
            case CellState.close:
                this.updateCellVisible(row, column, CellState.flag);
                this.mines_sum = this.mines_sum - 1;
                this.checkFinish();
                break;
            case CellState.flag:
                this.updateCellVisible(row, column, CellState.question);
                this.mines_sum = this.mines_sum + 1;
                break;
            case CellState.question:
                this.updateCellVisible(row, column, CellState.close);
                break;
        }
    }

    startGame(row: number, column: number) {
        if (this.first_click) {
            return;
        }
        this.generatorMines(row, column)
        this.generatorNumbers()
        this.game_status = StatusGame.game
        this.startStopwatch()
        this.first_click = true
    }

    checkFinish() {
        let check_no_mine = true
        this.field.forEach((row) => {
            row.forEach((cell) => {
                if (cell.hidden !== CellState.mine) {
                    if (cell.visible === CellState.close || cell.visible === CellState.flag) {
                        check_no_mine = false
                        return
                    }
                }
            })
        })

        if (!check_no_mine) {
            return;
        }

        this.field.forEach((row, index_row) => {
            row.forEach((cell, index_cell) => {
                if (cell.hidden === CellState.mine) {
                    this.updateCellVisible(index_row, index_cell, CellState.flag);
                }
            })
        })
        this.game_status = StatusGame.finish;
        this.stopStopwatch();
        this.mines_sum = 0;
    }

    openCells(row: number, column: number) {
        if (!this.field[row] || !this.field[row][column]) {
            return;
        }

        if (this.field[row][column].visible === CellState.flag) {
            return;
        }

        if (this.field[row][column].visible !== CellState.question) {
            if (this.field[row][column].visible !== CellState.close) {
                return;
            }
        }

        if (this.field[row][column].hidden === CellState.mine) {
            this.field.forEach((row, index_row) => (
                row.forEach((cell, index_cell) => {
                    if (cell.hidden === CellState.mine) {
                         this.updateCellVisible(index_row, index_cell, CellState.mine)
                    } else {
                        if (cell.visible === CellState.flag) {
                            this.updateCellVisible(index_row, index_cell, CellState.mine_cross)
                        }
                    }
                })
            ))
            this.updateCellVisible(row, column, CellState.mine_red)
            this.game_status = StatusGame.game_over
            this.stopStopwatch()
            return;
        }

        this.updateCellVisible(row, column, this.field[row][column].hidden);

        if (this.field[row][column].hidden === CellState.empty) {
            this.onLeftButton(row - 1, column);
            this.onLeftButton(row + 1, column);
            this.onLeftButton(row - 1, column - 1);
            this.onLeftButton(row +1, column - 1);
            this.onLeftButton(row, column - 1);
            this.onLeftButton(row, column + 1);
            this.onLeftButton(row + 1, column + 1);
            this.onLeftButton(row - 1, column + 1);
        }

        this.checkFinish()
    }

    updateCellVisible(row: number, column: number, new_value: CellState) {
        this.field[row][column]["visible"] = new_value
        this.field = [...this.field]
    }

    updateCellHidden(row: number, column: number, new_value: CellState) {
        this.field[row][column]["hidden"] = new_value
        this.field = [...this.field]
    }

    generatorMines(row: number, column: number) {
        const arrayRandElement = (arr: Number[]) => {
            return Math.floor(Math.random() * arr.length);
        }

        const getRowColumn = (number: Number) => {
            const row = Math.trunc(Number(number) / this.field_size)
            const column = Number(number) - (row * this.field_size)
            return [row, column]
        }

        let start = 0;
        let cells = [];

        while (start < this.field_size * this.field_size) {
            cells.push(start++);
        }

        const first_click = (row * this.field_size) + column
        cells = cells.filter((n) => {return n !== first_click})

        let count = 0;

        while (count < this.mines_sum + 1) {
            const random_index = arrayRandElement(cells)
            const [row, column] = getRowColumn(cells[random_index])

            this.updateCellHidden(row, column, CellState.mine)

            cells = cells.filter((n) => {return n !== random_index})
            count++
        }
    }

    countMinesCircle(row: number, column: number) {
        const around = [
            [-1, -1], [-1, 0], [-1, +1], [0, -1], [0, +1], [+1, -1], [+1, 0], [+1, +1]
        ]

        let count_mine = 0
        around.forEach((cell) => {
            const x = row + cell[0]
            const y = column + cell[1]
            if (this.field[x]) {
                if (this.field[x][y]) {
                    if (this.field[x][y].hidden === CellState.mine) {
                        count_mine++
                    }
                }
            }
        })
        return count_mine
    }

    generatorNumbers() {
        const states = [CellState.number_1, CellState.number_2, CellState.number_3, CellState.number_4, CellState.number_5, CellState.number_6, CellState.number_7, CellState.number_8]
        this.field.forEach((row, index_row) => (
            row.forEach((cell, index_cell) => {
                if (cell.hidden === CellState.empty) {
                    const count_mine = this.countMinesCircle(index_row, index_cell)
                    if (count_mine > 0 ) {
                        this.updateCellHidden(index_row, index_cell, states[count_mine-1])
                    }
                }
            })
        ))
    }
}