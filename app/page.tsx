"use client";

import { useMemo, useState } from "react";

type Player = "X" | "O";
type SquareValue = Player | null;
type BoardState = SquareValue[];

const WINNING_LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const BOARD_SIZE = 9;

const calculateWinner = (
  squares: BoardState,
): { winner: Player | null; line: number[] | null } => {
  for (const [a, b, c] of WINNING_LINES) {
    const first = squares[a];
    if (first && first === squares[b] && first === squares[c]) {
      return { winner: first, line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
};

const getStatusText = (
  winner: Player | null,
  isDraw: boolean,
  currentPlayer: Player,
): string => {
  if (winner) return `Winner: ${winner}`;
  if (isDraw) return "Draw game";
  return `Current player: ${currentPlayer}`;
};

export default function Home() {
  const [squares, setSquares] = useState<BoardState>(
    Array.from({ length: BOARD_SIZE }, () => null),
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");

  const { winner, line } = useMemo(
    () => calculateWinner(squares),
    [squares],
  );
  const isDraw = useMemo(
    () => !winner && squares.every((square) => square !== null),
    [winner, squares],
  );

  const statusText = useMemo(
    () => getStatusText(winner, isDraw, currentPlayer),
    [winner, isDraw, currentPlayer],
  );

  const handleSquareClick = (index: number) => {
    if (winner || squares[index]) {
      return;
    }

    const nextSquares = [...squares];
    nextSquares[index] = currentPlayer;
    setSquares(nextSquares);
    setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
  };

  const resetGame = () => {
    setSquares(Array.from({ length: BOARD_SIZE }, () => null));
    setCurrentPlayer("X");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black px-4 py-10 text-white">
      <main className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur sm:p-10">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
              Tic-Tac-Toe
            </p>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Next.js Strategy Board
            </h1>
            <p className="text-base text-slate-300 sm:text-lg">
              Challenge a friend and claim three in a row.
            </p>
          </div>

          <div className="w-full rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-base font-medium text-slate-100 shadow-inner sm:p-5">
            {statusText}
          </div>

          <div className="grid w-full max-w-md grid-cols-3 gap-3 sm:gap-4">
            {squares.map((value, index) => {
              const isWinningSquare = line?.includes(index) ?? false;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSquareClick(index)}
                  className={`flex aspect-square items-center justify-center rounded-2xl border text-4xl font-semibold transition duration-200 ease-out sm:text-5xl ${
                    value
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-white/10 bg-white/5 text-slate-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
                  } ${isWinningSquare ? "shadow-[0_0_25px_rgba(56,189,248,0.6)] ring-2 ring-sky-400" : ""}`}
                  aria-label={`Square ${index + 1}`}
                >
                  <span className="drop-shadow-sm">{value ?? ""}</span>
                </button>
              );
            })}
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-400">
              Tap a square to place{" "}
              <span className="font-semibold text-white">{currentPlayer}</span>.
            </div>
            <button
              type="button"
              onClick={resetGame}
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white/40 hover:bg-white/10"
            >
              Reset
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
