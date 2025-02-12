import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Game, GameState } from '@/types'
import { TicTacToe } from '@/components/games/TicTacToe'
import { Memory } from '@/components/games/Memory'
import { Snake } from '@/components/games/Snake'

function App() {
  const [theme, setTheme] = useState(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const [games] = useState<Game[]>([
    {
      id: 1,
      name: "Tic Tac Toe",
      description: "Classic game of X's and O's. Get three in a row to win!",
      thumbnail: "🎮",
      difficulty: "Easy",
      category: "Board",
      maxPlayers: 2,
      route: "/games/tictactoe"
    },
    {
      id: 2,
      name: "Memory Game",
      description: "Test your memory by matching pairs of cards.",
      thumbnail: "🃏",
      difficulty: "Medium",
      category: "Card",
      maxPlayers: 1,
      route: "/games/memory"
    },
    {
      id: 3,
      name: "Snake",
      description: "Guide the snake to eat food and grow while avoiding walls and itself.",
      thumbnail: "🐍",
      difficulty: "Medium",
      category: "Arcade",
      maxPlayers: 1,
      route: "/games/snake"
    }
  ]);

  const [gameState, setGameState] = useState<GameState>({
    currentGame: null,
    gameStatus: 'not_started'
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Game Center</h1>
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {gameState.currentGame ? (
          <div>
            <Button 
              variant="outline" 
              className="mb-4"
              onClick={() => setGameState({ currentGame: null, gameStatus: 'not_started' })}
            >
              ← Back to Games
            </Button>
            <h2 className="text-2xl font-bold mb-4">{gameState.currentGame.name}</h2>
            {gameState.currentGame.route === '/games/tictactoe' && (
              <TicTacToe 
                onGameComplete={(winner) => {
                  setGameState(prev => ({
                    ...prev,
                    gameStatus: 'completed'
                  }));
                }}
              />
            )}
            {gameState.currentGame?.route === '/games/memory' && (
              <Memory 
                onGameComplete={(score) => {
                  setGameState(prev => ({
                    ...prev,
                    gameStatus: 'completed'
                  }));
                }}
              />
            )}
            {gameState.currentGame?.route === '/games/snake' && (
              <Snake 
                onGameComplete={(score) => {
                  setGameState(prev => ({
                    ...prev,
                    gameStatus: 'completed'
                  }));
                }}
              />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map(game => (
              <Card key={game.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{game.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-8xl mb-4 text-center">
                    {game.thumbnail}
                  </div>
                  <p className="text-sm text-muted-foreground">{game.description}</p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                      {game.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                      {game.category}
                    </span>
                    <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                      {game.maxPlayers} Player{game.maxPlayers > 1 ? 's' : ''}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => setGameState({ 
                      currentGame: game,
                      gameStatus: 'not_started'
                    })}
                  >
                    Play Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
