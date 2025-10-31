import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ColorSequencePuzzle from "@/components/puzzles/ColorSequencePuzzle";
import NumberPatternPuzzle from "@/components/puzzles/NumberPatternPuzzle";
import MemoryClickPuzzle from "@/components/puzzles/MemoryClickPuzzle";
import SortingPuzzle from "@/components/puzzles/SortingPuzzle";
import ColorCodePuzzle from "@/components/puzzles/ColorCodePuzzle";
import CompletionMessage from "@/components/CompletionMessage";

// Componente principal del juego de puzzles
const Index = () => {
  // Estado: índice del puzzle actual (0 = primero, 1 = segundo, etc.)
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  
  // Estado: tiempo de inicio del juego (para calcular tiempo total)
  const [startTime] = useState(Date.now());
  
  // Estado: tiempo total cuando se completa el juego
  const [totalTime, setTotalTime] = useState(0);
  
  // Estado: indica si el juego está completado
  const [gameCompleted, setGameCompleted] = useState(false);

  // Lista de todos los puzzles del juego
  const puzzles = [
    { id: 1, component: ColorSequencePuzzle, name: "Secuencia de Colores" },
    { id: 2, component: NumberPatternPuzzle, name: "Patrón Numérico" },
    { id: 3, component: MemoryClickPuzzle, name: "Memoria de Clicks" },
    { id: 4, component: SortingPuzzle, name: "Ordenamiento" },
    { id: 5, component: ColorCodePuzzle, name: "Código de Colores" },
  ];

  // Función que se ejecuta cuando se completa un puzzle
  const handlePuzzleComplete = () => {
    // Si era el último puzzle, terminar el juego
    if (currentPuzzleIndex === puzzles.length - 1) {
      const endTime = Date.now();
      const timeTaken = Math.floor((endTime - startTime) / 1000); // en segundos
      setTotalTime(timeTaken);
      setGameCompleted(true);
    } else {
      // Si no, pasar al siguiente puzzle
      setCurrentPuzzleIndex(currentPuzzleIndex + 1);
    }
  };

  // Obtener el componente del puzzle actual
  const CurrentPuzzleComponent = puzzles[currentPuzzleIndex].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(210,100%,97%)] via-[hsl(200,100%,95%)] to-[hsl(190,100%,97%)] flex items-center justify-center p-4">
      {/* Si el juego está completado, mostrar mensaje final */}
      {gameCompleted ? (
        <CompletionMessage totalTime={totalTime} />
      ) : (
        <div className="w-full max-w-2xl animate-slide-up">
          {/* Indicador de progreso */}
          <div className="mb-6 flex justify-center items-center gap-2">
            {puzzles.map((puzzle, index) => (
              <div
                key={puzzle.id}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentPuzzleIndex
                    ? "w-12 bg-primary"
                    : index < currentPuzzleIndex
                    ? "w-8 bg-secondary"
                    : "w-8 bg-border"
                }`}
              />
            ))}
          </div>

          {/* Card contenedor del puzzle actual */}
          <Card className="p-8 shadow-2xl border-0 animate-bounce-in">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Puzzle {currentPuzzleIndex + 1} de {puzzles.length}
              </h2>
              <p className="text-muted-foreground">
                {puzzles[currentPuzzleIndex].name}
              </p>
            </div>

            {/* Renderizar el puzzle actual */}
            <CurrentPuzzleComponent onComplete={handlePuzzleComplete} />
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;
