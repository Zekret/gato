import confetti from "canvas-confetti"
import { useState } from "react"
import { Square } from "./components/Square"
import { WinnerModal } from "./components/WinnerModal"

import { TURNS } from "./constants"
import { checkEndGame, checkWinnerFrom } from "./functions/board"

function App() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [turn, setTurn] = useState(TURNS.X)
  //null sin  ganador, false empate
  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
  }

  const updateBoard = (index) => {
    // no actualizamos esta posición
    // si ya tiene algo
    if (board[index]) return
    // actualizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    //cambiar turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
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
      <h1>Gato</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className="game">
        {
          board.map((_, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {board[index]}
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
