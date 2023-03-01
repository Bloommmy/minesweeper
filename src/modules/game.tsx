import {CellStates} from './cell_states'
import {CellState} from "./cell_state"
import {MouseEvent} from "react";

export enum StatusGame {
    new_game = 'new_game',
    game = 'game',
    game_over = 'game_over',
    wow = 'wow',
    wow_new_game = 'wow_new_game',
    finish = 'finish'
}
export class Game {
    cells: CellState[][];
    statusGame: string;
    mines: number;
    timer: number;
    statusTimer: ReturnType<typeof setInterval> | undefined;
    listener?: () => void;

    constructor() {
        this.cells = this.createCells();
        this.statusGame = StatusGame.new_game;
        this.mines = 40;
        this.timer = 0;
        this.statusTimer = undefined;
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

    createCells() {
        const createRow = () => new Array(16).fill(1).map(() => new CellState(CellStates.close, CellStates.empty))
        return new Array(16).fill(1).map(createRow)
    }
    updateGameStatus(new_status: StatusGame) {
        this.statusGame = new_status
    }

    getGameData() {
        return {
            cells: this.cells,
            statusGame: this.statusGame,
            timer: this.timer,
        }
    }

    setTimer(action: string) {
        if (action == 'start') {
            this.statusTimer = setInterval(() => {
                this.timer = this.timer + 1
                this.pushEvent()
            }, 1000)
        } else if (action == 'stop') {
            clearInterval(this.statusTimer)
        }
    }

    onClick(row: number, column: number) {
        if (this.statusGame === StatusGame.wow_new_game) {
            this.generatorMine(row, column)
            this.generatorNumber()
            this.statusGame = StatusGame.game
            this.setTimer('start')
        }

        if (this.statusGame !== StatusGame.game_over) {
            if (this.statusGame != StatusGame.finish) {
                this.openCells(row, column)
            }
        }
    }

    onMouseEvent(row: number, column: number, e: MouseEvent<HTMLDivElement>) {
        if (e.type === 'contextmenu') {
            this.onContextMenu(row, column)
        } else if (e.type === 'mousedown' && e.button === 0) {
            if (this.cells[row][column].visible === CellStates.close) {
                if (this.statusGame === StatusGame.new_game) {
                    this.updateGameStatus(StatusGame.wow_new_game)
                } else if (this.statusGame === StatusGame.game) {
                    this.updateGameStatus(StatusGame.wow)
                }
            }
        } else if (e.type === 'mouseup' && e.button === 0) {
            this.onClick(row, column)
            if (this.statusGame === StatusGame.wow) {
                this.updateGameStatus(StatusGame.game)
            }

        }
        this.pushEvent()
    }

    onContextMenu(row: number, column: number) {
        if (this.statusGame != StatusGame.game_over) {
            if (this.cells[row][column].visible == CellStates.close) {
                this.updateCellVisible(row, column, CellStates.flag);
                this.checkFinish()
            } else if (this.cells[row][column].visible == CellStates.flag) {
                this.updateCellVisible(row, column, CellStates.question);
            } else if (this.cells[row][column].visible == CellStates.question) {
                this.updateCellVisible(row, column, CellStates.close);
            }
        }
    }

    checkFinish() {
        let check_no_mine = true
        this.cells.forEach((row) => {
            row.forEach((cell) => {
                if (cell.hidden != CellStates.mine) {
                    if (cell.visible == CellStates.close) {
                        check_no_mine = false
                        return
                    } else if (cell.visible == CellStates.flag) {
                        check_no_mine = false
                        return
                    }
                }
            })
        })

        if (check_no_mine) {
            this.cells.forEach((row, index_row) => {
                row.forEach((cell, index_cell) => {
                    if (cell.hidden == CellStates.mine) {
                        this.updateCellVisible(index_row, index_cell, CellStates.flag)
                    }
                })
            })
            this.statusGame = StatusGame.finish
            this.setTimer('stop')
        }
    }

    openCells(row: number, column: number) {
        if (!this.cells[row] || !this.cells[row][column]) {
            return;
        }

        if (this.cells[row][column].visible !== CellStates.close) {
            if (this.cells[row][column].visible !== CellStates.flag) {
                if (this.cells[row][column].visible !== CellStates.question) {
                    return;
                }
            }
        }

        if (this.cells[row][column].hidden === CellStates.mine) {
            //Идем по массиву и открываем остальные мины
            this.cells.map((row, index_row) => (
                // eslint-disable-next-line
                row.map((cell, index_cell) => {
                    if (cell.hidden === CellStates.mine) {
                         this.updateCellVisible(index_row, index_cell, CellStates.mine)
                    } else {
                        if (cell.visible == CellStates.flag) {
                            this.updateCellVisible(index_row, index_cell, CellStates.mine_cross)
                        }
                    }
                })
            ))
            this.updateCellVisible(row, column, CellStates.mine_red)
            this.statusGame = StatusGame.game_over
            this.setTimer('stop')
            return;
        }

        this.updateCellVisible(row, column, this.cells[row][column].hidden);

        if (this.cells[row][column].hidden === CellStates.empty) {
            this.onClick(row - 1, column);
            this.onClick(row + 1, column);
            this.onClick(row - 1, column - 1);
            this.onClick(row +1, column - 1);
            this.onClick(row, column - 1);
            this.onClick(row, column + 1);
            this.onClick(row + 1, column + 1);
            this.onClick(row - 1, column + 1);
        }

        this.checkFinish()
    }

    updateCellVisible(row: number, column: number, new_value: CellStates) {
        this.cells[row][column]["visible"] = new_value
        this.cells = [...this.cells]
    }

    updateCellHidden(row: number, column: number, new_value: CellStates) {
        this.cells[row][column]["hidden"] = new_value
        this.cells = [...this.cells]
    }

    generatorMine(firstClickRow: number, firstClickColumn: number) {
        const arrayRandElement = (arr: Number[]) => {
            return Math.floor(Math.random() * arr.length);
        }

        const getRowColumn = (number: Number) => {
            const row = Math.trunc(Number(number)/16)
            const column = Number(number) - (row*16)
            return [row, column]
        }

        let start = 0;
        let cells = [];

        while (start < 16*16) {
            cells.push(start++);
        }

        const firstClick = (firstClickRow * 16) + firstClickColumn
        cells = cells.filter((n) => {return n !== firstClick})

        let count = 0;

        while (count < this.mines + 1) {
            const random_index = arrayRandElement(cells)
            const [row, column] = getRowColumn(cells[random_index])

            this.updateCellHidden(row, column, CellStates.mine)

            cells = cells.filter((n) => {return n !== random_index})
            count++
        }
    }

    countMineCircle(row: number, column: number) {
        const around = [
            [-1, -1], [-1, 0], [-1, +1], [0, -1], [0, +1], [+1, -1], [+1, 0], [+1, +1]
        ]

        let count_mine = 0
        // eslint-disable-next-line
        around.map((cell) => {
            const x = row + cell[0]
            const y = column + cell[1]
            if (this.cells[x]) {
                if (this.cells[x][y]) {
                    if (this.cells[x][y].hidden === CellStates.mine) {
                        count_mine++
                    }
                }
            }
        })
        return count_mine
    }

    generatorNumber() {
        const states = [CellStates.number_1, CellStates.number_2, CellStates.number_3, CellStates.number_4, CellStates.number_5, CellStates.number_6, CellStates.number_7, CellStates.number_8]

        this.cells.map((row, index_row) => (
            // eslint-disable-next-line
            row.map((cell, index_cell) => {
                if (cell.hidden === CellStates.empty) {
                    const count_mine = this.countMineCircle(index_row, index_cell)
                    if (count_mine > 0 ) {
                        this.updateCellHidden(index_row, index_cell, states[count_mine-1])
                    }
                }
            })
        ))
    }
}