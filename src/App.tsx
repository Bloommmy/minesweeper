import React, {MouseEvent, useState} from 'react';
import './App.css';
import Field from './components/field/field'
import Cell from "./components/cell/cell";
import {Game, StatusGame} from "./modules/game"
import Smile from "./components/smile/smile";


function App() {
    // eslint-disable-next-line
    const [ game, setGame ] = useState(new Game());
    const [ gameData, setGameData ] = useState(game.getGameData())
    let timer: ReturnType<typeof setTimeout>;

    const onClick = (index_row: number, index_cell: number, e: MouseEvent<HTMLDivElement>) => {
        if (e.type === 'contextmenu') {
            console.log('contextmenu')
            game.onContextMenu(index_row, index_cell)
        } else if (e.type === 'mousedown' && e.button === 0) {
            if (game.statusGame === StatusGame.new_game) {
                game.updateGameStatus(StatusGame.wow_new_game)
            } else {
                game.updateGameStatus(StatusGame.wow)
            }

        } else if (e.type === 'mouseup' && e.button === 0) {
            game.onClick(index_row, index_cell)
            if (game.statusGame === StatusGame.wow) {
                game.updateGameStatus(StatusGame.game)
            }

        }
        setGameData(game.getGameData())
    }
    return (
        <div className="App">
            <div className="Header">
                <Smile emotion={gameData.statusGame}/>
                <div>{gameData.timer}</div>
            </div>
            <Field children={
                gameData.cells.map(
                    (row, index_row) => row.map(
                        (cell, index_cell) =>
                            <Cell
                                row={ index_row }
                                column={ index_cell }
                                state={ cell["visible"] }
                                key={ String(index_row) + '_' + String(index_cell) }
                                onContextMenu={ (e) => {
                                    e.preventDefault()
                                    onClick(index_row, index_cell, e)
                                }}
                                onMouseDown={ (e) => {
                                    onClick(index_row, index_cell, e)
                                } }
                                onMouseUp={ (e) => {
                                    onClick(index_row, index_cell, e)
                                }}
                            ></Cell>
                    )
                )
            }/>
        </div>
    );
}

export default App;
