import React, {MouseEvent, useEffect, useState} from 'react';
import './App.css';
import Field from './components/field/field'
import Cell from "./components/cell/cell";
import {Game, StatusGame} from "./modules/game"
import Smile from "./components/smile/smile";
import Timer from "./components/timer/timer";


function App() {
    // eslint-disable-next-line
    const [ game, setGame ] = useState(new Game());
    const [ gameData, setGameData ] = useState(game.getGameData())

    const onClick = (index_row: number, index_cell: number, e: MouseEvent<HTMLDivElement>) => {
        game.onMouseEvent(index_row, index_cell, e)
    }

    useEffect(() => {
        return game.addEventListen(() => {
            setGameData(game.getGameData())
        })
    })
    return (
        <div className="App">
            <div className="Header">
                <Smile emotion={gameData.statusGame}/>
                <Timer timer={gameData.timer}/>
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
