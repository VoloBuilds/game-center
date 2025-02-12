import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TicTacToeProps {
  onGameComplete: (winner: string | null) => void;
}

export function TicTacToe({ onGameComplete }: TicTacToeProps) {
  const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const calculateWinner = (squares: Array<string | null>): string | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || calculateWinner(board)) return;

    const newBoard = board.slice();
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);

    const winner = calculateWinner(newBoard);
    if (winner || newBoard.every(square => square !== null)) {
      onGameComplete(winner);
    }
  };

  const winner = calculateWinner(board);
  const status = winner
    ? `Winner: ${winner}`
    : board.every(square => square !== null)
      ? "Game Draw!"
      : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="text-lg font-bold mb-4">{status}</div>
      <div className="grid grid-cols-3 gap-2">
        {board.map((square, index) => (
          <Button
            key={index}
            variant={square ? "default" : "outline"}
            className="h-16 text-2xl font-bold"
            onClick={() => handleClick(index)}
            disabled={!!square || !!winner}
          >
            {square}
          </Button>
        ))}
      </div>
      <Button 
        className="w-full mt-4"
        variant="outline"
        onClick={() => {
          setBoard(Array(9).fill(null));
          setXIsNext(true);
        }}
      >
        Reset Game
      </Button>
    </Card>
  );
} 