import React, {MouseEvent, useEffect, useState} from 'react';
import './App.css';
import Field from './components/field/field'
import Cell from "./components/cell/cell";
import { Game } from "./modules/game"
import Smile from "./components/smile/smile";
import NumbersList from "./components/numbersList/numbersList";
import Header from "./components/header/header";


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
            <Header children={
                <>
                    <NumbersList numerico={gameData.mines}/>
                    <Smile emotion={gameData.statusGame} onClick={() => {
                        game.stopStopwatch()
                        const new_game = new Game()
                        setGame(new_game)
                        setGameData(new_game.getGameData())
                    }}/>
                    <NumbersList numerico={gameData.timer}/>
                </>
            }/>
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
