import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MemoryProps {
  onGameComplete: (score: number) => void;
}

interface MemoryCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎪', '🎯'];

export function Memory({ onGameComplete }: MemoryProps) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);

  // Initialize game
  useEffect(() => {
    const shuffledEmojis = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledEmojis);
  }, []);

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      if (cards[first].emoji === cards[second].emoji) {
        // Match found
        setCards(prev => prev.map((card, idx) =>
          idx === first || idx === second
            ? { ...card, isMatched: true }
            : card
        ));
      }
      
      // Reset flipped cards after a delay
      setTimeout(() => {
        setCards(prev => prev.map((card, idx) =>
          !card.isMatched && (idx === first || idx === second)
            ? { ...card, isFlipped: false }
            : card
        ));
        setFlippedCards([]);
      }, 1000);
    }
  }, [flippedCards, cards]);

  // Check for game completion
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setIsGameComplete(true);
      onGameComplete(moves);
    }
  }, [cards, moves, onGameComplete]);

  const handleCardClick = (index: number) => {
    if (
      flippedCards.length === 2 ||
      cards[index].isFlipped ||
      cards[index].isMatched
    ) {
      return;
    }

    setCards(prev => prev.map((card, idx) =>
      idx === index ? { ...card, isFlipped: true } : card
    ));
    
    setFlippedCards(prev => [...prev, index]);
    if (flippedCards.length === 1) {
      setMoves(prev => prev + 1);
    }
  };

  const resetGame = () => {
    const shuffledEmojis = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledEmojis);
    setFlippedCards([]);
    setMoves(0);
    setIsGameComplete(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <div className="text-lg font-semibold">Moves: {moves}</div>
        <Button onClick={resetGame}>Reset Game</Button>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            className={`aspect-square flex items-center justify-center text-4xl cursor-pointer transition-all duration-300 ${
              card.isFlipped || card.isMatched ? 'bg-primary/10' : 'bg-primary/5'
            }`}
            onClick={() => handleCardClick(index)}
          >
            {(card.isFlipped || card.isMatched) ? card.emoji : '❓'}
          </Card>
        ))}
      </div>

      {isGameComplete && (
        <div className="mt-4 text-center">
          <h3 className="text-2xl font-bold mb-2">Congratulations! 🎉</h3>
          <p className="text-lg">You completed the game in {moves} moves!</p>
        </div>
      )}
    </div>
  );
} 