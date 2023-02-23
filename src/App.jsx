import confetti from "canvas-confetti"
import { useState } from "react"
import { Square } from "./components/Square"
import { WinnerModal } from "./components/WinnerModal"

import { TURNS } from "./constants"
import { checkEndGame, checkWinnerFrom } from "./functions/board"
import { resetGameStorage, saveGameToStorage } from "./functions/storage"

function App() {
  //LOS USE STATE NUNCA DENTRO DE UN IF, WHILE, ETC
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  })

  //null sin  ganador, false empate
  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameStorage()
  }

  const updateBoard = (index) => {
    // no actualizamos esta posición
    // si ya tiene algo
    if (board[index] || winner) return
    // actualizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    //cambiar turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    //guardar partida
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })
    //revisar ganador
    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      confetti()
      setWinner(() => {
        return newWinner
      }) // SE UTILIZA UN CALLBACK PARA ARREGLAR EL problema al ver el estado dado que es sincrono dado que no se puede hacer un async await
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }
  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className="game">
        {
          board.map((square, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
        }

      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
        </Square>
        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>

  )
}
export default App
