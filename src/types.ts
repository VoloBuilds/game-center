export interface Game {
  id: number;
  name: string;
  description: string;
  thumbnail: string; // Emoji character
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Board' | 'Card' | 'Puzzle' | 'Arcade';
  maxPlayers: number;
  route: string;
}

export type GameStatus = 'not_started' | 'in_progress' | 'completed';

export interface GameState {
  currentGame: Game | null;
  gameStatus: GameStatus;
}
