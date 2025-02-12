import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface SnakeProps {
  onGameComplete: (score: number) => void;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE_LENGTH = 3;
const GAME_SPEED = 100;

export function Snake({ onGameComplete }: SnakeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Game state refs to avoid closure issues in event listeners
  const directionRef = useRef<Direction>('RIGHT');
  const snakeRef = useRef<Position[]>([]);
  const foodRef = useRef<Position>({ x: 0, y: 0 });
  const gameLoopRef = useRef<number>();

  const initializeGame = () => {
    // Initialize snake in the middle of the grid
    const startX = Math.floor(GRID_SIZE / 4);
    const startY = Math.floor(GRID_SIZE / 2);
    
    snakeRef.current = Array(INITIAL_SNAKE_LENGTH)
      .fill(null)
      .map((_, i) => ({ x: startX - i, y: startY }));
    
    directionRef.current = 'RIGHT';
    spawnFood();
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const spawnFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    
    // Ensure food doesn't spawn on snake
    while (snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      newFood.x = Math.floor(Math.random() * GRID_SIZE);
      newFood.y = Math.floor(Math.random() * GRID_SIZE);
    }
    
    foodRef.current = newFood;
  };

  const moveSnake = () => {
    if (isGameOver || isPaused) return;

    const head = { ...snakeRef.current[0] };
    
    switch (directionRef.current) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
    }

    // Check wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      handleGameOver();
      return;
    }

    // Check self collision
    if (snakeRef.current.some(segment => segment.x === head.x && segment.y === head.y)) {
      handleGameOver();
      return;
    }

    const newSnake = [head, ...snakeRef.current];
    
    // Check food collision
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore(prev => prev + 10);
      spawnFood();
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    draw();
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    onGameComplete(score);
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = '#4ade80';
    snakeRef.current.forEach((segment, index) => {
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE - 1,
        CELL_SIZE - 1
      );
      
      // Draw snake eyes on head
      if (index === 0) {
        ctx.fillStyle = 'black';
        const eyeSize = 3;
        // Position eyes based on direction
        let leftEye, rightEye;
        switch (directionRef.current) {
          case 'RIGHT':
            leftEye = { x: segment.x * CELL_SIZE + 15, y: segment.y * CELL_SIZE + 5 };
            rightEye = { x: segment.x * CELL_SIZE + 15, y: segment.y * CELL_SIZE + 15 };
            break;
          case 'LEFT':
            leftEye = { x: segment.x * CELL_SIZE + 5, y: segment.y * CELL_SIZE + 5 };
            rightEye = { x: segment.x * CELL_SIZE + 5, y: segment.y * CELL_SIZE + 15 };
            break;
          case 'UP':
            leftEye = { x: segment.x * CELL_SIZE + 5, y: segment.y * CELL_SIZE + 5 };
            rightEye = { x: segment.x * CELL_SIZE + 15, y: segment.y * CELL_SIZE + 5 };
            break;
          case 'DOWN':
            leftEye = { x: segment.x * CELL_SIZE + 5, y: segment.y * CELL_SIZE + 15 };
            rightEye = { x: segment.x * CELL_SIZE + 15, y: segment.y * CELL_SIZE + 15 };
            break;
        }
        ctx.fillRect(leftEye.x, leftEye.y, eyeSize, eyeSize);
        ctx.fillRect(rightEye.x, rightEye.y, eyeSize, eyeSize);
        ctx.fillStyle = '#4ade80';
      }
    });

    // Draw food
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(
      foodRef.current.x * CELL_SIZE + CELL_SIZE / 2,
      foodRef.current.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isGameOver) return;

      const newDirection: { [key: string]: Direction } = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
      };

      if (newDirection[e.key]) {
        // Prevent 180-degree turns
        const invalidMoves = {
          UP: 'DOWN',
          DOWN: 'UP',
          LEFT: 'RIGHT',
          RIGHT: 'LEFT',
        };

        if (invalidMoves[newDirection[e.key]] !== directionRef.current) {
          directionRef.current = newDirection[e.key];
        }
      }

      // Handle pause with spacebar
      if (e.code === 'Space') {
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGameOver]);

  useEffect(() => {
    initializeGame();
    gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-between w-full max-w-[400px] mb-2">
        <span className="text-lg font-bold">Score: {score}</span>
        <Button variant="outline" onClick={() => setIsPaused(prev => !prev)}>
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
      </div>
      
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        className="border border-primary"
      />

      {isGameOver && (
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Game Over!</h3>
          <p className="mb-4">Final Score: {score}</p>
          <Button onClick={initializeGame}>Play Again</Button>
        </div>
      )}

      <div className="mt-4 text-sm text-muted-foreground text-center">
        <p>Use arrow keys to move</p>
        <p>Press space to pause/resume</p>
      </div>
    </div>
  );
} 